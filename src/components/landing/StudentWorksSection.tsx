import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { X } from "lucide-react";

export const StudentWorksSection = () => {
  const { data: works = [] } = useQuery({
    queryKey: ["student_works"],
    queryFn: async () => {
      const { data } = await supabase
        .from("student_works")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!works.length) return null;

  return (
    <section id="works" className="section-padding">
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">Работы учеников</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {works.map((w) => (
            <div key={w.id} className="space-y-2">
              <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                {w.before_photo_url && (
                  <div className="relative cursor-pointer" onClick={() => setLightbox(w.before_photo_url)}>
                    <img src={w.before_photo_url} alt="До" className="w-full h-32 object-cover" loading="lazy" />
                    <span className="absolute bottom-1 left-1 bg-foreground/70 text-card text-[10px] px-1.5 py-0.5 rounded">До</span>
                  </div>
                )}
                {w.after_photo_url && (
                  <div className="relative cursor-pointer" onClick={() => setLightbox(w.after_photo_url)}>
                    <img src={w.after_photo_url} alt="После" className="w-full h-32 object-cover" loading="lazy" />
                    <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">После</span>
                  </div>
                )}
              </div>
              {w.description && <p className="text-xs text-muted-foreground text-center">{w.description}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-card" onClick={() => setLightbox(null)}>
            <X className="h-8 w-8" />
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] rounded-lg" />
        </div>
      )}
    </section>
  );
};
