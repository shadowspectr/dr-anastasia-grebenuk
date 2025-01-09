import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GalleryItemForm } from "./GalleryItemForm";

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
              <GalleryItemForm
                key={item.id}
                item={item}
                onDelete={(id) => deleteGalleryMutation.mutate(id)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};