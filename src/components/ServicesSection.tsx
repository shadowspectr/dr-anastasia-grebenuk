import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { PricePopup } from "./PricePopup";

interface Service {
  id: string;
  title: string;
  price: string;
  category_id: string | null;
}

interface Category {
  id: string;
  title: string;
  services?: Service[];
}

const ServicesSection = () => {
  // Fetch categories and services
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (categoriesError) throw categoriesError;

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (servicesError) throw servicesError;

      // Group services by category
      return categoriesData.map((category: Category) => ({
        ...category,
        services: servicesData.filter((service: Service) => service.category_id === category.id)
      }));
    }
  });

  return (
    <section className="py-16 px-4 animate-fade-in">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-light text-center mb-8 text-foreground transition-all duration-300 hover:scale-105">УСЛУГИ</h2>
        
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={category.id} className="animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
              <PricePopup categories={[category]}>
                <button className="w-full bg-gradient-to-r from-primary/20 to-accent/20 rounded-full px-6 py-4 flex items-center justify-between hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-primary/20 hover:scale-[1.02] hover:shadow-md">
                  <span className="text-foreground font-medium">{category.title}</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>открыть прайс</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </PricePopup>
            </div>
          ))}
          
          {/* Кнопка для показа всего прайса */}
          <div className="mt-6 text-center">
            <PricePopup categories={categories}>
              <button className="bg-gradient-to-r from-primary to-accent text-foreground font-medium py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                ВЕСЬ ПРАЙС-ЛИСТ
              </button>
            </PricePopup>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ServicesSection };