import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown } from "lucide-react";

export const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const { data: faqs = [] } = useQuery({
    queryKey: ["faq"],
    queryFn: async () => {
      const { data } = await supabase.from("faq").select("*").order("sort_order");
      return data ?? [];
    },
  });

  if (!faqs.length) return null;

  return (
    <section id="faq" className="section-padding bg-secondary/30">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">
          Часто задаваемые вопросы
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium text-foreground pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${
                    expandedIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedIndex === index && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
