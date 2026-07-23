import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/session"

export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const ext = (file.type.split("/")[1] ?? "jpg").replace("jpeg", "jpg")
    const key = `packages/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const blob = await put(key, file, { access: "private" })

    // Return the pathname; images are served through the authenticated delivery route.
    return NextResponse.json({ pathname: blob.pathname })
  } catch (error) {
    console.error("[v0] Photo upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
