import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, ExternalLink } from "lucide-react";

export const PrivacyPolicySection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: privacyPolicy, isLoading } = useQuery({
    queryKey: ['privacy-policy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('privacy_policy')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const updatePrivacyPolicy = useMutation({
    mutationFn: async ({ documentUrl }: { documentUrl: string }) => {
      const { error } = await supabase
        .from('privacy_policy')
        .update({ document_url: documentUrl })
        .eq('id', privacyPolicy?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy-policy'] });
      toast({
        title: "Успешно",
        description: "Политика конфиденциальности обновлена",
      });
      setFile(null);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить политику конфиденциальности",
        variant: "destructive",
      });
      console.error('Error updating privacy policy:', error);
    }
  });

  const handleFileUpload = async () => {
    if (!file || !privacyPolicy) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `privacy-policy.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(`documents/${fileName}`, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('gallery')
        .getPublicUrl(`documents/${fileName}`);

      await updatePrivacyPolicy.mutateAsync({ documentUrl: data.publicUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить файл",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Политика конфиденциальности
          </CardTitle>
          <CardDescription>
            Управление документом политики конфиденциальности для страницы записи
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {privacyPolicy?.document_url && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Текущий документ:
              </p>
              <a
                href={privacyPolicy.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Просмотреть политику конфиденциальности
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="privacy-policy-file">
              Загрузить новый документ
            </Label>
            <Input
              id="privacy-policy-file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Поддерживаемые форматы: PDF, DOC, DOCX
            </p>
          </div>

          <Button
            onClick={handleFileUpload}
            disabled={!file || uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Загрузка..." : "Загрузить документ"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};