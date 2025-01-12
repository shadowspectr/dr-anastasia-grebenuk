import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Service {
  id: string;
  title: string;
  price: string;
  category_id: string | null;
  images: string[];
}

interface Category {
  id: string;
  title: string;
}

export const ServicesSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Category[];
    }
  });

  // Fetch services
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Service[];
    }
  });

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .insert({ title: '' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Категория добавлена",
        description: "Новая категория успешно добавлена",
      });
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Категория удалена",
        description: "Категория успешно удалена",
      });
    }
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { error } = await supabase
        .from('service_categories')
        .update({ title })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  // Service mutations
  const addServiceMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { data, error } = await supabase
        .from('services')
        .insert({
          title: '',
          price: '',
          category_id: categoryId,
          description: '',
          icon: '',
          images: []
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Услуга добавлена",
        description: "Новая услуга успешно добавлена",
      });
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Услуга удалена",
        description: "Услуга успешно удалена",
      });
    }
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: keyof Service; value: string | string[] }) => {
      const { error } = await supabase
        .from('services')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  });

  // Handle image upload
  const handleImageUpload = async (serviceId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const service = services.find(s => s.id === serviceId);
      if (service) {
        const updatedImages = [...(service.images || []), publicUrl];
        updateServiceMutation.mutate({
          id: serviceId,
          field: 'images',
          value: updatedImages
        });
      }

      toast({
        title: "Изображение загружено",
        description: "Изображение успешно добавлено к услуге",
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
        <div className="space-y-8">
          {/* Categories Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Управление категориями</h2>
              <Button onClick={() => addCategoryMutation.mutate()} className="bg-[#004d40] hover:bg-[#00695c]">
                <Plus className="mr-2 h-4 w-4" /> Добавить категорию
              </Button>
            </div>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <div className="flex gap-4 items-start bg-white/10 p-4 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-white">Название категории</Label>
                      <Input
                        value={category.title}
                        onChange={(e) => updateCategoryMutation.mutate({ 
                          id: category.id, 
                          title: e.target.value 
                        })}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteCategoryMutation.mutate(category.id)}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Services for this category */}
                  <div className="pl-4 space-y-4">
                    {services
                      .filter(service => service.category_id === category.id)
                      .map(service => (
                        <div key={service.id} className="flex gap-4 items-start bg-white/5 p-4 rounded-lg">
                          <div className="flex-1">
                            <Label className="text-white">Название услуги</Label>
                            <Input
                              value={service.title}
                              onChange={(e) => updateServiceMutation.mutate({
                                id: service.id,
                                field: 'title',
                                value: e.target.value
                              })}
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div className="w-32">
                            <Label className="text-white">Цена</Label>
                            <Input
                              value={service.price}
                              onChange={(e) => updateServiceMutation.mutate({
                                id: service.id,
                                field: 'price',
                                value: e.target.value
                              })}
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div className="w-40">
                            <Label className="text-white">Изображения</Label>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(service.id, file);
                                }
                              }}
                              className="bg-white/10 border-white/20 text-white"
                            />
                            {service.images && service.images.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {service.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Service ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteServiceMutation.mutate(service.id)}
                            className="mt-6"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    <Button 
                      onClick={() => addServiceMutation.mutate(category.id)}
                      variant="outline"
                      className="ml-4"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Добавить услугу
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};