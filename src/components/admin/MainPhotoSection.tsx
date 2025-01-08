import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MainPhotoSection = () => {
  const { toast } = useToast();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Here you would typically make an API call to upload the file
      console.log('Uploading main photo:', file);
      toast({
        title: "Фото загружено",
        description: "Новое главное фото успешно загружено",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить фото",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Текущее главное фото</h2>
          <img
            src="/lovable-uploads/046f160c-fafc-4903-917b-f923013238c4.png"
            alt="Current Main Photo"
            className="max-w-[400px] rounded-lg mb-4"
          />
          <div className="relative">
            <input
              type="file"
              id="main-photo-upload"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <Label htmlFor="main-photo-upload" className="cursor-pointer">
              <Button className="bg-[#004d40] hover:bg-[#00695c]">
                <Upload className="mr-2 h-4 w-4" /> Загрузить новое фото
              </Button>
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};