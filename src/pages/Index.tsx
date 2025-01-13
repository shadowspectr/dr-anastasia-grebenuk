import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { MessageCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EducationSection } from "@/components/EducationSection";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";




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

const Index = () => {
  const [mainPhoto, setMainPhoto] = useState("/img/main_photo.jpg");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

  // Fetch gallery items
  const { data: galleryItems = [] } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: footerData } = useQuery({
    queryKey: ['footer'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Load main photo from localStorage
  useEffect(() => {
    const savedPhoto = localStorage.getItem('adminMainPhoto');
    if (savedPhoto) {
      setMainPhoto(savedPhoto);
    }
  }, []);

  // Filter categories based on selection
  const filteredCategories = selectedCategory === "all" 
    ? categories 
    : categories.filter(category => category.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#001a1a] bg-opacity-90 text-white relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url("/lovable-uploads/a27874b1-e959-43d2-a635-06b486deb91d.png")' }}
      />
      
      <div className="relative container mx-auto px-4 py-8">
        <header className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <img
              src="/lovable-uploads/cd4553b0-6644-40cd-b20c-17dfe7481cc9.png"
              alt="Anastasia Grebenuk Cosmetology"
              className="w-[200px] md:w-[250px] transition-transform hover:scale-105"
            />
          </div>
          
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden border-4 border-[#004d40] shadow-[0_0_30px_rgba(0,77,64,0.3)] mx-auto">
                <img
                  src={mainPhoto}
                  alt="Cosmetology Services"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-light mt-4">
              dr.anastasia.grebenuk <br/>
              Врач дерматовенеролог- косметолог <br/>
              Более 100 красивых и натуральных губ 👄💉<br/>
              📍г.Донецк | г. Макеевка <br/>
            </h1>
          </div>
        </header>

        {/* Services Section with Categories Dropdown */}
        <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold">Услуги</h2>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-[#002626] border-[#004d40]">
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent className="bg-[#002626] border-[#004d40]">
              <SelectItem value="all">Все категории</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredCategories.map((category) => (
          category.services && category.services.length > 0 && (
            <section key={category.id} className="max-w-2xl mx-auto mb-8 bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">{category.title}</h2>
              <Table>
                <TableBody>
                  {category.services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="text-white text-left">{service.title}</TableCell>
                      <TableCell className="text-white text-right">{service.price} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          )
        ))}

        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Галерея работ</h2>
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {galleryItems.map((item) => (
                  <CarouselItem key={item.id}>
                    <Card className="bg-white/5 backdrop-blur-sm border-none">
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-96 object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-white/80">{item.description}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-[#00332b] hover:bg-[#004d40] border-none text-white" />
              <CarouselNext className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-[#00332b] hover:bg-[#004d40] border-none text-white" />
            </Carousel>
            <div className="text-center mt-4 text-white/60">
              <p className="md:hidden mb-2">Проведите пальцем для просмотра всех работ</p>
              <p className="hidden md:block mb-2">Используйте стрелки для просмотра всех работ</p>
              <div className="flex justify-center gap-2 mt-2">
                {galleryItems.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-white/40"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <EducationSection />

        <section className="text-center mb-16">
          <a 
            href="https://web.telegram.org/k/#@dr_anastasia_grebenuk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              size="lg"
              className="bg-[#00332b] hover:bg-[#004d40] text-white px-12 py-6 text-xl rounded-full mb-4 border border-white/20"
            >
              Записаться
            </Button>
          </a>
          <div className="flex items-center justify-center gap-2 text-lg">
            <span>Записывайтесь через</span>
            <a 
              href="https://web.telegram.org/k/#@dr_anastasia_grebenuk"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#4CAF50] hover:text-[#45a049] flex items-center gap-1"
            >
              Telegram <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </section>

        <footer className="text-center text-sm text-white/60">
          <div className="mb-4">
            <p>© 2024 Anastasia Grebenuk Cosmetology</p>
            <p>Все права защищены</p>
          </div>
          <div className="flex justify-center gap-4">
            {footerData?.instagram && (
              <a 
                href={footerData.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#4CAF50] transition-colors"
              >
                Instagram
              </a>
            )}
            {footerData?.whatsapp && (
              <a 
                href={`https://wa.me/${footerData.whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#4CAF50] transition-colors"
              >
                WhatsApp
              </a>
            )}
            {footerData?.telegram && (
              <a 
                href={footerData.telegram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#4CAF50] transition-colors"
              >
                Telegram
              </a>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
