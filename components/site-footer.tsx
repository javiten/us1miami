"use client"

import { Phone, Mail, MapPin } from "lucide-react"
import { Logo } from "@/components/logo"
import { useI18n } from "@/components/language-provider"

export function SiteFooter() {
  const { t } = useI18n()
  return (
    <footer className="border-t border-border bg-navy">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Logo dark />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {t.footer.tagline}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-12">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky">{t.footer.contact}</p>
              <a
                href="tel:+13059679756"
                className="flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-sky" />
                {"(305) 967-9756"}
              </a>
              <a
                href="mailto:info@us1trade.com"
                className="flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-sky" />
                info@us1trade.com
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky">{t.footer.location}</p>
              <span className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4 text-sky" />
                {t.footer.locationValue}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} US1 Trade — {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
