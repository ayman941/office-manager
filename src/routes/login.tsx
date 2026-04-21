import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Smart Office" },
      { name: "description", content: "Login to access your portal." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, t } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }
    
    // Mock authentication: accept any password, derive role from username
    login(username);
    toast.success("Login successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md p-8 shadow-elegant relative z-10 bg-card/60 backdrop-blur-xl border-white/10 dark:border-white/5">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">{t("appName")}</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            {t("appTagline")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="e.g., hr, manager, canteen, employee"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="h-11 bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="h-11 bg-background/50"
            />
          </div>

          <Button type="submit" className="w-full h-11 text-base font-medium mt-6 shadow-glow">
            <LogIn className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            Sign In
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            <strong>Demo Portal:</strong> Try logging in with the username 
            <code className="mx-1 px-1.5 py-0.5 rounded bg-muted">hr</code>, 
            <code className="mx-1 px-1.5 py-0.5 rounded bg-muted">manager</code>, 
            <code className="mx-1 px-1.5 py-0.5 rounded bg-muted">canteen</code>, or 
            <code className="mx-1 px-1.5 py-0.5 rounded bg-muted">employee</code>.
            Use any password.
          </p>
        </div>
      </Card>
    </div>
  );
}
