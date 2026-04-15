import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle } from "lucide-react";

export const AboutMeSection = () => {
  const { data } = useQuery({
    queryKey: ["about_info"],
    queryFn: async () => {
      const { data } = await supabase.from("about_info").select("*").maybeSingle();
      return data;
    },
  });

  if (!data) return null;

  return (
    <section id="about" className="section-padding">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {data.photo_url && (
          <div className="flex-shrink-0">
            <img
              src={data.photo_url}
              alt="Обо мне"
              className="w-64 h-72 md:w-80 md:h-96 rounded-2xl object-cover shadow-md"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Обо мне</h2>
          {data.bio && <p className="text-muted-foreground leading-relaxed">{data.bio}</p>}

          {data.credentials && data.credentials.length > 0 && (
            <ul className="space-y-2">
              {data.credentials.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{c}</span>
                </li>
              ))}
            </ul>
          )}

          {data.achievements && data.achievements.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.achievements.map((a, i) => (
                <span key={i} className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
