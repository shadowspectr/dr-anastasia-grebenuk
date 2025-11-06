import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_text: string;
  valid_until: string | null;
  image_url: string | null;
  button_text: string;
  button_link: string;
  promo_code: string | null;
  show_timer: boolean;
}

const PromotionsSection = () => {
  const { data: promotions, isLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("is_active", true)
        .order("priority", { ascending: false });

      if (error) throw error;
      return data as Promotion[];
    },
  });

  if (isLoading || !promotions || promotions.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-lg px-6 py-2">
            🎉 СПЕЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Актуальные акции
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <PromotionCard key={promo.id} promotion={promo} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PromotionCard = ({ promotion }: { promotion: Promotion }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!promotion.show_timer || !promotion.valid_until) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(promotion.valid_until!);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Акция завершена");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`Осталось ${days} дн. ${hours} ч.`);
      } else if (hours > 0) {
        setTimeLeft(`Осталось ${hours} ч. ${minutes} мин.`);
      } else {
        setTimeLeft(`Осталось ${minutes} мин.`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [promotion.show_timer, promotion.valid_until]);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
      {promotion.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={promotion.image_url}
            alt={promotion.title}
            className="w-full h-full object-cover"
          />
          {promotion.discount_text && (
            <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold text-xl shadow-lg">
              {promotion.discount_text}
            </div>
          )}
        </div>
      )}

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {promotion.title}
          </h3>
          <p className="text-muted-foreground">{promotion.description}</p>
        </div>

        <div className="space-y-2">
          {promotion.valid_until && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                До {format(new Date(promotion.valid_until), "d MMMM yyyy", { locale: ru })}
              </span>
            </div>
          )}

          {promotion.show_timer && timeLeft && (
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Clock className="w-4 h-4" />
              <span>{timeLeft}</span>
            </div>
          )}

          {promotion.promo_code && (
            <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
              <Tag className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono font-bold">{promotion.promo_code}</span>
              <Badge variant="secondary" className="ml-auto">Промокод</Badge>
            </div>
          )}
        </div>

        <Link to={promotion.button_link} className="block">
          <Button className="w-full" size="lg">
            {promotion.button_text}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PromotionsSection;
