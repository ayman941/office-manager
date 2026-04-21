import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, ShoppingBag, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/food")({
  head: () => ({
    meta: [
      { title: "Food Menu — Smart Office" },
      { name: "description", content: "Order food and drinks delivered to your desk." },
    ],
  }),
  component: FoodPage,
});

const categories: { key: "all" | "main" | "drinks" | "snacks" | "desserts"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "main", label: "Main" },
  { key: "drinks", label: "Drinks" },
  { key: "snacks", label: "Snacks" },
  { key: "desserts", label: "Desserts" },
];

function FoodPage() {
  const { t, lang, menu, cart, addToCart, updateQty, removeFromCart, cartTotal, cartCount, currentUser, placeOrder } =
    useApp();
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState<typeof categories[number]["key"]>("all");
  const [query, setQuery] = useState("");
  const [placing, setPlacing] = useState(false);

  const filtered = menu.filter((m) => {
    if (activeCat !== "all" && m.category !== activeCat) return false;
    const q = query.toLowerCase();
    if (q && !m.name.toLowerCase().includes(q) && !m.nameAr.includes(q)) return false;
    return true;
  });

  const handleAdd = (id: string, name: string) => {
    addToCart(id);
    toast.success(`${name} ${t("addToCart")}`, {
      description: `${cartCount + 1} ${cartCount === 0 ? t("item") : t("items")} ${t("cart")}`,
    });
  };

  const handlePlace = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 900));
    const order = placeOrder();
    setPlacing(false);
    toast.success(t("orderConfirmed"), { description: order.id });
    navigate({ to: "/order-confirmed", search: { id: order.id } });
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{t("foodMenu")}</h1>
          <p className="text-sm text-muted-foreground mt-1">Order to your desk · {currentUser.desk}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Menu */}
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("search")}
                  className="pl-9 rtl:pl-3 rtl:pr-9"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {categories.map((c) => (
                  <Button
                    key={c.key}
                    size="sm"
                    variant={activeCat === c.key ? "default" : "outline"}
                    onClick={() => setActiveCat(c.key)}
                  >
                    {c.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((m) => {
                const out = m.stock === 0;
                const low = m.stock > 0 && m.stock <= 5;
                return (
                  <Card key={m.id} className="p-4 shadow-card hover:shadow-elegant transition-smooth flex flex-col">
                    <div className="h-28 rounded-lg bg-gradient-subtle flex items-center justify-center text-5xl mb-3">
                      {m.emoji}
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{lang === "ar" ? m.nameAr : m.name}</div>
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {lang === "ar" ? m.descriptionAr : m.description}
                        </div>
                      </div>
                      <Badge
                        variant={out ? "destructive" : low ? "outline" : "secondary"}
                        className={`shrink-0 text-[10px] ${low && !out ? "border-warning text-warning" : ""}`}
                      >
                        {out ? t("outOfStock") : low ? t("lowStock") : `${m.stock}`}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <span className="font-bold text-sm">EGP {m.price}</span>
                      <Button
                        size="sm"
                        disabled={out}
                        onClick={() => handleAdd(m.id, lang === "ar" ? m.nameAr : m.name)}
                      >
                        {out ? t("outOfStock") : t("addToCart")}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Side Cart */}
          <Card className="p-5 shadow-card lg:sticky lg:top-20 h-fit">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <h2 className="font-semibold">{t("cart")}</h2>
              </div>
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </div>

            <div className="rounded-lg bg-muted p-3 text-xs flex items-center gap-2 mb-4">
              <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
              <span className="text-muted-foreground">{t("deliveryTo")}:</span>
              <span className="font-medium">{currentUser.desk}</span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-10 text-sm text-muted-foreground">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-30" />
                {t("emptyCart")}
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {cart.map((c) => {
                    const m = menu.find((mi) => mi.id === c.menuId)!;
                    return (
                      <div key={c.menuId} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xl shrink-0">
                          {m.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{lang === "ar" ? m.nameAr : m.name}</div>
                          <div className="text-xs text-muted-foreground">EGP {m.price * c.qty}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(c.menuId, c.qty - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm tabular-nums">{c.qty}</span>
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(c.menuId, c.qty + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(c.menuId)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("total")}</span>
                    <span className="font-bold text-lg">EGP {cartTotal}</span>
                  </div>
                  <Button onClick={handlePlace} disabled={placing} size="lg" className="w-full">
                    {placing ? (
                      <>
                        <span className="h-4 w-4 mr-2 border-2 border-current border-r-transparent rounded-full animate-spin" />
                        {t("placing")}
                      </>
                    ) : (
                      t("placeOrder")
                    )}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
