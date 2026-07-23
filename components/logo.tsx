import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  // `className` controls the rendered height (defaults to h-11). On dark backgrounds
  // (e.g. the navy admin sidebar) `dark` renders a crisp white version of the same asset.
  return (
    <div className="flex items-center">
      <Image
        src="/us1-miami-logo.png"
        alt="US1 Miami — International Courier, Miami to Argentina"
        width={1250}
        height={1218}
        priority
        className={cn("h-11 w-auto", dark && "brightness-0 invert", className)}
      />
    </div>
  )
}
