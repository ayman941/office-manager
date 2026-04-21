import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { CheckInCard } from "@/components/CheckInCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Stethoscope,
  Coffee,
  Package,
  ArrowRight,
  ChefHat,
  Truck,
  CheckCheck,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Office — Dashboard" },
      { name: "description", content: "Unified workplace platform for HR operations and buffet services." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { role } = useApp();
  return (
    <AppLayout>
      {role === "canteen" ? <CanteenDashboard /> : role === "hr" ? <HRDashboard /> : <EmployeeDashboard />}
    </AppLayout>
  );
}

function EmployeeDashboard() {
  const { t, leaveBalance, orders, currentUser } = useApp();
  const myActiveOrder = orders.find(
    (o) => o.employeeName === currentUser.name && o.status !== "delivered"
  );

  const balanceItems = [
    { icon: CalendarDays, label: t("annualLeave"), value: leaveBalance.annual, color: "text-info" },
    { icon: Stethoscope, label: t("sickLeave"), value: leaveBalance.sick, color: "text-success" },
    { icon: Coffee, label: t("casualLeave"), value: leaveBalance.casual, color: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <CheckInCard />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Leave balances */}
        <Card className="lg:col-span-2 p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">{t("leaveBalance")}</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/leave">{t("requestLeave")} <ArrowRight className="h-3 w-3 ml-1 rtl:rotate-180" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {balanceItems.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="rounded-xl border p-4 bg-gradient-subtle">
                  <Icon className={`h-5 w-5 ${b.color}`} />
                  <div className="mt-3 text-3xl font-bold tabular-nums">{b.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{b.label} · {t("days")}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick actions */}
        <Card className="p-6 shadow-card">
          <h2 className="font-semibold text-lg mb-4">{t("quickActions")}</h2>
          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start h-11">
              <Link to="/food"><Coffee className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />{t("foodMenu")}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-11">
              <Link to="/leave"><CalendarDays className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />{t("requestLeave")}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-11">
              <Link to="/orders"><Package className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />{t("myOrders")}</Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Order Tracker */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">{t("orderTracker")}</h2>
          {myActiveOrder && <Badge variant="outline" className="font-mono text-xs">{myActiveOrder.id}</Badge>}
        </div>
        {myActiveOrder ? (
          <OrderStepper status={myActiveOrder.status} />
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
            {t("noActiveOrder")}
            <div className="mt-3">
              <Button asChild size="sm" variant="outline">
                <Link to="/food">{t("foodMenu")}</Link>
              </Button>
            </div>
          </div>
        )}
        {myActiveOrder && (
          <div className="mt-4 pt-4 border-t text-sm flex justify-between">
            <span className="text-muted-foreground">
              {myActiveOrder.items.length} {myActiveOrder.items.length === 1 ? t("item") : t("items")}
            </span>
            <span className="font-semibold">EGP {myActiveOrder.total}</span>
          </div>
        )}
      </Card>
    </div>
  );
}

function OrderStepper({ status }: { status: "pending" | "preparing" | "delivering" | "delivered" }) {
  const { t } = useApp();
  const steps = [
    { key: "pending", label: t("pending"), icon: Package },
    { key: "preparing", label: t("preparing"), icon: ChefHat },
    { key: "delivering", label: t("delivering"), icon: Truck },
    { key: "delivered", label: t("delivered"), icon: CheckCheck },
  ];
  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const reached = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step.key} className="flex-1 flex items-center">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-smooth ${
                  reached
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground"
                } ${isCurrent ? "ring-4 ring-primary/20 animate-pulse" : ""}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-xs font-medium ${reached ? "" : "text-muted-foreground"}`}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-0.5 flex-1 -mt-6 ${idx < currentIdx ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function HRDashboard() {
  const { t, employees } = useApp();
  const present = employees.filter((e) => e.status === "present").length;
  const onLeave = employees.filter((e) => e.status === "leave").length;
  const absent = employees.filter((e) => e.status === "absent").length;
  const rate = Math.round((present / employees.length) * 100);

  const stats = [
    { label: t("presentToday"), value: present, icon: Users, color: "bg-success/10 text-success" },
    { label: t("onLeave"), value: onLeave, icon: CalendarDays, color: "bg-info/10 text-info" },
    { label: t("absent"), value: absent, icon: AlertCircle, color: "bg-destructive/10 text-destructive" },
    { label: t("attendanceRate"), value: `${rate}%`, icon: TrendingUp, color: "bg-accent/10 text-accent" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">HR Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("todayAttendance")}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5 shadow-card">
              <div className={`h-9 w-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-3xl font-bold tabular-nums">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </Card>
          );
        })}
      </div>
      <Card className="p-6 shadow-card">
        <h2 className="font-semibold mb-4">{t("quickActions")}</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild><Link to="/employees">{t("employeeList")}</Link></Button>
          <Button asChild variant="outline"><Link to="/leave">{t("leaveManagement")}</Link></Button>
          <Button asChild variant="outline"><Link to="/team-calendar">{t("teamCalendar")}</Link></Button>
        </div>
      </Card>
    </div>
  );
}

function CanteenDashboard() {
  const { t, orders, menu } = useApp();
  const active = orders.filter((o) => o.status !== "delivered").length;
  const lowStock = menu.filter((m) => m.stock > 0 && m.stock <= 5).length;
  const outStock = menu.filter((m) => m.stock === 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Canteen Console</h1>
        <p className="text-sm text-muted-foreground mt-1">Live orders & inventory</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-5 shadow-card">
          <Package className="h-5 w-5 text-info" />
          <div className="text-3xl font-bold tabular-nums mt-3">{active}</div>
          <div className="text-xs text-muted-foreground mt-1">Active Orders</div>
        </Card>
        <Card className="p-5 shadow-card">
          <AlertCircle className="h-5 w-5 text-warning" />
          <div className="text-3xl font-bold tabular-nums mt-3">{lowStock}</div>
          <div className="text-xs text-muted-foreground mt-1">{t("lowStock")} Items</div>
        </Card>
        <Card className="p-5 shadow-card">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div className="text-3xl font-bold tabular-nums mt-3">{outStock}</div>
          <div className="text-xs text-muted-foreground mt-1">{t("outOfStock")}</div>
        </Card>
      </div>
      <Card className="p-6 shadow-card">
        <h2 className="font-semibold mb-4">{t("quickActions")}</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild><Link to="/canteen-orders">{t("canteenOrders")}</Link></Button>
          <Button asChild variant="outline"><Link to="/inventory">{t("inventory")}</Link></Button>
        </div>
      </Card>
    </div>
  );
}
