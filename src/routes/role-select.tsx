import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Home, Building2, Briefcase, TrendingUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/role-select")({ component: RoleSelectPage });

const options: { key: AppRole; name: string; desc: string; icon: typeof Home; color: string }[] = [
  { key: "buyer", name: "Buyer", desc: "Browse and offer on verified homes", icon: Home, color: "text-blue-500" },
  { key: "seller", name: "Seller", desc: "List your property to qualified buyers", icon: Building2, color: "text-gold" },
  { key: "agent", name: "Agent", desc: "Manage listings and clients", icon: Briefcase, color: "text-purple-500" },
  { key: "investor", name: "Investor", desc: "Invest fractionally from $100", icon: TrendingUp, color: "text-emerald-500" },
];

function RoleSelectPage() {
  const navigate = useNavigate();
  const { user, role, loading, refreshRole } = useAuth();
  const [saving, setSaving] = useState<AppRole | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
    if (!loading && user && role) navigate({ to: "/dashboard" });
  }, [user, role, loading, navigate]);

  const choose = async (r: AppRole) => {
    if (!user) return;
    setSaving(r);
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: r });
    if (error) { toast.error(error.message); setSaving(null); return; }
    await refreshRole();
    toast.success(`Welcome, ${r}!`);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-navy text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center">Choose your role</h1>
      <p className="text-white/70 mt-2 text-center">You can change this anytime in settings.</p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8 max-w-3xl w-full">
        {options.map((o) => (
          <Card
            key={o.key}
            onClick={() => !saving && choose(o.key)}
            className="p-6 cursor-pointer hover:border-gold hover:shadow-xl transition bg-white text-foreground"
          >
            <o.icon className={`h-8 w-8 ${o.color} mb-3`} />
            <h3 className="font-bold text-lg">{o.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{o.desc}</p>
            {saving === o.key && (
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Saving…
              </div>
            )}
          </Card>
        ))}
      </div>

      <Button variant="ghost" className="mt-6 text-white/70 hover:text-gold" onClick={() => navigate({ to: "/" })}>
        Skip for now
      </Button>
    </div>
  );
}
