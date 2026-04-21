import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { CheckInCard } from "@/components/CheckInCard";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — Smart Office" },
      { name: "description", content: "Track and manage your daily attendance." },
    ],
  }),
  component: AttendancePage,
});

function AttendancePage() {
  const { t, attendance } = useApp();
  // Mock weekly data
  const week = [
    { day: "Mon", in: "08:55", out: "17:30", status: "present" },
    { day: "Tue", in: "09:02", out: "17:45", status: "present" },
    { day: "Wed", in: "08:50", out: "17:20", status: "present" },
    { day: "Thu", in: "—", out: "—", status: "leave" },
    { day: "Fri", in: "—", out: "—", status: "weekend" },
    { day: "Sat", in: "—", out: "—", status: "weekend" },
    { day: "Sun", in: "08:48", out: "—", status: attendance.checkedIn ? "in" : "pending" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("attendance")}</h1>
          <p className="text-sm text-muted-foreground mt-1">Your weekly attendance log</p>
        </div>
        <CheckInCard />
        <Card className="p-6 shadow-card">
          <h2 className="font-semibold mb-4">This Week</h2>
          <div className="grid grid-cols-7 gap-2">
            {week.map((d) => (
              <div key={d.day} className="rounded-lg border p-3 text-center">
                <div className="text-xs font-medium text-muted-foreground">{d.day}</div>
                <div
                  className={`mt-2 h-2 w-2 mx-auto rounded-full ${
                    d.status === "present" || d.status === "in"
                      ? "bg-success"
                      : d.status === "leave"
                      ? "bg-info"
                      : d.status === "weekend"
                      ? "bg-muted-foreground/30"
                      : "bg-warning"
                  }`}
                />
                <div className="mt-2 text-[10px] tabular-nums">{d.in}</div>
                <div className="text-[10px] tabular-nums text-muted-foreground">{d.out}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Badge variant="outline" className="gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Present</Badge>
            <Badge variant="outline" className="gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-info" /> Leave</Badge>
            <Badge variant="outline" className="gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" /> Weekend</Badge>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
