import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface MainContent {
  id: string;
  main_photo_url: string;
  about_title: string;
  about_description: string;
  about_advantages: string[];
}

export const AboutSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch main content
  const { data: mainContent, isLoading } = useQuery({
    queryKey: ['mainContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('main_content')
        .select('*')
        .single();

      if (error) throw error;
      return data as MainContent;
    }
  });

  // Update main content mutation
  const updateMainContentMutation = useMutation({
    mutationFn: async (updates: Partial<MainContent>) => {
      const { error } = await supabase
        .from('main_content')
        .update(updates)
        .eq('id', mainContent?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainContent'] });
      toast({
        title: "Сохранено",
        description: "Контент успешно обновлен",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить контент",
        variant: "destructive",
      });
    }
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `main-photo-${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      updateMainContentMutation.mutate({ main_photo_url: publicUrl });
      
      toast({
        title: "Фото загружено",
        description: "Главное фото успешно обновлено",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить фото",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const addAdvantage = () => {
    const currentAdvantages = mainContent?.about_advantages || [];
    updateMainContentMutation.mutate({
      about_advantages: [...currentAdvantages, ""]
    });
  };

  const updateAdvantage = (index: number, value: string) => {
    const currentAdvantages = mainContent?.about_advantages || [];
    const newAdvantages = [...currentAdvantages];
    newAdvantages[index] = value;
    updateMainContentMutation.mutate({
      about_advantages: newAdvantages
    });
  };

  const removeAdvantage = (index: number) => {
    const currentAdvantages = mainContent?.about_advantages || [];
    const newAdvantages = currentAdvantages.filter((_, i) => i !== index);
    updateMainContentMutation.mutate({
      about_advantages: newAdvantages
    });
  };

  if (isLoading) {
    return <div className="text-white">Загрузка...</div>;
  }

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Управление главным фото и блоком "О нас"</h2>
          
          {/* Main Photo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Главное фото</h3>
            {mainContent?.main_photo_url && (
              <img
                src={mainContent.main_photo_url}
                alt="Main Photo"
                className="max-w-[400px] rounded-lg"
              />
            )}
            <div className="relative">
              <input
                type="file"
                id="main-photo-upload"
                onChange={handlePhotoUpload}
                accept=".png,.jpg,.jpeg,.svg,.webp,.heic"
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Button 
                className="bg-[#004d40] hover:bg-[#00695c] relative z-0"
                disabled={isUploading}
              >
                {isUploading ? "Загрузка..." : "Загрузить новое фото"}
              </Button>
            </div>
          </div>

          {/* About Title */}
          <div>
            <Label className="text-white">Заголовок блока "О нас"</Label>
            <Input
              value={mainContent?.about_title || ''}
              onChange={(e) => updateMainContentMutation.mutate({ about_title: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {/* About Description */}
          <div>
            <Label className="text-white">Описание</Label>
            <Textarea
              value={mainContent?.about_description || ''}
              onChange={(e) => updateMainContentMutation.mutate({ about_description: e.target.value })}
              className="bg-white/10 border-white/20 text-white min-h-[100px]"
            />
          </div>

          {/* About Advantages */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-white">Преимущества клиники</Label>
              <Button onClick={addAdvantage} className="bg-[#004d40] hover:bg-[#00695c]">
                <Plus className="mr-2 h-4 w-4" /> Добавить преимущество
              </Button>
            </div>
            <div className="space-y-3">
              {(mainContent?.about_advantages || []).map((advantage, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    value={advantage}
                    onChange={(e) => updateAdvantage(index, e.target.value)}
                    className="bg-white/10 border-white/20 text-white flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeAdvantage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};