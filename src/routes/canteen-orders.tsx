import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ChefHat, Truck, CheckCheck, Package } from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/lib/mock-data";

export const Route = createFileRoute("/canteen-orders")({
  head: () => ({
    meta: [
      { title: "Canteen Orders — Smart Office" },
      { name: "description", content: "Manage incoming canteen orders." },
    ],
  }),
  component: CanteenOrdersPage,
});

const flow: Record<Order["status"], { next: Order["status"] | null; label: string; icon: typeof ChefHat }> = {
  pending: { next: "preparing", label: "markPreparing", icon: ChefHat },
  preparing: { next: "delivering", label: "markDelivering", icon: Truck },
  delivering: { next: "delivered", label: "markDelivered", icon: CheckCheck },
  delivered: { next: null, label: "delivered", icon: CheckCheck },
};

const statusColor = {
  pending: "bg-warning/15 text-warning border-warning/30",
  preparing: "bg-info/15 text-info border-info/30",
  delivering: "bg-accent/15 text-accent border-accent/30",
  delivered: "bg-success/15 text-success border-success/30",
};

function CanteenOrdersPage() {
  const { t, orders, updateOrderStatus, lang } = useApp();

  const handleAdvance = (o: Order) => {
    const next = flow[o.status].next;
    if (!next) return;
    updateOrderStatus(o.id, next);
    toast.success(`${o.id} → ${t(next)}`);
  };

  const active = orders.filter((o) => o.status !== "delivered");
  const completed = orders.filter((o) => o.status === "delivered");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("canteenOrders")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{active.length} active · {completed.length} completed</p>
        </div>

        <div>
          <h2 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Active</h2>
          {active.length === 0 ? (
            <Card className="p-12 text-center shadow-card">
              <Package className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No active orders</p>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {active.map((o) => {
                const cfg = flow[o.status];
                const Icon = cfg.icon;
                return (
                  <Card key={o.id} className="p-4 shadow-card flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-mono font-semibold">{o.id}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(o.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <Badge variant="outline" className={statusColor[o.status]}>{t(o.status)}</Badge>
                    </div>
                    <div className="rounded-md bg-muted p-2.5 text-xs flex items-center gap-2 mb-3">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      <span>{t("floor")} {o.floor} · {t("zone")} {o.zone} · <span className="font-mono font-semibold">{o.desk}</span></span>
                    </div>
                    <div className="text-sm font-medium mb-2">{lang === "ar" ? o.employeeNameAr : o.employeeName}</div>
                    <div className="flex-1 space-y-1 text-sm">
                      {o.items.map((i) => (
                        <div key={i.menuId} className="flex justify-between">
                          <span>{i.qty}× {lang === "ar" ? i.nameAr : i.name}</span>
                          <span className="text-muted-foreground">EGP {i.price * i.qty}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-3 pt-3 flex items-center justify-between">
                      <span className="font-bold">EGP {o.total}</span>
                      {cfg.next && (
                        <Button size="sm" onClick={() => handleAdvance(o)}>
                          <Icon className="h-3.5 w-3.5 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                          {t(cfg.label as never)}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {completed.length > 0 && (
          <div>
            <h2 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Completed</h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {completed.map((o) => (
                <Card key={o.id} className="p-3 shadow-card opacity-70">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold">{o.id}</span>
                    <Badge variant="outline" className={statusColor.delivered}>{t("delivered")}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{o.desk} · EGP {o.total}</div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
