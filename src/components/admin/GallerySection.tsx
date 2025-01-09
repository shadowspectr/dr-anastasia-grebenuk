import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  before_image: string;
  after_image: string;
}

export const GallerySection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState<{ id: string; type: 'before' | 'after' } | null>(null);

  // Fetch gallery items
  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GalleryItem[];
    }
  });

  // Add gallery item mutation
  const addGalleryMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .insert([{
          title: '',
          description: '',
          before_image: '',
          after_image: ''
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast({
        title: "Успешно",
        description: "Новая работа добавлена в галерею",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить работу",
        variant: "destructive",
      });
      console.error('Error adding gallery item:', error);
    }
  });

  // Delete gallery item mutation
  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast({
        title: "Успешно",
        description: "Работа удалена из галереи",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить работу",
        variant: "destructive",
      });
      console.error('Error deleting gallery item:', error);
    }
  });

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId: string, type: 'before' | 'after') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage({ id: itemId, type });

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}-${type}.${fileExt}`;
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
        id: itemId,
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

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Управление галереей</h2>
            <Button 
              onClick={() => addGalleryMutation.mutate()}
              className="bg-[#004d40] hover:bg-[#00695c]"
              disabled={addGalleryMutation.isPending}
            >
              <Plus className="mr-2 h-4 w-4" /> Добавить работу
            </Button>
          </div>
          <div className="grid gap-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="p-4 bg-white/10 rounded-lg">
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
                      <input
                        type="file"
                        id={`before-${item.id}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, item.id, 'before')}
                        disabled={!!uploadingImage}
                      />
                      <Label htmlFor={`before-${item.id}`} className="cursor-pointer">
                        <Button 
                          className="bg-[#004d40] hover:bg-[#00695c]"
                          disabled={uploadingImage?.id === item.id && uploadingImage?.type === 'before'}
                        >
                          <Upload className="mr-2 h-4 w-4" /> 
                          {uploadingImage?.id === item.id && uploadingImage?.type === 'before' 
                            ? 'Загрузка...' 
                            : 'Загрузить фото'}
                        </Button>
                      </Label>
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
                      <input
                        type="file"
                        id={`after-${item.id}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, item.id, 'after')}
                        disabled={!!uploadingImage}
                      />
                      <Label htmlFor={`after-${item.id}`} className="cursor-pointer">
                        <Button 
                          className="bg-[#004d40] hover:bg-[#00695c]"
                          disabled={uploadingImage?.id === item.id && uploadingImage?.type === 'after'}
                        >
                          <Upload className="mr-2 h-4 w-4" /> 
                          {uploadingImage?.id === item.id && uploadingImage?.type === 'after' 
                            ? 'Загрузка...' 
                            : 'Загрузить фото'}
                        </Button>
                      </Label>
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => deleteGalleryMutation.mutate(item.id)}
                  className="w-full"
                  disabled={deleteGalleryMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Удалить работу
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};