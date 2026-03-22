"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Package,
  FileText,
  ConciergeBell,
  CalendarCheck,
  Bell,
  UserCircle,
  LogOut,
  ChefHat,
  Menu,
  X,
} from "lucide-react";

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
  { name: "Orders", href: "/admin/orders", icon: ConciergeBell },
  { name: "Reservations", href: "/admin/reservations", icon: CalendarCheck },
  { name: "Staff", href: "/admin/staff", icon: Users },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Profile", href: "/admin/profile", icon: UserCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Session check
  useEffect(() => {
    if (pathname === "/admin/login") return;
    const auth = sessionStorage.getItem("dulce_admin_auth");
    const authTime = sessionStorage.getItem("dulce_admin_time");
    if (!auth || !authTime) {
      router.push("/admin/login");
      return;
    }
    // Expire after 8 hours
    const elapsed = Date.now() - parseInt(authTime);
    if (elapsed > 8 * 60 * 60 * 1000) {
      sessionStorage.removeItem("dulce_admin_auth");
      sessionStorage.removeItem("dulce_admin_time");
      router.push("/admin/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    sessionStorage.removeItem("dulce_admin_auth");
    sessionStorage.removeItem("dulce_admin_time");
    document.cookie = "dulce_admin_auth=; path=/admin; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <div className="bg-[#0F0F0F] text-white min-h-screen font-body">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#111111] text-white font-body">
      {/* ── Mobile Header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#161616] border-b border-white/5 flex items-center justify-between px-5 z-[60] shadow-xl">
        <Link href="/admin" className="flex items-center gap-2.5 font-heading font-bold text-base tracking-widest">
          <div className="w-8 h-8 rounded-lg bg-[#BF5933] flex items-center justify-center">
            <ChefHat size={16} className="text-white" />
          </div>
          <span className="text-white">DULCE</span>
          <span className="text-[#BF5933]">ADMIN</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile Overlay ── */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[50]"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 w-[240px] bg-[#161616] border-r border-white/5
          flex flex-col h-full flex-shrink-0 z-[55]
          transition-transform duration-300 ease-in-out md:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          shadow-2xl
        `}
      >
        {/* Sidebar Brand */}
        <div className="hidden md:flex items-center gap-3 px-6 py-6 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#BF5933] to-[#8B3D1F] flex items-center justify-center shadow-lg shadow-[#BF5933]/30">
            <ChefHat size={18} className="text-white" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base tracking-widest leading-none">
              DULCE
            </h2>
            <span className="text-[#BF5933] text-[10px] font-bold tracking-[0.3em] uppercase leading-none">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Mobile spacer */}
        <div className="md:hidden h-16 flex-shrink-0" />

        {/* Nav Section */}
        <div className="px-3 pt-4 flex-shrink-0">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] px-3 mb-2">Main Menu</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-4">
          {adminNav.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  group flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? "bg-[#BF5933] text-white shadow-lg shadow-[#BF5933]/20"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`flex-shrink-0 ${isActive ? "text-white" : "text-white/50 group-hover:text-white"}`}
                />
                <span className={`text-sm font-semibold tracking-wide ${isActive ? "text-white" : ""}`}>
                  {link.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 mb-3 h-px bg-white/5" />

        {/* Logout */}
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-200 group"
          >
            <LogOut size={18} className="flex-shrink-0 text-red-400/60 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-semibold tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto mt-16 md:mt-0 bg-[#111111]">
        <div className="max-w-[1440px] mx-auto p-5 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
