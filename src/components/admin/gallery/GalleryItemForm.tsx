import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  before_image: string;
  after_image: string;
}

interface GalleryItemFormProps {
  item: GalleryItem;
  onDelete: (id: string) => void;
}

export const GalleryItemForm = ({ item, onDelete }: GalleryItemFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState<{ id: string; type: 'before' | 'after' } | null>(null);

  // Update gallery item mutation
  const updateGalleryMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: keyof GalleryItem; value: string }) => {
      const { error } = await supabase
        .from('gallery')
        .update({ [field]: value })
        .eq('id', id);

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage({ id: item.id, type });

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${item.id}-${type}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      // Update gallery item with new image URL
      await updateGalleryMutation.mutateAsync({
        id: item.id,
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
              id: item.id,
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
              id: item.id,
              field: 'description',
              value: e.target.value
            })}
            className="bg-white/10 border-white/20"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Фото "До"</Label>
          <div className="mt-2">
            {item.before_image && (
              <img
                src={item.before_image}
                alt="Before"
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <div className="relative">
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, 'before')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                disabled={!!uploadingImage}
              />
              <Button 
                type="button"
                className="w-full bg-[#004d40] hover:bg-[#00695c]"
                disabled={uploadingImage?.id === item.id && uploadingImage?.type === 'before'}
              >
                <Upload className="mr-2 h-4 w-4" /> 
                {uploadingImage?.id === item.id && uploadingImage?.type === 'before' 
                  ? 'Загрузка...' 
                  : 'Загрузить фото'}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Label>Фото "После"</Label>
          <div className="mt-2">
            {item.after_image && (
              <img
                src={item.after_image}
                alt="After"
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <div className="relative">
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, 'after')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                disabled={!!uploadingImage}
              />
              <Button 
                type="button"
                className="w-full bg-[#004d40] hover:bg-[#00695c]"
                disabled={uploadingImage?.id === item.id && uploadingImage?.type === 'after'}
              >
                <Upload className="mr-2 h-4 w-4" /> 
                {uploadingImage?.id === item.id && uploadingImage?.type === 'after' 
                  ? 'Загрузка...' 
                  : 'Загрузить фото'}
              </Button>
            </div>
          </div>
        </div>
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