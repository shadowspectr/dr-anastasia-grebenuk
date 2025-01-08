import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const LogoSection = () => {
  const { toast } = useToast();
  const [logo, setLogo] = useState("/lovable-uploads/cd4553b0-6644-40cd-b20c-17dfe7481cc9.png");

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Create a temporary URL for the uploaded file
      const imageUrl = URL.createObjectURL(file);
      setLogo(imageUrl);
      
      // Here you would typically make an API call to upload the file
      console.log('Uploading logo:', file);
      
      toast({
        title: "Логотип загружен",
        description: "Новый логотип успешно загружен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить логотип",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Текущий логотип</h2>
          <img
            src={logo}
            alt="Current Logo"
            className="max-w-[200px] mb-4"
          />
          <div className="relative">
            <input
              type="file"
              id="logo-upload"
              className="hidden"
              accept="image/png,image/jpeg,image/heic"
              onChange={handleLogoUpload}
            />
            <Label htmlFor="logo-upload" className="cursor-pointer">
              <Button className="bg-[#004d40] hover:bg-[#00695c]">
                <Upload className="mr-2 h-4 w-4" /> Загрузить новый логотип
              </Button>
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};