import { useApp } from "@/lib/app-context";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, ShoppingCart, Bell, Menu, Building2, LogOut } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import type { Role } from "@/lib/mock-data";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { navItems } from "./Sidebar";
import { cn } from "@/lib/utils";

export function Header() {
  const { t, lang, setLang, role, currentUser, cartCount, logout } = useApp();
  const location = useLocation();
  const items = navItems.filter((i) => i.roles.includes(role));

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={lang === "ar" ? "right" : "left"} className="w-[280px] sm:w-[320px] p-0">
              <SheetHeader className="p-6 border-b text-left">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Building2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <SheetTitle className="text-sm font-semibold leading-tight text-left">{t("appName")}</SheetTitle>
                    <SheetDescription className="text-[11px] text-left">{t("appTagline")}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="flex flex-col h-[calc(100vh-80px)]">
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.to;
                    return (
                      <SheetTrigger asChild key={item.to}>
                        <Link
                          to={item.to}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-smooth",
                            active
                              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                              : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{t(item.labelKey)}</span>
                        </Link>
                      </SheetTrigger>
                    );
                  })}
                </nav>
                <div className="p-4 border-t">
                  <Button variant="outline" className="w-full justify-start text-destructive" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{t("welcome")},</div>
            <div className="font-semibold text-sm truncate">
              {lang === "ar" ? currentUser.nameAr : currentUser.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">


          {/* Cart */}
          {(role === "employee" || role === "manager" || role === "hr") && (
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link to="/food">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px] bg-accent text-accent-foreground"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="gap-1.5"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "en" ? "AR" : "EN"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>


    </header>
  );
}
