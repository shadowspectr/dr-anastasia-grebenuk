import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClipboardList, CreditCard, GraduationCap, Award } from "lucide-react";

const defaultSteps = [
  { title: "Запись", description: "Выберите курс и оставьте заявку", icon: "clipboard" },
  { title: "Оплата", description: "Удобные способы оплаты", icon: "credit-card" },
  { title: "Обучение", description: "Практика под руководством врача", icon: "graduation" },
  { title: "Сертификат", description: "Получите документ об образовании", icon: "award" },
];

const iconMap: Record<string, React.ElementType> = {
  clipboard: ClipboardList,
  "credit-card": CreditCard,
  graduation: GraduationCap,
  award: Award,
};

export const TrainingProcessSection = () => {
  const { data: steps } = useQuery({
    queryKey: ["training_steps"],
    queryFn: async () => {
      const { data } = await supabase.from("training_steps").select("*").order("sort_order");
      return data && data.length > 0 ? data : null;
    },
  });

  const items = steps ?? defaultSteps;

  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">Как проходит обучение</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((step, i) => {
            const Icon = iconMap[step.icon ?? ""] ?? ClipboardList;
            return (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary">Шаг {i + 1}</span>
                <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
                {step.description && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
