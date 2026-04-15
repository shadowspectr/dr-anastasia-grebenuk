import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Monitor, CheckCircle } from "lucide-react";

const levels = [
  { value: "all", label: "Все" },
  { value: "beginner", label: "Начинающим" },
  { value: "advanced", label: "Продвинутым" },
  { value: "pro", label: "Профи" },
];

export const CoursesSection = () => {
  const [filter, setFilter] = useState("all");

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const filtered = filter === "all" ? courses : courses.filter((c) => c.level === filter);

  const scrollToApplication = (courseTitle?: string) => {
    const el = document.querySelector("#application") as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="courses" className="section-padding bg-secondary/50">
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">Курсы</h2>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {levels.map((l) => (
            <Button
              key={l.value}
              variant={filter === l.value ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setFilter(l.value)}
            >
              {l.label}
            </Button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Card key={course.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              {course.badge && (
                <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                  {course.badge}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                {course.description && (
                  <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {course.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {course.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Monitor className="h-4 w-4" /> {course.format === "online" ? "Онлайн" : course.format === "offline" ? "Очно" : "Смешанный"}
                  </span>
                </div>

                {course.features && course.features.length > 0 && (
                  <ul className="space-y-1">
                    {course.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-baseline gap-2">
                  {course.old_price && (
                    <span className="text-sm line-through text-muted-foreground">
                      {Number(course.old_price).toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                  {course.price && (
                    <span className="text-xl font-bold text-primary">
                      {Number(course.price).toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                </div>

                <Button className="w-full rounded-full" onClick={() => scrollToApplication(course.title)}>
                  Записаться
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground">Курсы скоро появятся</p>
        )}
      </div>
    </section>
  );
};
