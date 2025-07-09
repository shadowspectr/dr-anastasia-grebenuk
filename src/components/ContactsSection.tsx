import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ContactsSection = () => {
  const { data: footerData } = useQuery({
    queryKey: ['footer'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    }
  });

  return (
    <section className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-light text-center mb-8 text-foreground">КОНТАКТЫ</h2>
        
        <div className="space-y-6">
          <div className="bg-muted/50 rounded-2xl px-4 py-3">
            <p className="text-sm text-foreground">
              <span className="font-medium">Адрес клиники:</span> г. Ростов-на-Дону, Буденновский проспект, 8
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium text-foreground mb-2">+7 (989) 541-12-88</p>
            
            <div className="bg-muted/50 rounded-2xl px-4 py-3 mb-6">
              <p className="text-sm text-foreground">
                <span className="font-medium">Часы работы:</span> ежедневно с 10:00 до 19:00
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            {footerData?.instagram && (
              <a
                href={footerData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full py-3 px-6 text-center hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-primary/20"
              >
                <span className="text-foreground font-medium">INSTAGRAM</span>
              </a>
            )}
            
            {footerData?.whatsapp && (
              <a
                href={`https://wa.me/${footerData.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full py-3 px-6 text-center hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-primary/20"
              >
                <span className="text-foreground font-medium">WHATSAPP</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { ContactsSection };