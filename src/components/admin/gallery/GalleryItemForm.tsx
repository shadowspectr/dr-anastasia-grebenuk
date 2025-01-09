import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GalleryItem } from "./types";
import { ImageUpload } from "./ImageUpload";

interface GalleryItemFormProps {
  item: GalleryItem;
  onDelete: (id: string) => void;
}

export const GalleryItemForm = ({ item, onDelete }: GalleryItemFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState<{ type: 'before' | 'after' } | null>(null);

  // Update gallery item mutation
  const updateGalleryMutation = useMutation({
    mutationFn: async ({ field, value }: { field: keyof GalleryItem; value: string }) => {
      const { error } = await supabase
        .from('gallery')
        .update({ [field]: value })
        .eq('id', item.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные",
        variant: "destructive",
      });
      console.error('Error updating gallery item:', error);
    }
  });

  const handleImageUpload = async (file: File, type: 'before' | 'after') => {
    try {
      setUploadingImage({ type });

      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/heic'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, выберите изображение в формате PNG, JPG, SVG, WEBP или HEIC",
          variant: "destructive",
        });
        return;
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${item.id}-${type}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      // Update gallery item with new image URL
      await updateGalleryMutation.mutateAsync({
        field: type === 'before' ? 'before_image' : 'after_image',
        value: publicUrl
      });

      toast({
        title: "Изображение загружено",
        description: `${type === 'before' ? 'До' : 'После'} изображение успешно загружено`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(null);
    }
  };

  return (
    <div className="p-4 bg-white/10 rounded-lg">
      <div className="space-y-4 mb-4">
        <div>
          <Label>Название</Label>
          <Input
            value={item.title}
            onChange={(e) => updateGalleryMutation.mutate({
              field: 'title',
              value: e.target.value
            })}
            className="bg-white/10 border-white/20"
          />
        </div>
        <div>
          <Label>Описание</Label>
          <Textarea
            value={item.description}
            onChange={(e) => updateGalleryMutation.mutate({
              field: 'description',
              value: e.target.value
            })}
            className="bg-white/10 border-white/20"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <ImageUpload
          label="Фото «До»"
          imageUrl={item.before_image}
          isUploading={uploadingImage?.type === 'before'}
          onUpload={(file) => handleImageUpload(file, 'before')}
          inputId={`before-${item.id}`}
        />
        <ImageUpload
          label="Фото «После»"
          imageUrl={item.after_image}
          isUploading={uploadingImage?.type === 'after'}
          onUpload={(file) => handleImageUpload(file, 'after')}
          inputId={`after-${item.id}`}
        />
      </div>
      <Button
        variant="destructive"
        onClick={() => onDelete(item.id)}
        className="w-full"
      >
        <Trash2 className="mr-2 h-4 w-4" /> Удалить работу
      </Button>
    </div>
  );
};