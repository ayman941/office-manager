import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Smart Office" },
      { name: "description", content: "Manage canteen stock levels." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const { t, menu, restockItem, lang } = useApp();
  const [query, setQuery] = useState("");

  const filtered = menu.filter((m) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return m.name.toLowerCase().includes(q) || m.nameAr.includes(q) || m.category.includes(q);
  });

  const handleRestock = (id: string, name: string) => {
    restockItem(id, 10);
    toast.success(`${t("restock")}: ${name}`, { description: "+10 units" });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("inventory")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{menu.length} items in inventory</p>
        </div>

        <Card className="shadow-card">
          <div className="p-4 border-b">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search")} className="pl-9 rtl:pl-3 rtl:pr-9" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead className="text-right rtl:text-left">{t("price")}</TableHead>
                <TableHead className="text-right rtl:text-left">{t("stock")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => {
                const out = m.stock === 0;
                const low = m.stock > 0 && m.stock <= 5;
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-xl">{m.emoji}</div>
                        <div>
                          <div className="font-medium text-sm">{lang === "ar" ? m.nameAr : m.name}</div>
                          <div className="text-xs text-muted-foreground">{m.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm capitalize">{m.category}</TableCell>
                    <TableCell className="text-right rtl:text-left text-sm font-medium">EGP {m.price}</TableCell>
                    <TableCell className="text-right rtl:text-left">
                      <span className={`font-bold tabular-nums ${out ? "text-destructive" : low ? "text-warning" : ""}`}>{m.stock}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          out ? "bg-destructive/10 text-destructive border-destructive/30"
                          : low ? "bg-warning/10 text-warning border-warning/30"
                          : "bg-success/10 text-success border-success/30"
                        }
                      >
                        {out ? t("outOfStock") : low ? t("lowStock") : t("inStock")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right rtl:text-left">
                      <Button size="sm" variant="outline" onClick={() => handleRestock(m.id, lang === "ar" ? m.nameAr : m.name)}>
                        <Plus className="h-3.5 w-3.5 mr-1 rtl:ml-1 rtl:mr-0" />{t("restock")}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}
