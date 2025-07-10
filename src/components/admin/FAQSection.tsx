import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export const FAQSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch FAQ items
  const { data: faqItems = [], isLoading } = useQuery({
    queryKey: ['faq'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as FAQItem[];
    }
  });

  // Add FAQ item mutation
  const addFAQMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('faq')
        .insert({
          question: '',
          answer: '',
          sort_order: faqItems.length
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
      toast({
        title: "Вопрос добавлен",
        description: "Новый вопрос добавлен в FAQ",
      });
    }
  });

  // Update FAQ item mutation
  const updateFAQMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: keyof FAQItem; value: string | number }) => {
      const { error } = await supabase
        .from('faq')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
    }
  });

  // Delete FAQ item mutation
  const deleteFAQMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('faq')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
      toast({
        title: "Вопрос удален",
        description: "Вопрос успешно удален из FAQ",
      });
    }
  });

  if (isLoading) {
    return <div className="text-white">Загрузка...</div>;
  }

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Управление FAQ</h2>
            <Button onClick={() => addFAQMutation.mutate()} className="bg-[#004d40] hover:bg-[#00695c]">
              <Plus className="mr-2 h-4 w-4" /> Добавить вопрос
            </Button>
          </div>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.id} className="bg-white/10 p-6 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div>
                      <Label className="text-white">Вопрос</Label>
                      <Input
                        value={item.question}
                        onChange={(e) => updateFAQMutation.mutate({
                          id: item.id,
                          field: 'question',
                          value: e.target.value
                        })}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white">Ответ</Label>
                      <Textarea
                        value={item.answer}
                        onChange={(e) => updateFAQMutation.mutate({
                          id: item.id,
                          field: 'answer',
                          value: e.target.value
                        })}
                        className="bg-white/10 border-white/20 text-white min-h-[100px]"
                      />
                    </div>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteFAQMutation.mutate(item.id)}
                    className="ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};