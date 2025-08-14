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
  id?: string;
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
        .maybeSingle();

      if (error) throw error;
      return data as FooterData | null;
    }
  });

  // Update footer mutation
  const updateFooterMutation = useMutation({
    mutationFn: async (updates: Partial<FooterData>) => {
      // Если записи нет, создаем новую
      if (!footerData) {
        const { error } = await supabase
          .from('footer_links')
          .insert(updates);
        
        if (error) throw error;
      } else {
        // Если запись есть, обновляем её
        const { error } = await supabase
          .from('footer_links')
          .update(updates)
          .eq('id', footerData.id);

        if (error) throw error;
      }
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
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Социальные сети</h2>
          <p className="text-sm text-white/60 mb-6">
            Добавьте ссылки на ваши социальные сети. Они будут отображаться в разделе "Контакты" на сайте.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instagram" className="text-white">Instagram</Label>
              <Input
                id="instagram"
                value={footerData?.instagram || ''}
                onChange={(e) => updateFooterMutation.mutate({ instagram: e.target.value })}
                placeholder="https://instagram.com/username"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            
            <div>
              <Label htmlFor="whatsapp" className="text-white">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={footerData?.whatsapp || ''}
                onChange={(e) => updateFooterMutation.mutate({ whatsapp: e.target.value })}
                placeholder="79491234567 (без + и пробелов)"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            
            <div>
              <Label htmlFor="telegram" className="text-white">Telegram</Label>
              <Input
                id="telegram"
                value={footerData?.telegram || ''}
                onChange={(e) => updateFooterMutation.mutate({ telegram: e.target.value })}
                placeholder="https://t.me/username"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            
            <div>
              <Label htmlFor="vkontakte" className="text-white">ВКонтакте</Label>
              <Input
                id="vkontakte"
                value={footerData?.vkontakte || ''}
                onChange={(e) => updateFooterMutation.mutate({ vkontakte: e.target.value })}
                placeholder="https://vk.com/username"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-medium text-white mb-2">Предварительный просмотр:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {footerData?.instagram && (
                <div className="bg-primary/20 rounded-full py-2 px-3 text-center">
                  <span className="text-white">INSTAGRAM</span>
                </div>
              )}
              {footerData?.whatsapp && (
                <div className="bg-primary/20 rounded-full py-2 px-3 text-center">
                  <span className="text-white">WHATSAPP</span>
                </div>
              )}
              {footerData?.telegram && (
                <div className="bg-primary/20 rounded-full py-2 px-3 text-center">
                  <span className="text-white">TELEGRAM</span>
                </div>
              )}
              {footerData?.vkontakte && (
                <div className="bg-primary/20 rounded-full py-2 px-3 text-center">
                  <span className="text-white">ВКОНТАКТЕ</span>
                </div>
              )}
            </div>
            {!footerData?.instagram && !footerData?.whatsapp && !footerData?.telegram && !footerData?.vkontakte && (
              <p className="text-white/40 text-xs italic">Добавьте ссылки, чтобы увидеть предварительный просмотр</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};