import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";

interface PrivacyPolicyCheckboxProps {
  control: Control<any>;
}

export const PrivacyPolicyCheckbox = ({ control }: PrivacyPolicyCheckboxProps) => {
  const { data: privacyPolicy } = useQuery({
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

  return (
    <FormField
      control={control}
      name="agreeToPrivacy"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              Я согласен(а) с обработкой персональных данных в соответствии с{" "}
              {privacyPolicy?.document_url ? (
                <a 
                  href={privacyPolicy.document_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  политикой конфиденциальности
                </a>
              ) : (
                <span className="text-primary">политикой конфиденциальности</span>
              )}
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};