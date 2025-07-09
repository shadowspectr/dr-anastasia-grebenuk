import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

const WorksSection = () => {
  // Fetch gallery items
  const { data: galleryItems = [] } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4); // Показываем только первые 4 работы

      if (error) throw error;
      return data;
    }
  });

  return (
    <section className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-light text-center mb-8 text-foreground">
          РАБОТЫ НАШИХ<br/>СПЕЦИАЛИСТОВ
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {galleryItems.slice(0, 4).map((item, index) => (
            <div 
              key={item.id}
              className={`overflow-hidden ${
                index === 0 ? 'rounded-3xl' : 
                index === 1 ? 'rounded-3xl' :
                index === 2 ? 'rounded-3xl' :
                'rounded-3xl'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <button className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-full px-6 py-3 flex items-center gap-2 hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-primary/20">
            <span className="text-foreground font-medium">больше работ</span>
            <ArrowRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export { WorksSection };