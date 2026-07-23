import { requireCustomer } from "@/lib/session"
import { PortalShell, type NavGroup } from "@/components/portal/shell"

const NAV: NavGroup[] = [
  {
    items: [
      { href: "/panel", label: "Inicio", icon: "LayoutDashboard" },
      { href: "/panel/paquetes", label: "Mis paquetes", icon: "Package" },
      { href: "/panel/prealertar", label: "Prealertar paquete", icon: "BellPlus" },
      { href: "/panel/consolidaciones", label: "Consolidaciones", icon: "Boxes" },
      { href: "/panel/envios", label: "Mis envíos", icon: "Plane" },
    ],
  },
  {
    title: "Mi cuenta",
    items: [
      { href: "/panel/facturas", label: "Facturas", icon: "Receipt" },
      { href: "/panel/billetera", label: "Billetera", icon: "Wallet" },
      { href: "/panel/direccion", label: "Mi dirección", icon: "MapPin" },
      { href: "/panel/perfil", label: "Mi perfil", icon: "User" },
      { href: "/panel/ayuda", label: "Ayuda", icon: "LifeBuoy" },
    ],
  },
]

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCustomer()
  return (
    <PortalShell
      variant="customer"
      groups={NAV}
      user={{ name: user.name, email: user.email, boxNumber: user.boxNumber }}
    >
      {children}
    </PortalShell>
  )
}
