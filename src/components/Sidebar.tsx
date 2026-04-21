import { useApp } from "@/lib/app-context";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarCheck2,
  UtensilsCrossed,
  Receipt,
  CalendarDays,
  Users,
  CalendarRange,
  ClipboardList,
  Boxes,
  Building2,
} from "lucide-react";
import type { TKey } from "@/lib/i18n";
import type { Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export interface NavItem {
  to: string;
  labelKey: TKey;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

export const navItems: NavItem[] = [
  { to: "/", labelKey: "dashboard", icon: LayoutDashboard, roles: ["employee", "manager", "hr", "canteen"] },
  { to: "/attendance", labelKey: "attendance", icon: CalendarCheck2, roles: ["employee", "manager", "hr"] },
  { to: "/food", labelKey: "foodMenu", icon: UtensilsCrossed, roles: ["employee", "manager", "hr"] },
  { to: "/orders", labelKey: "myOrders", icon: Receipt, roles: ["employee", "manager", "hr"] },
  { to: "/leave", labelKey: "leaveManagement", icon: CalendarDays, roles: ["employee", "manager", "hr"] },
  { to: "/team-calendar", labelKey: "teamCalendar", icon: CalendarRange, roles: ["manager", "hr"] },
  { to: "/employees", labelKey: "employees", icon: Users, roles: ["hr"] },
  { to: "/canteen-orders", labelKey: "canteenOrders", icon: ClipboardList, roles: ["canteen"] },
  { to: "/inventory", labelKey: "inventory", icon: Boxes, roles: ["canteen"] },
];

export function Sidebar() {
  const { role, t, dir } = useApp();
  const location = useLocation();
  const items = navItems.filter((i) => i.roles.includes(role));

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 shrink-0 bg-sidebar text-sidebar-foreground border-sidebar-border",
        dir === "rtl" ? "border-l" : "border-r"
      )}
    >
      <div className="px-6 py-5 border-b border-sidebar-border flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
          <Building2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-semibold text-sm leading-tight">{t("appName")}</div>
          <div className="text-[11px] text-sidebar-foreground/60">{t("appTagline")}</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-smooth",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t border-sidebar-border text-[11px] text-sidebar-foreground/50">
        v1.0 · Demo Mode
      </div>
    </aside>
  );
}
