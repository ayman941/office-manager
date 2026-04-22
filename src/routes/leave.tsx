import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CalendarDays, Stethoscope, Coffee, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/leave")({
  head: () => ({
    meta: [
      { title: "Leave Management — Smart Office" },
      { name: "description", content: "Request and track your leave." },
    ],
  }),
  component: LeavePage,
});

function LeavePage() {
  const { t, leaveBalance, leaveRequests, addLeaveRequest, currentUser, role, employees, updateLeaveRequestStatus } = useApp();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"annual" | "sick" | "casual">("annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const myRequests = leaveRequests.filter((r) => r.employeeName === currentUser.name || r.employeeId === currentUser.id);

  const teamRequests = leaveRequests.filter((r) => {
    if (r.employeeId === currentUser.id) return false;
    if (r.status !== "pending") return false;
    if (role === "hr") return true;
    if (role === "manager") {
      const emp = employees.find((e) => e.id === r.employeeId);
      return emp?.department === currentUser.department;
    }
    return false;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please select dates");
      return;
    }
    addLeaveRequest({ type, startDate, endDate, reason });
    toast.success(t("requestLeave"), { description: `${startDate} → ${endDate}` });
    setOpen(false);
    setStartDate(""); setEndDate(""); setReason("");
  };

  const balanceItems = [
    { icon: CalendarDays, label: t("annualLeave"), value: leaveBalance.annual, color: "text-info" },
    { icon: Stethoscope, label: t("sickLeave"), value: leaveBalance.sick, color: "text-success" },
    { icon: Coffee, label: t("casualLeave"), value: leaveBalance.casual, color: "text-warning" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("leaveManagement")}</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage time off</p>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />{t("requestLeave")}</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("requestLeave")}</SheetTitle>
                <SheetDescription>Submit a new leave request</SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label>{t("leaveType")}</Label>
                  <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">{t("annualLeave")}</SelectItem>
                      <SelectItem value="sick">{t("sickLeave")}</SelectItem>
                      <SelectItem value="casual">{t("casualLeave")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{t("startDate")}</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("endDate")}</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("reason")}</Label>
                  <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">{t("cancel")}</Button>
                  <Button type="submit" className="flex-1">{t("submit")}</Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {balanceItems.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.label} className="p-5 shadow-card">
                <Icon className={`h-5 w-5 ${b.color}`} />
                <div className="mt-3 text-3xl font-bold tabular-nums">{b.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{b.label} · {t("days")} remaining</div>
              </Card>
            );
          })}
        </div>

        <Card className="p-6 shadow-card">
          <h2 className="font-semibold mb-4">My Requests</h2>
          {myRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No leave requests yet</p>
          ) : (
            <div className="space-y-2">
              {myRequests.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="text-sm font-medium capitalize">{t(r.type === "annual" ? "annualLeave" : r.type === "sick" ? "sickLeave" : "casualLeave")}</div>
                    <div className="text-xs text-muted-foreground">{r.startDate} → {r.endDate}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      r.status === "approved" ? "bg-success/10 text-success border-success/30"
                      : r.status === "rejected" ? "bg-destructive/10 text-destructive border-destructive/30"
                      : "bg-warning/10 text-warning border-warning/30"
                    }
                  >
                    {t(r.status as any)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {(role === "manager" || role === "hr") && (
          <Card className="p-6 shadow-card mt-6">
            <h2 className="font-semibold mb-4">{t("teamRequests")}</h2>
            {teamRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No pending team requests</p>
            ) : (
              <div className="space-y-3">
                {teamRequests.map((r) => (
                  <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-4">
                    <div>
                      <div className="font-medium">{r.employeeName}</div>
                      <div className="text-sm mt-1 mb-2 capitalize">{t(r.type === "annual" ? "annualLeave" : r.type === "sick" ? "sickLeave" : "casualLeave")} ({r.startDate} → {r.endDate})</div>
                      <div className="text-sm text-muted-foreground">{t("reason")}: {r.reason}</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10" onClick={() => updateLeaveRequestStatus(r.id, "approved")}>
                        <Check className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                        {t("approve")}
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => updateLeaveRequestStatus(r.id, "rejected")}>
                        <X className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                        {t("reject")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
