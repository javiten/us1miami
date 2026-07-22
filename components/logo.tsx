import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  // `dark` kept for API compatibility; the official logo asset is used as-is in every context.
  void dark
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/us1-miami-logo.png"
        alt="US1 Miami — International Courier, Miami to Argentina"
        width={1250}
        height={1218}
        priority
        className="h-11 w-auto"
      />
    </div>
  )
}
