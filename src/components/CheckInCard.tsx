import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, LogIn, LogOut } from "lucide-react";
import { DigitalClock } from "./DigitalClock";
import { toast } from "sonner";

export function CheckInCard() {
  const { t, attendance, toggleAttendance, lang } = useApp();
  const handleClick = () => {
    toggleAttendance();
    toast.success(attendance.checkedIn ? t("checkOut") : t("checkIn"), {
      description: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US"),
    });
  };

  const checkInTime = attendance.checkInTime
    ? new Date(attendance.checkInTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <Card className="p-6 md:p-8 bg-gradient-primary text-primary-foreground shadow-elegant border-0 overflow-hidden relative">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary-foreground/5 blur-3xl" />
      <div className="relative grid md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-2">
            <Clock className="h-4 w-4" />
            {t("digitalClock")}
          </div>
          <DigitalClock className="text-primary-foreground" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge
              className={
                attendance.checkedIn
                  ? "bg-success text-success-foreground border-0"
                  : "bg-primary-foreground/15 text-primary-foreground border-0"
              }
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
              {attendance.checkedIn ? t("checkedIn") : t("notCheckedIn")}
            </Badge>
            {checkInTime && (
              <span className="text-xs text-primary-foreground/70">
                {t("checkIn")}: {checkInTime}
              </span>
            )}
          </div>
          <Button
            onClick={handleClick}
            size="lg"
            className={
              attendance.checkedIn
                ? "w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0"
                : "w-full bg-success hover:bg-success/90 text-success-foreground border-0"
            }
          >
            {attendance.checkedIn ? (
              <>
                <LogOut className="h-4 w-4 mr-2" /> {t("checkOut")}
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" /> {t("checkIn")}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
