import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, string> = {};
      data?.forEach((r) => { if (r.value) map[r.key] = r.value; });
      return map;
    },
  });

  const title = settings?.hero_title || "Обучение косметологии";
  const subtitle = settings?.hero_subtitle || "Научитесь работать с инъекциями под руководством врача с многолетним опытом";
  const photo = settings?.hero_photo_url;
  const credentials = settings?.hero_credentials || "Врач-косметолог · Преподаватель";

  const scrollToApplication = () => {
    document.querySelector("#application")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-padding bg-accent/30">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Text */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <p className="text-sm uppercase tracking-widest text-primary font-medium">
            {credentials}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-foreground">
            {title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
            {subtitle}
          </p>
          <Button size="lg" className="mt-4 rounded-full px-8" onClick={scrollToApplication}>
            Записаться на курс
          </Button>
        </div>

        {/* Photo */}
        {photo && (
          <div className="flex-1 flex justify-center">
            <img
              src={photo}
              alt="Dr. Anastasia Grebenuk"
              className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-lg border-4 border-card"
              loading="eager"
            />
          </div>
        )}
      </div>
    </section>
  );
};
