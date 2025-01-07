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

const services = [
  { name: "Контурная пластика губ", price: "9,000" },
  { name: "Биоревитализация лица", price: "2,000" },
  { name: "Мезотерапия лица", price: "4,000" },
  { name: "Мезотерапия волос", price: "2,500" },
  { name: "Чистка лица", price: "3,000" },
  { name: "Пилинг", price: "1,300" },
];

const galleryItems = [
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
  // Добавьте больше работ по мере необходимости
];

const Index = () => {
  return (
    <div className="min-h-screen bg-[#001a1a] bg-opacity-90 text-white relative">
      {/* Background texture overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url("/lovable-uploads/046f160c-fafc-4903-917b-f923013238c4.png")' }}
      />
      
      <div className="relative container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-16">
          <img
            src="/lovable-uploads/cd4553b0-6644-40cd-b20c-17dfe7481cc9.png"
            alt="Anastasia Grebenuk Cosmetology"
            className="mx-auto mb-6 max-w-[300px] md:max-w-[400px]"
          />
          <h1 className="text-xl md:text-2xl font-light mt-4">
            Косметолог с медицинским образованием
          </h1>
        </header>

        {/* Services Section */}
        <section className="max-w-2xl mx-auto mb-16 bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <Table>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.name}>
                  <TableCell className="text-white text-left">{service.name}</TableCell>
                  <TableCell className="text-white text-right">от {service.price} ₽</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Gallery Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Галерея работ</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {galleryItems.map((item) => (
                <CarouselItem key={item.id}>
                  <Card className="bg-white/5 backdrop-blur-sm border-none">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-white/60 mb-2">До</p>
                          <img
                            src={item.beforeImage}
                            alt={`До - ${item.title}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-white/60 mb-2">После</p>
                          <img
                            src={item.afterImage}
                            alt={`После - ${item.title}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-white/80">{item.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-16">
          <Button 
            size="lg"
            className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white px-12 py-6 text-xl rounded-full mb-4"
          >
            Записаться
          </Button>
          <div className="flex items-center justify-center gap-2 text-lg">
            <span>Записывайтесь через</span>
            <a 
              href="https://t.me/your_telegram_username" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#D946EF] hover:text-[#D946EF]/90 flex items-center gap-1"
            >
              Telegram <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-white/60">
          <div className="mb-4">
            <p>© 2024 Anastasia Grebenuk Cosmetology</p>
            <p>Все права защищены</p>
          </div>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">WhatsApp</a>
            <a href="#" className="hover:text-white">Telegram</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;