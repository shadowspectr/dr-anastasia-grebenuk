import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface Service {
  id: number;
  name: string;
  price: string;
}

export const ServicesSection = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "Контурная пластика губ", price: "9,000" },
    { id: 2, name: "Биоревитализация лица", price: "2,000" },
    { id: 3, name: "Мезотерапия лица", price: "4,000" },
    { id: 4, name: "Мезотерапия волос", price: "2,500" },
    { id: 5, name: "Чистка лица", price: "3,000" },
    { id: 6, name: "Пилинг", price: "1,300" },
  ]);

  const handleServiceAdd = () => {
    const newService: Service = {
      id: services.length + 1,
      name: "",
      price: "",
    };
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    localStorage.setItem('adminServices', JSON.stringify(updatedServices));
  };

  const handleServiceDelete = (id: number) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    localStorage.setItem('adminServices', JSON.stringify(updatedServices));
    toast({
      title: "Услуга удалена",
      description: "Услуга была успешно удалена из списка",
    });
  };

  const handleServiceUpdate = (id: number, field: keyof Service, value: string) => {
    const updatedServices = services.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    );
    setServices(updatedServices);
    localStorage.setItem('adminServices', JSON.stringify(updatedServices));
  };

  // Load saved services on component mount
  useEffect(() => {
    const savedServices = localStorage.getItem('adminServices');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Управление услугами</h2>
            <Button onClick={handleServiceAdd} className="bg-[#004d40] hover:bg-[#00695c]">
              <Plus className="mr-2 h-4 w-4" /> Добавить услугу
            </Button>
          </div>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="flex gap-4 items-start bg-white/10 p-4 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={`service-name-${service.id}`}>Название услуги</Label>
                  <Input
                    id={`service-name-${service.id}`}
                    value={service.name}
                    onChange={(e) => handleServiceUpdate(service.id, 'name', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor={`service-price-${service.id}`}>Цена</Label>
                  <Input
                    id={`service-price-${service.id}`}
                    value={service.price}
                    onChange={(e) => handleServiceUpdate(service.id, 'price', e.target.value)}
                    className="bg-white/10 border-white/20"
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