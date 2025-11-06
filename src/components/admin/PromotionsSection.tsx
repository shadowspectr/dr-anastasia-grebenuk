import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Eye, EyeOff, Calendar, Tag, Target, Link as LinkIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_text: string;
  valid_until: string | null;
  is_active: boolean;
  image_url: string | null;
  button_text: string;
  button_link: string;
  priority: number;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  utm_campaign: string | null;
  target_audience: string | null;
  promo_code: string | null;
  show_timer: boolean;
}

const PromotionsSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Promotion>>({
    title: "",
    description: "",
    discount_text: "",
    button_text: "ЗАПИСАТЬСЯ",
    button_link: "/booking",
    priority: 0,
    is_active: true,
    show_timer: false,
  });

  const { data: promotions, isLoading } = useQuery({
    queryKey: ["admin-promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("priority", { ascending: false });

      if (error) throw error;
      return data as Promotion[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Promotion>) => {
      const { error } = await supabase.from("promotions").insert(data as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
      toast({ title: "Акция создана" });
      setIsAdding(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Ошибка создания", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Promotion> }) => {
      const { error } = await supabase
        .from("promotions")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
      toast({ title: "Акция обновлена" });
      setEditingId(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "Ошибка обновления", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promotions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
      toast({ title: "Акция удалена" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discount_text: "",
      button_text: "ЗАПИСАТЬСЯ",
      button_link: "/booking",
      priority: 0,
      is_active: true,
      show_timer: false,
    });
  };

  const handleEdit = (promo: Promotion) => {
    setEditingId(promo.id);
    setFormData(promo);
    setIsAdding(false);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Акции и специальные предложения</h2>
          <p className="text-muted-foreground">Управление промо-кампаниями с SEO и маркетинговыми инструментами</p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Создать акцию
        </Button>
      </div>

      {(isAdding || editingId) && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{editingId ? "Редактировать акцию" : "Новая акция"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Основная информация */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Основная информация
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Название акции *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Скидка 20% на все услуги"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Текст скидки</Label>
                  <Input
                    value={formData.discount_text}
                    onChange={(e) => setFormData({ ...formData, discount_text: e.target.value })}
                    placeholder="-20%, 2+1, и т.д."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Подробное описание акции"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Действует до</Label>
                  <Input
                    type="date"
                    value={formData.valid_until || ""}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Приоритет (чем больше, тем выше)</Label>
                  <Input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL изображения</Label>
                <Input
                  value={formData.image_url || ""}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <Separator />

            {/* Кнопка действия */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Кнопка действия
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Текст кнопки</Label>
                  <Input
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ссылка кнопки</Label>
                  <Input
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    placeholder="/booking"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Маркетинговые инструменты */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Маркетинговые инструменты
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Промокод</Label>
                  <Input
                    value={formData.promo_code || ""}
                    onChange={(e) => setFormData({ ...formData, promo_code: e.target.value })}
                    placeholder="LETO2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label>UTM Campaign</Label>
                  <Input
                    value={formData.utm_campaign || ""}
                    onChange={(e) => setFormData({ ...formData, utm_campaign: e.target.value })}
                    placeholder="summer_promo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Целевая аудитория</Label>
                <Input
                  value={formData.target_audience || ""}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  placeholder="Новые клиенты, постоянные клиенты, и т.д."
                />
              </div>
            </div>

            <Separator />

            {/* SEO настройки */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">SEO оптимизация</h3>

              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={formData.meta_title || ""}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="Для поисковиков (до 60 символов)"
                />
              </div>

              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={formData.meta_description || ""}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Для поисковиков (до 160 символов)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>OG Image URL (для соцсетей)</Label>
                <Input
                  value={formData.og_image_url || ""}
                  onChange={(e) => setFormData({ ...formData, og_image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <Separator />

            {/* Настройки отображения */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Активна</Label>
                  <p className="text-sm text-muted-foreground">Показывать на сайте</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Показывать таймер</Label>
                  <p className="text-sm text-muted-foreground">Обратный отсчет до окончания</p>
                </div>
                <Switch
                  checked={formData.show_timer}
                  onCheckedChange={(checked) => setFormData({ ...formData, show_timer: checked })}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmit} disabled={!formData.title}>
                {editingId ? "Сохранить" : "Создать"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  resetForm();
                }}
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {promotions?.map((promo) => (
          <Card key={promo.id} className={!promo.is_active ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>{promo.title}</CardTitle>
                    {promo.discount_text && (
                      <span className="text-sm bg-destructive text-destructive-foreground px-2 py-1 rounded">
                        {promo.discount_text}
                      </span>
                    )}
                  </div>
                  <CardDescription>{promo.description}</CardDescription>
                  {promo.valid_until && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      До {new Date(promo.valid_until).toLocaleDateString("ru")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {promo.is_active ? (
                    <Eye className="w-5 h-5 text-green-500" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(promo)}>
                    Редактировать
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(promo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {promotions?.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Нет созданных акций. Создайте первую акцию для привлечения клиентов!
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromotionsSection;
