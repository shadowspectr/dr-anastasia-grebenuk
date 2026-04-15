import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Award, Users, BookOpen } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  award: Award,
  users: Users,
  book: BookOpen,
};

export const SocialProofSection = () => {
  const { data: stats = [] } = useQuery({
    queryKey: ["social_proof"],
    queryFn: async () => {
      const { data } = await supabase.from("social_proof").select("*").order("sort_order");
      return data ?? [];
    },
  });

  if (!stats.length) return null;

  return (
    <section className="py-12 px-4 bg-card">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s) => {
          const Icon = iconMap[s.icon ?? ""] ?? Award;
          return (
            <div key={s.id} className="space-y-2">
              <Icon className="h-8 w-8 mx-auto text-primary" />
              <p className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
