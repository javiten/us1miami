import { get } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { and, eq, sql } from "drizzle-orm"
import { getSessionUser } from "@/lib/session"
import { db } from "@/lib/db"
import { packages } from "@/lib/db/schema"

export async function GET(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const pathname = request.nextUrl.searchParams.get("pathname")
  if (!pathname) {
    return NextResponse.json({ error: "Missing pathname" }, { status: 400 })
  }

  // Admins can view any photo. Customers can only view photos attached to their own packages.
  if (user.role !== "ADMIN") {
    const rows = await db
      .select({ id: packages.id })
      .from(packages)
      .where(
        and(
          eq(packages.userId, user.id),
          sql`${packages.photos}::jsonb @> ${JSON.stringify([pathname])}::jsonb`,
        ),
      )
      .limit(1)
    if (rows.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  try {
    const result = await get(pathname, {
      access: "private",
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    })

    if (!result) return new NextResponse("Not found", { status: 404 })

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: { ETag: result.blob.etag, "Cache-Control": "private, no-cache" },
      })
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType,
        ETag: result.blob.etag,
        "Cache-Control": "private, no-cache",
      },
    })
  } catch (error) {
    console.error("[v0] Error serving photo:", error)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}
