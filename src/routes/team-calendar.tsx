import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/team-calendar")({
  head: () => ({
    meta: [
      { title: "Team Calendar — Smart Office" },
      { name: "description", content: "View team availability." },
    ],
  }),
  component: TeamCalendarPage,
});

function TeamCalendarPage() {
  const { t, leaveRequests, employees, lang } = useApp();
  // Build a 14-day window starting today
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const onLeave = (empId: string, dateStr: string) =>
    leaveRequests.some(
      (r) => r.employeeId === empId && r.status === "approved" && dateStr >= r.startDate && dateStr <= r.endDate
    );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("teamCalendar")}</h1>
          <p className="text-sm text-muted-foreground mt-1">Next 14 days · team availability</p>
        </div>
        <Card className="shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left rtl:text-right px-4 py-3 font-medium sticky left-0 rtl:left-auto rtl:right-0 bg-muted/50 min-w-[180px]">{t("name")}</th>
                {days.map((d) => (
                  <th key={d.toISOString()} className="px-2 py-3 text-center font-medium min-w-[42px]">
                    <div className="text-[10px] text-muted-foreground">{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <div className="tabular-nums">{d.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 sticky left-0 rtl:left-auto rtl:right-0 bg-card">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">{e.avatar}</div>
                      <div className="font-medium">{lang === "ar" ? e.nameAr : e.name}</div>
                    </div>
                  </td>
                  {days.map((d) => {
                    const isWeekend = d.getDay() === 5 || d.getDay() === 6;
                    const leave = onLeave(e.id, fmt(d));
                    return (
                      <td key={d.toISOString()} className="px-1 py-2 text-center">
                        <div
                          className={`h-7 w-7 mx-auto rounded ${
                            isWeekend ? "bg-muted" : leave ? "bg-info/30" : "bg-success/20"
                          }`}
                          title={leave ? "On leave" : isWeekend ? "Weekend" : "Available"}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div className="flex flex-wrap gap-3 text-xs">
          <Badge variant="outline" className="gap-1.5"><span className="h-2.5 w-2.5 rounded bg-success/20" /> Available</Badge>
          <Badge variant="outline" className="gap-1.5"><span className="h-2.5 w-2.5 rounded bg-info/30" /> On Leave</Badge>
          <Badge variant="outline" className="gap-1.5"><span className="h-2.5 w-2.5 rounded bg-muted" /> Weekend</Badge>
        </div>
      </div>
    </AppLayout>
  );
}
