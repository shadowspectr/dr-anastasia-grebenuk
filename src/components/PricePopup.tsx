import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";

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

interface PricePopupProps {
  categories: Category[];
  children: React.ReactNode;
}

const PricePopup = ({ categories, children }: PricePopupProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">ПРАЙС-ЛИСТ УСЛУГ</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="animate-fade-in">
                <h3 className="text-lg font-semibold text-foreground mb-3 text-center">
                  {category.title}
                </h3>
                {category.services && category.services.length > 0 ? (
                  <div className="space-y-2">
                    {category.services.map((service) => (
                      <div key={service.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/20 transition-colors duration-200 px-2 rounded">
                        <span className="text-sm text-foreground flex-1">{service.title}</span>
                        <span className="text-sm font-medium text-foreground ml-2">{service.price} ₽</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center italic">Услуги временно недоступны</p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export { PricePopup };