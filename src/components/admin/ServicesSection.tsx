import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  price: string;
}

export const ServicesSection = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);

  // Load services from Supabase on component mount
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, title, price')
        .order('created_at', { ascending: true });

      if (error) {
        toast({
          title: "Ошибка загрузки услуг",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setServices(data || []);
    };

    fetchServices();
  }, [toast]);

  const handleServiceAdd = async () => {
    const { data, error } = await supabase
      .from('services')
      .insert({
        title: '',
        price: '',
        description: '',
        icon: ''
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Ошибка при добавлении услуги",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setServices([...services, { id: data.id, title: data.title, price: data.price }]);
  };

  const handleServiceDelete = async (id: string) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Ошибка при удалении услуги",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setServices(services.filter(service => service.id !== id));
    toast({
      title: "Услуга удалена",
      description: "Услуга была успешно удалена из списка",
    });
  };

  const handleServiceUpdate = async (id: string, field: keyof Service, value: string) => {
    const { error } = await supabase
      .from('services')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      toast({
        title: "Ошибка при обновлении услуги",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setServices(services.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Управление услугами</h2>
            <Button onClick={handleServiceAdd} className="bg-[#004d40] hover:bg-[#00695c]">
              <Plus className="mr-2 h-4 w-4" /> Добавить услугу
            </Button>
          </div>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="flex gap-4 items-start bg-white/10 p-4 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={`service-title-${service.id}`} className="text-white">Название услуги</Label>
                  <Input
                    id={`service-title-${service.id}`}
                    value={service.title}
                    onChange={(e) => handleServiceUpdate(service.id, 'title', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor={`service-price-${service.id}`} className="text-white">Цена</Label>
                  <Input
                    id={`service-price-${service.id}`}
                    value={service.price}
                    onChange={(e) => handleServiceUpdate(service.id, 'price', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleServiceDelete(service.id)}
                  className="mt-6"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};