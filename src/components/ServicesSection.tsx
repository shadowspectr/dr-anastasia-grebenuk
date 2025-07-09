import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-light text-center mb-8 text-foreground">УСЛУГИ</h2>
        
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full bg-gradient-to-r from-primary/20 to-accent/20 rounded-full px-6 py-4 flex items-center justify-between hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-primary/20"
              >
                <span className="text-foreground font-medium">{category.title}</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>открыть прайс</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
              
              {expandedCategory === category.id && category.services && (
                <div className="mt-2 bg-card rounded-2xl p-4 border border-border animate-accordion-down">
                  <div className="space-y-2">
                    {category.services.map((service) => (
                      <div key={service.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
                        <span className="text-sm text-foreground">{service.title}</span>
                        <span className="text-sm font-medium text-foreground">{service.price} ₽</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { ServicesSection };