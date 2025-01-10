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

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `main-photo-${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      setMainPhoto(publicUrl);
      
      // Save to localStorage for persistence
      localStorage.setItem('adminMainPhoto', publicUrl);
      
      toast({
        title: "Фото загружено",
        description: "Новое главное фото успешно загружено",
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

  // Load saved photo on component mount
  useEffect(() => {
    const savedPhoto = localStorage.getItem('adminMainPhoto');
    if (savedPhoto) {
      setMainPhoto(savedPhoto);
    }
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
              className="hidden"
              accept=".png,.jpg,.jpeg,.svg,.webp,.heic"
              onChange={handlePhotoUpload}
              disabled={isUploading}
            />
            <Label htmlFor="main-photo-upload" className="cursor-pointer">
              <Button 
                className="bg-[#004d40] hover:bg-[#00695c]"
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Загрузка..." : "Загрузить новое фото"}
              </Button>
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};