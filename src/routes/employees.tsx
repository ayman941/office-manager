import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/employees")({
  head: () => ({
    meta: [
      { title: "Employees — Smart Office" },
      { name: "description", content: "Manage employee directory." },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const { t, employees, addEmployee, lang } = useApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", nameAr: "", department: "", departmentAr: "", email: "", desk: "" });

  const filtered = employees.filter((e) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      e.name.toLowerCase().includes(q) ||
      e.nameAr.includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee(form);
    toast.success(t("addEmployee"), { description: form.name });
    setOpen(false);
    setForm({ name: "", nameAr: "", department: "", departmentAr: "", email: "", desk: "" });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("employees")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{employees.length} total employees</p>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />{t("addEmployee")}</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("addEmployee")}</SheetTitle>
                <SheetDescription>Add a new team member</SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div className="space-y-2"><Label>{t("name")} (EN)</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="space-y-2"><Label>{t("name")} (AR)</Label><Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></div>
                <div className="space-y-2"><Label>{t("email")}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                <div className="space-y-2"><Label>{t("department")}</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value, departmentAr: e.target.value })} required /></div>
                <div className="space-y-2"><Label>{t("desk")}</Label><Input placeholder="F2-A12" value={form.desk} onChange={(e) => setForm({ ...form, desk: e.target.value })} required /></div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">{t("cancel")}</Button>
                  <Button type="submit" className="flex-1">{t("submit")}</Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
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
                <TableHead>{t("department")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("desk")}</TableHead>
                <TableHead>{t("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">{e.avatar}</div>
                      <div>
                        <div className="font-medium text-sm">{lang === "ar" ? e.nameAr : e.name}</div>
                        <div className="text-xs text-muted-foreground">{e.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{lang === "ar" ? e.departmentAr : e.department}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.email}</TableCell>
                  <TableCell className="text-sm font-mono">{e.desk}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        e.status === "present" ? "bg-success/10 text-success border-success/30"
                        : e.status === "leave" ? "bg-info/10 text-info border-info/30"
                        : "bg-destructive/10 text-destructive border-destructive/30"
                      }
                    >
                      {t(e.status === "present" ? "presentToday" : e.status === "leave" ? "onLeave" : "absent")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}
