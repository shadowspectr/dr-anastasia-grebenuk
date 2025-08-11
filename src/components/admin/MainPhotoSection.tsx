import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const MainPhotoSection = () => {
  const { toast } = useToast();
  const [mainPhoto, setMainPhoto] = useState("/lovable-uploads/3e533f6e-3c39-4db5-8fc0-7afaa4aeba30.png");
  const [isUploading, setIsUploading] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);

const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/heic'];
  if (!allowedTypes.includes(file.type)) {
    toast({
      title: "Ошибка",
      description: "Поддерживаются только форматы: PNG, JPG, SVG, WebP, HEIC",
      variant: "destructive",
    });
    return;
  }

  try {
    setIsUploading(true);

    // Upload to Supabase Storage with proper contentType
    const fileExt = (file.name.split('.').pop() || '').toLowerCase();
    const fileName = `main/main-photo-${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(fileName, file, { contentType: file.type, cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    setMainPhoto(publicUrl);

    // Persist to database so the homepage (Index.tsx) picks it up
    if (contentId) {
      const { error: updateError } = await supabase
        .from('main_content')
        .update({ main_photo_url: publicUrl })
        .eq('id', contentId);
      if (updateError) throw updateError;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from('main_content')
        .insert({ main_photo_url: publicUrl })
        .select('id, main_photo_url')
        .single();
      if (insertError) throw insertError;
      setContentId(inserted.id);
    }

    toast({
      title: "Фото загружено",
      description: "Новое главное фото сохранено в базе и отображено на сайте",
    });
  } catch (error) {
    console.error('Upload error:', error);
    toast({
      title: "Ошибка",
      description: "Не удалось загрузить фото",
      variant: "destructive",
    });
  } finally {
    setIsUploading(false);
  }
};

// Load current photo from database on mount
useEffect(() => {
  let mounted = true;
  (async () => {
    const { data, error } = await supabase
      .from('main_content')
      .select('id, main_photo_url')
      .maybeSingle();
    if (!error && data && mounted) {
      setContentId(data.id);
      if (data.main_photo_url) setMainPhoto(data.main_photo_url);
    }
  })();
  return () => { mounted = false; };
}, []);

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Главное фото (под логотипом)</h2>
          <img
            src={mainPhoto}
            alt="Current Main Photo"
            className="max-w-[400px] rounded-lg mb-4"
          />
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
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Загрузка..." : "Загрузить новое фото"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};