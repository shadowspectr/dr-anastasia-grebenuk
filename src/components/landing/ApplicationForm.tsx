import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

export const ApplicationForm = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: courses = [] } = useQuery({
    queryKey: ["courses_for_form"],
    queryFn: async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, title")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast({ title: "Заполните имя и телефон", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("applications").insert({
      name: name.trim(),
      phone: phone.trim(),
      course_id: courseId || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Ошибка отправки", description: "Попробуйте позже", variant: "destructive" });
    } else {
      toast({ title: "Заявка отправлена!", description: "Мы свяжемся с вами в ближайшее время" });
      setName("");
      setPhone("");
      setCourseId("");
    }
  };

  return (
    <section id="application" className="section-padding bg-primary/5">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Записаться на курс</h2>
          <p className="text-sm text-muted-foreground">Оставьте заявку и мы свяжемся с вами</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-4">
          <Input
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
          />
          <Input
            placeholder="Телефон"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
          />
          {courses.length > 0 && (
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Выберите курс (необязательно)</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          )}
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Отправка..." : "Отправить заявку"}
          </Button>
        </form>
      </div>
    </section>
  );
};
