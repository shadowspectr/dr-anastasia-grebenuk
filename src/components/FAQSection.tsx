import { useState } from "react";

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Все специалисты имеют соответствующую квалификацию?",
      answer: "Да, все наши специалисты имеют медицинское образование и сертификацию по соответствующим направлениям косметологии."
    },
    {
      question: "Могу ли я попасть на консультацию?",
      answer: "Конечно! Мы проводим консультации для всех клиентов, чтобы подобрать оптимальный план процедур."
    },
    {
      question: "Быть красивой – это больно?",
      answer: "Мы используем современные методы обезболивания и щадящие техники, чтобы процедуры были максимально комфортными."
    },
    {
      question: "Массаж лица и тела проводится курсом?",
      answer: "Да, для достижения максимального эффекта рекомендуется курсовое прохождение массажных процедур."
    },
    {
      question: "Можно ли приобрести у вас косметику для домашнего ухода?",
      answer: "Да, у нас есть профессиональная косметика для домашнего использования от проверенных брендов."
    },
    {
      question: "Есть ли у вас подарочные сертификаты и абонементы?",
      answer: "Да, мы предлагаем подарочные сертификаты на любую сумму и абонементы на популярные процедуры."
    }
  ];

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-light text-center mb-8 text-foreground">
          ЧАСТО ЗАДАВАЕМЫЕ<br/>ВОПРОСЫ
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-6 py-4 text-left hover:from-primary/20 hover:to-accent/20 transition-all duration-300 border border-primary/20"
              >
                <span className="text-sm text-foreground font-medium">
                  {index + 1}. {faq.question}
                </span>
              </button>
              
              {expandedIndex === index && (
                <div className="mt-2 bg-card rounded-2xl p-4 border border-border animate-accordion-down">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { FAQSection };