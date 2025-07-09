import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AboutSection = () => {
  // Fetch about section data from database
  const { data: mainContent } = useQuery({
    queryKey: ['mainContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('main_content')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <section className="py-16 px-4 animate-fade-in">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-light text-center mb-8 text-foreground transition-all duration-300 hover:scale-105">
          {mainContent?.about_title || "О НАС"}
        </h2>
        
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="text-foreground space-y-4">
            <p className="text-sm leading-relaxed">
              {mainContent?.about_description || "RESIDENCE by Alya Kim – это не просто клиника в центре города, это резиденция красивых людей и эстетического удовольствия."}
            </p>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-6 text-center text-foreground">
              ПРЕИМУЩЕСТВА<br/>КЛИНИКИ
            </h3>
            
            <div className="space-y-3">
              {(mainContent?.about_advantages || [
                "высококвалифицированные специалисты с медицинским образованием",
                "большой спектр различных услуг",
                "удобное расположение в самом центре Ростова-на-Дону",
                "высокий уровень сервиса",
                "безупречная репутация",
                "полное доверие более 10.000 пациентов"
              ]).map((advantage: string, index: number) => (
                <div key={index} className="flex items-start gap-3 animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 animate-pulse" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{advantage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { AboutSection };