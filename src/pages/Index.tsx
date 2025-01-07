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
        {/* Header Section with Enhanced Logo */}
        <header className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <img
              src="/lovable-uploads/cd4553b0-6644-40cd-b20c-17dfe7481cc9.png"
              alt="Anastasia Grebenuk Cosmetology"
              className="w-[200px] md:w-[250px] transition-transform hover:scale-105"
            />
          </div>
          
          {/* Main header image */}
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              alt="Cosmetology Services"
              className="w-full h-[300px] md:h-[400px] object-cover rounded-lg mb-6"
            />
            <h1 className="text-xl md:text-2xl font-light mt-4">
              Косметолог с медицинским образованием
            </h1>
          </div>
        </header>

        {/* Services Section with Updated Colors */}
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

        {/* Gallery Section with Enhanced Mobile Navigation */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Галерея работ</h2>
          <div className="relative">
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

        {/* CTA Section with Updated Colors and Link */}
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

        {/* Footer with Updated Colors */}
        <footer className="text-center text-sm text-white/60">
          <div className="mb-4">
            <p>© 2024 Anastasia Grebenuk Cosmetology</p>
            <p>Все права защищены</p>
          </div>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-[#4CAF50] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#4CAF50] transition-colors">WhatsApp</a>
            <a href="#" className="hover:text-[#4CAF50] transition-colors">Telegram</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;