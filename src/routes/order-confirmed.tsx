import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Package } from "lucide-react";
type OrderConfirmedSearch = { id: string };

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (search: Record<string, unknown>): OrderConfirmedSearch => ({
    id: typeof search.id === "string" ? search.id : "",
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — Smart Office" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmedPage,
});

function OrderConfirmedPage() {
  const { id } = Route.useSearch();
  const { t, orders, lang } = useApp();
  const order = orders.find((o) => o.id === id) ?? orders[0];

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto pt-6">
        <Card className="p-8 shadow-elegant text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-success/15 flex items-center justify-center mb-4 animate-[scale-in_0.4s_ease-out]">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold">{t("orderConfirmed")}</h1>
          <p className="text-sm text-muted-foreground mt-2">{t("orderConfirmedDesc")}</p>
          <div className="mt-6 rounded-lg bg-muted p-4 text-left rtl:text-right">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("orderId")}</span>
              <span className="font-mono font-semibold">{order?.id}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {t("desk")}</span>
              <span className="font-medium">{order?.desk}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> {t("items")}</span>
              <span className="font-medium">{order?.items.length}</span>
            </div>
            <div className="border-t mt-3 pt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("total")}</span>
              <span className="font-bold">EGP {order?.total}</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2 justify-center">
            <Button asChild variant="outline"><Link to="/food">{t("backToMenu")}</Link></Button>
            <Button asChild><Link to="/orders">{t("myOrders")}</Link></Button>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            {lang === "ar" ? "سيتم التوصيل خلال 15-20 دقيقة" : "Estimated delivery: 15-20 minutes"}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
