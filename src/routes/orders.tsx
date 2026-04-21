import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Package, Truck, CheckCheck } from "lucide-react";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — Smart Office" },
      { name: "description", content: "Track all your food orders." },
    ],
  }),
  component: OrdersPage,
});

const statusConfig = {
  pending: { color: "bg-warning/15 text-warning border-warning/30", icon: Package },
  preparing: { color: "bg-info/15 text-info border-info/30", icon: ChefHat },
  delivering: { color: "bg-accent/15 text-accent border-accent/30", icon: Truck },
  delivered: { color: "bg-success/15 text-success border-success/30", icon: CheckCheck },
};

function OrdersPage() {
  const { t, orders, currentUser, lang } = useApp();
  const myOrders = orders.filter((o) => o.employeeName === currentUser.name);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("myOrders")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{myOrders.length} total orders</p>
        </div>
        {myOrders.length === 0 ? (
          <Card className="p-12 text-center shadow-card">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No orders yet</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {myOrders.map((o) => {
              const cfg = statusConfig[o.status];
              const Icon = cfg.icon;
              return (
                <Card key={o.id} className="p-4 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-sm">{o.id}</span>
                        <Badge variant="outline" className={cfg.color}>
                          <Icon className="h-3 w-3 mr-1" />
                          {t(o.status)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(o.createdAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                      </div>
                      <div className="text-sm mt-2">
                        {o.items.map((i) => `${i.qty}× ${lang === "ar" ? i.nameAr : i.name}`).join(" · ")}
                      </div>
                    </div>
                    <div className="text-right rtl:text-left">
                      <div className="font-bold">EGP {o.total}</div>
                      <div className="text-xs text-muted-foreground">{o.desk}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
