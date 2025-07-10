import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Fetch FAQ from database
  const {
    data: faqs = []
  } = useQuery({
    queryKey: ['faq'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('faq').select('*').order('sort_order', {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });
  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  return <section className="px-4 animate-fade-in py-[20px]">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-light text-center mb-8 text-foreground transition-all duration-300 hover:scale-105">
          ЧАСТО ЗАДАВАЕМЫЕ<br />ВОПРОСЫ
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => <div key={faq.id} className="animate-slide-in-right" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <button onClick={() => toggleFAQ(index)} className="w-full bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-6 py-4 text-left hover:from-primary/20 hover:to-accent/20 transition-all duration-300 border border-primary/20 hover:scale-[1.02] hover:shadow-md">
                <span className="text-sm text-foreground font-medium">
                  {index + 1}. {faq.question}
                </span>
              </button>
              
              {expandedIndex === index && <div className="mt-2 bg-card rounded-2xl p-4 border border-border animate-accordion-down">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>}
            </div>)}
        </div>
      </div>
    </section>;
};
export { FAQSection };