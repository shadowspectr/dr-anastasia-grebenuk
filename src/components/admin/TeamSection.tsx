import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  photo_url: string;
  sort_order: number;
}

export const TeamSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingMemberId, setUploadingMemberId] = useState<string | null>(null);

  // Fetch team members
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as TeamMember[];
    }
  });

  // Add team member mutation
  const addTeamMemberMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          name: '',
          position: '',
          description: '',
          photo_url: '',
          sort_order: teamMembers.length
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      toast({
        title: "Участник добавлен",
        description: "Новый участник команды добавлен",
      });
    }
  });

  // Update team member mutation
  const updateTeamMemberMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: keyof TeamMember; value: string | number }) => {
      const { error } = await supabase
        .from('team_members')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    }
  });

  // Delete team member mutation
  const deleteTeamMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      toast({
        title: "Участник удален",
        description: "Участник команды успешно удален",
      });
    }
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>, memberId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMemberId(memberId);

      const fileExt = file.name.split('.').pop();
      const fileName = `team-${memberId}-${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      updateTeamMemberMutation.mutate({
        id: memberId,
        field: 'photo_url',
        value: publicUrl
      });
      
      toast({
        title: "Фото загружено",
        description: "Фото участника команды обновлено",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить фото",
        variant: "destructive",
      });
    } finally {
      setUploadingMemberId(null);
    }
  };

  if (isLoading) {
    return <div className="text-white">Загрузка...</div>;
  }

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Управление командой специалистов</h2>
            <Button onClick={() => addTeamMemberMutation.mutate()} className="bg-[#004d40] hover:bg-[#00695c]">
              <Plus className="mr-2 h-4 w-4" /> Добавить участника
            </Button>
          </div>

          <div className="space-y-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white/10 p-6 rounded-lg space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black flex-shrink-0 relative">
                    {member.photo_url ? (
                      <img 
                        src={member.photo_url} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center">
                        <span className="text-white/60 text-xs">Фото</span>
                      </div>
                    )}
                    <input
                      type="file"
                      id={`photo-${member.id}`}
                      onChange={(e) => handlePhotoUpload(e, member.id)}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploadingMemberId === member.id}
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Имя</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => updateTeamMemberMutation.mutate({
                            id: member.id,
                            field: 'name',
                            value: e.target.value
                          })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Должность</Label>
                        <Input
                          value={member.position}
                          onChange={(e) => updateTeamMemberMutation.mutate({
                            id: member.id,
                            field: 'position',
                            value: e.target.value
                          })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-white">Описание</Label>
                      <Textarea
                        value={member.description}
                        onChange={(e) => updateTeamMemberMutation.mutate({
                          id: member.id,
                          field: 'description',
                          value: e.target.value
                        })}
                        className="bg-white/10 border-white/20 text-white min-h-[80px]"
                      />
                    </div>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteTeamMemberMutation.mutate(member.id)}
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