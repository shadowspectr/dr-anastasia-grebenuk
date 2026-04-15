import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export const ReviewsSection = () => {
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % reviews.length), 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  if (!reviews.length) return null;

  const review = reviews[current];

  return (
    <section id="reviews" className="section-padding bg-accent/20">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">Отзывы учеников</h2>

        <div className="relative bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
          <div className="flex flex-col items-center text-center space-y-4">
            {review.photo_url && (
              <img
                src={review.photo_url}
                alt={review.name}
                className="w-16 h-16 rounded-full object-cover"
                loading="lazy"
              />
            )}
            <div className="flex gap-0.5">
              {Array.from({ length: review.rating ?? 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-muted-foreground italic leading-relaxed">"{review.text}"</p>
            <div>
              <p className="font-semibold text-foreground">{review.name}</p>
              {review.specialization && (
                <p className="text-xs text-muted-foreground">{review.specialization}</p>
              )}
            </div>
          </div>

          {reviews.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((c) => (c - 1 + reviews.length) % reviews.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % reviews.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {reviews.length > 1 && (
          <div className="flex justify-center gap-1.5">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-border"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
