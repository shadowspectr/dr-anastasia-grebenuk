import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

export const GallerySection = () => {
  const { toast } = useToast();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: 1,
      title: "Увеличение губ",
      description: "Контурная пластика губ препаратом на основе гиалуроновой кислоты",
      beforeImage: "/lovable-uploads/046f160c-fafc-4903-917b-f923013238c4.png",
      afterImage: "/lovable-uploads/046f160c-fafc-4903-917b-f923013238c4.png",
    },
    {
      id: 2,
      title: "Биоревитализация",
      description: "Процедура глубокого увлажнения кожи с помощью инъекций гиалуроновой кислоты",
      beforeImage: "/lovable-uploads/046f160c-fafc-4903-917b-f923013238c4.png",
      afterImage: "/lovable-uploads/046f160c-fafc-4903-917b-f923013238c4.png",
    },
  ]);

  const handleGalleryAdd = () => {
    const newItem: GalleryItem = {
      id: galleryItems.length + 1,
      title: "",
      description: "",
      beforeImage: "",
      afterImage: "",
    };
    setGalleryItems([...galleryItems, newItem]);
  };

  const handleGalleryDelete = (id: number) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
    toast({
      title: "Элемент галереи удален",
      description: "Элемент был успешно удален из галереи",
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId: number, type: 'before' | 'after') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Here you would typically make an API call to upload the file
      console.log(`Uploading ${type} image for item ${itemId}:`, file);
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
    }
  };

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Управление галереей</h2>
            <Button onClick={handleGalleryAdd} className="bg-[#004d40] hover:bg-[#00695c]">
              <Plus className="mr-2 h-4 w-4" /> Добавить работу
            </Button>
          </div>
          <div className="grid gap-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="p-4 bg-white/10 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Фото "До"</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        id={`before-${item.id}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, item.id, 'before')}
                      />
                      <Label htmlFor={`before-${item.id}`} className="cursor-pointer">
                        <Button className="bg-[#004d40] hover:bg-[#00695c]">
                          <Upload className="mr-2 h-4 w-4" /> Загрузить фото
                        </Button>
                      </Label>
                    </div>
                  </div>
                  <div>
                    <Label>Фото "После"</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        id={`after-${item.id}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, item.id, 'after')}
                      />
                      <Label htmlFor={`after-${item.id}`} className="cursor-pointer">
                        <Button className="bg-[#004d40] hover:bg-[#00695c]">
                          <Upload className="mr-2 h-4 w-4" /> Загрузить фото
                        </Button>
                      </Label>
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleGalleryDelete(item.id)}
                  className="w-full"
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