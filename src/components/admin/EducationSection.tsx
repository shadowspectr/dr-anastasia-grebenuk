import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

export const EducationSection = () => {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: educationData, isLoading } = useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const { data: education, error: educationError } = await supabase
        .from('education')
        .select('*')
        .single();

      if (educationError) throw educationError;

      const { data: photos, error: photosError } = await supabase
        .from('education_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (photosError) throw photosError;

      return {
        education,
        photos: photos || []
      };
    }
  });

  const handleTitleUpdate = async (title: string) => {
    if (!educationData?.education) return;

    const { error } = await supabase
      .from('education')
      .update({ title })
      .eq('id', educationData.education.id);

    if (error) {
      toast.error("Ошибка при обновлении заголовка");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['education'] });
    toast.success("Заголовок обновлен");
  };

  const handleDescriptionUpdate = async (description: string) => {
    if (!educationData?.education) return;

    const { error } = await supabase
      .from('education')
      .update({ description })
      .eq('id', educationData.education.id);

    if (error) {
      toast.error("Ошибка при обновлении описания");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['education'] });
    toast.success("Описание обновлено");
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    if (!educationData?.education) return;

    const file = event.target.files[0];
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `education/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('education_photos')
        .insert({
          education_id: educationData.education.id,
          photo_url: publicUrl
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success("Фото добавлено");
    } catch (error) {
      toast.error("Ошибка при загрузке фото");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoDelete = async (photoId: string) => {
    const { error } = await supabase
      .from('education_photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      toast.error("Ошибка при удалении фото");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['education'] });
    toast.success("Фото удалено");
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2 text-white">Заголовок</h3>
        <Input
          defaultValue={educationData?.education?.title}
          onBlur={(e) => handleTitleUpdate(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder-white/50"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2 text-white">Описание</h3>
        <Textarea
          defaultValue={educationData?.education?.description}
          onBlur={(e) => handleDescriptionUpdate(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[100px]"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2 text-white">Фотографии</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {educationData?.photos?.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                <img
                  src={photo.photo_url}
                  alt="Education"
                  className="w-full h-full object-cover object-center rounded-lg"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handlePhotoDelete(photo.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={uploading}
            className="bg-white/10 border-white/20 text-white file:bg-white/10 file:text-white file:border-0"
          />
          {uploading && (
            <div className="flex items-center gap-2 mt-2 text-white">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Загрузка...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};