import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export const FooterSection = () => {
  const { toast } = useToast();
  const [footerData, setFooterData] = useState({
    instagram: "",
    whatsapp: "",
    telegram: "",
  });

  const handleFooterSave = () => {
    localStorage.setItem('adminFooterData', JSON.stringify(footerData));
    toast({
      title: "Сохранено",
      description: "Данные футера успешно обновлены",
    });
  };

  // Load saved footer data on component mount
  useEffect(() => {
    const savedFooterData = localStorage.getItem('adminFooterData');
    if (savedFooterData) {
      setFooterData(JSON.parse(savedFooterData));
    }
  }, []);

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Редактирование футера</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={footerData.instagram}
                onChange={(e) => setFooterData({ ...footerData, instagram: e.target.value })}
                placeholder="Ссылка на Instagram"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={footerData.whatsapp}
                onChange={(e) => setFooterData({ ...footerData, whatsapp: e.target.value })}
                placeholder="Номер WhatsApp"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="telegram">Telegram</Label>
              <Input
                id="telegram"
                value={footerData.telegram}
                onChange={(e) => setFooterData({ ...footerData, telegram: e.target.value })}
                placeholder="Ссылка на Telegram"
                className="bg-white/10 border-white/20"
              />
            </div>
            <Button onClick={handleFooterSave} className="bg-[#004d40] hover:bg-[#00695c]">
              <Save className="mr-2 h-4 w-4" /> Сохранить изменения
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};