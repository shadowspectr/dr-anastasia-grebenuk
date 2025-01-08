import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Plus, Save } from "lucide-react";

interface Service {
  id: number;
  name: string;
  price: string;
}

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "Контурная пластика губ", price: "9,000" },
    { id: 2, name: "Биоревитализация лица", price: "2,000" },
    { id: 3, name: "Мезотерапия лица", price: "4,000" },
    { id: 4, name: "Мезотерапия волос", price: "2,500" },
    { id: 5, name: "Чистка лица", price: "3,000" },
    { id: 6, name: "Пилинг", price: "1,300" },
  ]);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: 1,
      title: "Увеличение губ",
      description: "Контурная пластика губ препаратом на основе гиалуроновой кислоты",
      beforeImage: "/lovable-uploads/046f160c-fafc-4903-917b-f923013238c4.png",
      afterImage: "/lovable-uploads/046f160c-fafc-4903-917b-f923013238c4.png",
    },
    {
      id: 2,
      title: "Биоревитализация",
      description: "Процедура глубокого увлажнения кожи с помощью инъекций гиалуроновой кислоты",
      beforeImage: "/lovable-uploads/046f160c-fafc-4903-917b-f923013238c4.png",
      afterImage: "/lovable-uploads/046f160c-fafc-4903-917b-f923013238c4.png",
    },
  ]);

  const [footerData, setFooterData] = useState({
    instagram: "",
    whatsapp: "",
    telegram: "",
  });

  const handleImageUpload = (type: 'logo' | 'main' | 'gallery') => {
    // In a real application, this would handle file upload
    toast({
      title: "Загрузка изображения",
      description: "Функция загрузки изображения будет добавлена позже",
    });
  };

  const handleServiceAdd = () => {
    const newService: Service = {
      id: services.length + 1,
      name: "",
      price: "",
    };
    setServices([...services, newService]);
  };

  const handleServiceDelete = (id: number) => {
    setServices(services.filter(service => service.id !== id));
    toast({
      title: "Услуга удалена",
      description: "Услуга была успешно удалена из списка",
    });
  };

  const handleServiceUpdate = (id: number, field: keyof Service, value: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const handleGalleryAdd = () => {
    const newItem: GalleryItem = {
      id: galleryItems.length + 1,
      title: "",
      description: "",
      beforeImage: "",
      afterImage: "",
    };
    setGalleryItems([...galleryItems, newItem]);
  };

  const handleGalleryDelete = (id: number) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
    toast({
      title: "Элемент галереи удален",
      description: "Элемент был успешно удален из галереи",
    });
  };

  const handleFooterSave = () => {
    toast({
      title: "Сохранено",
      description: "Данные футера успешно обновлены",
    });
  };

  return (
    <div className="min-h-screen bg-[#001a1a] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/" className="text-white hover:text-[#004d40] transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-semibold">Панель администратора</h1>
        </div>

        <Tabs defaultValue="logo" className="space-y-6">
          <TabsList className="bg-white/10 w-full justify-start overflow-x-auto">
            <TabsTrigger value="logo">Логотип</TabsTrigger>
            <TabsTrigger value="main-photo">Главное фото</TabsTrigger>
            <TabsTrigger value="services">Услуги</TabsTrigger>
            <TabsTrigger value="gallery">Галерея</TabsTrigger>
            <TabsTrigger value="footer">Футер</TabsTrigger>
          </TabsList>

          <TabsContent value="logo">
            <Card className="bg-white/5 border-none">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Текущий логотип</h2>
                  <img
                    src="/lovable-uploads/cd4553b0-6644-40cd-b20c-17dfe7481cc9.png"
                    alt="Current Logo"
                    className="max-w-[200px] mb-4"
                  />
                  <Button onClick={() => handleImageUpload('logo')} className="bg-[#004d40] hover:bg-[#00695c]">
                    <Upload className="mr-2 h-4 w-4" /> Загрузить новый логотип
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="main-photo">
            <Card className="bg-white/5 border-none">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Текущее главное фото</h2>
                  <img
                    src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8"
                    alt="Current Main Photo"
                    className="max-w-[400px] rounded-lg mb-4"
                  />
                  <Button onClick={() => handleImageUpload('main')} className="bg-[#004d40] hover:bg-[#00695c]">
                    <Upload className="mr-2 h-4 w-4" /> Загрузить новое фото
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
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
                      <div key={service.id} className="flex gap-4 items-start">
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
          </TabsContent>

          <TabsContent value="gallery">
            <Card className="bg-white/5 border-none">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Управление галереей</h2>
                    <Button onClick={handleGalleryAdd} className="bg-[#004d40] hover:bg-[#00695c]">
                      <Plus className="mr-2 h-4 w-4" /> Добавить работу
                    </Button>
                  </div>
                  <div className="grid gap-6">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="p-4 bg-white/10 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Фото "До"</Label>
                            <div className="mt-2">
                              <Button onClick={() => handleImageUpload('gallery')} className="bg-[#004d40] hover:bg-[#00695c]">
                                <Upload className="mr-2 h-4 w-4" /> Загрузить фото
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>Фото "После"</Label>
                            <div className="mt-2">
                              <Button onClick={() => handleImageUpload('gallery')} className="bg-[#004d40] hover:bg-[#00695c]">
                                <Upload className="mr-2 h-4 w-4" /> Загрузить фото
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => handleGalleryDelete(item.id)}
                          className="w-full"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Удалить работу
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer">
            <Card className="bg-white/5 border-none">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Редактирование футера</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={footerData.instagram}
                        onChange={(e) => setFooterData({ ...footerData, instagram: e.target.value })}
                        placeholder="Ссылка на Instagram"
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={footerData.whatsapp}
                        onChange={(e) => setFooterData({ ...footerData, whatsapp: e.target.value })}
                        placeholder="Номер WhatsApp"
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telegram">Telegram</Label>
                      <Input
                        id="telegram"
                        value={footerData.telegram}
                        onChange={(e) => setFooterData({ ...footerData, telegram: e.target.value })}
                        placeholder="Ссылка на Telegram"
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <Button onClick={handleFooterSave} className="bg-[#004d40] hover:bg-[#00695c]">
                      <Save className="mr-2 h-4 w-4" /> Сохранить изменения
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
