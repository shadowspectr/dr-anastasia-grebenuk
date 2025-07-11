import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface FooterData {
  id: string;
  instagram: string;
  whatsapp: string;
  telegram: string;
  vkontakte: string;
  telegram_channel: string;
}

export const FooterSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch footer data
  const { data: footerData, isLoading } = useQuery({
    queryKey: ['footer'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .single();

      if (error) throw error;
      return data as FooterData;
    }
  });

  // Update footer mutation
  const updateFooterMutation = useMutation({
    mutationFn: async (updates: Partial<FooterData>) => {
      const { error } = await supabase
        .from('footer_links')
        .update(updates)
        .eq('id', footerData?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer'] });
      toast({
        title: "Сохранено",
        description: "Данные футера успешно обновлены",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные футера",
        variant: "destructive",
      });
      console.error('Error updating footer:', error);
    }
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Редактирование футера</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={footerData?.instagram || ''}
                onChange={(e) => updateFooterMutation.mutate({ instagram: e.target.value })}
                placeholder="Ссылка на Instagram"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={footerData?.whatsapp || ''}
                onChange={(e) => updateFooterMutation.mutate({ whatsapp: e.target.value })}
                placeholder="Номер WhatsApp"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="telegram">Telegram</Label>
              <Input
                id="telegram"
                value={footerData?.telegram || ''}
                onChange={(e) => updateFooterMutation.mutate({ telegram: e.target.value })}
                placeholder="Ссылка на Telegram"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="vkontakte">ВКонтакте</Label>
              <Input
                id="vkontakte"
                value={footerData?.vkontakte || ''}
                onChange={(e) => updateFooterMutation.mutate({ vkontakte: e.target.value })}
                placeholder="Ссылка на ВКонтакте"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="telegram_channel">Telegram канал</Label>
              <Input
                id="telegram_channel"
                value={footerData?.telegram_channel || ''}
                onChange={(e) => updateFooterMutation.mutate({ telegram_channel: e.target.value })}
                placeholder="Ссылка на Telegram канал"
                className="bg-white/10 border-white/20"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};