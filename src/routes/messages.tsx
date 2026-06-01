import { createFileRoute, Link, useNavigate, Outlet } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Paperclip, Home as HomeIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/messages")({ component: MessagesLayout });

type ConvoRow = {
  id: string;
  property_id: string;
  buyer_id: string;
  owner_id: string;
  last_message_at: string;
  properties: { title: string; city: string; state: string; images: string[] } | null;
};

function MessagesLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const { data: convos = [], isLoading: convosLoading } = useQuery({
    queryKey: ["convos", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<ConvoRow[]> => {
      const { data } = await supabase
        .from("conversations")
        .select("id, property_id, buyer_id, owner_id, last_message_at, properties(title, city, state, images)")
        .order("last_message_at", { ascending: false });
      return (data as ConvoRow[] | null) ?? [];
    },
  });

  if (loading || !user) return <div className="container mx-auto px-4 py-20 text-center">Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <MessageSquare className="h-6 w-6 text-gold" />Messages
      </h1>
      <div className="grid md:grid-cols-[340px_1fr] gap-4">
        <aside className="space-y-1.5">
          {convosLoading ? (
            <div>Loading conversations...</div>
          ) : convos.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No conversations yet"
              description="Message a seller directly from any property listing."
              actionLabel="Browse Properties"
              actionTo="/properties"
            />
          ) : (
            convos.map((c) => (
              <Link key={c.id} to="/messages/$id" params={{ id: c.id }} className="block">
                <Card className="p-2.5 hover:bg-secondary/60 transition cursor-pointer">
                  <div className="flex gap-3">
                    <div className="h-12 w-12 rounded-md bg-secondary grid place-items-center flex-shrink-0">
                      <HomeIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">{c.properties?.title ?? "Property"}</div>
                      <div className="text-xs text-muted-foreground truncate">{c.properties?.city}, {c.properties?.state}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </aside>
        <section><Outlet /></section>
      </div>
    </div>
  );
}
