import { useEffect, useState } from "react";

export function DigitalClock({ className }: { className?: string }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString("en-US", { hour12: false });
  const date = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <div className={className}>
      <div className="text-4xl md:text-5xl font-bold tabular-nums tracking-tight">{time}</div>
      <div className="text-sm text-muted-foreground mt-1">{date}</div>
    </div>
  );
}
