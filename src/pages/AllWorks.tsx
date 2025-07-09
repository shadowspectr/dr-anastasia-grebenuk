import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AllWorks = () => {
  const navigate = useNavigate();

  // Fetch all gallery items
  const { data: galleryItems = [] } = useQuery({
    queryKey: ['allGallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="py-8 px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-4 hover:scale-110 transition-transform duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-light text-foreground flex-1 text-center">
              ВСЕ НАШИ РАБОТЫ
            </h1>
          </div>

          {/* Works Grid */}
          <div className="space-y-6">
            {galleryItems.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
            
            {galleryItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Работы временно недоступны</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllWorks;