import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
const ContactsSection = () => {
  const {
    data: footerData
  } = useQuery({
    queryKey: ['footer'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('footer_links').select('*').maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  return <section className="px-4 py-[60px]">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-light text-center mb-8 text-foreground">КОНТАКТЫ</h2>
        
        <div className="space-y-6">
          <div className="bg-muted/50 rounded-2xl px-4 py-3">
            <p className="text-sm text-foreground">
              <span className="font-medium">Адрес клиники:</span>{" "}
              <a 
                href="https://yandex.ru/maps/142/donetsk/house/prospekt_ilyicha_109/Z04YfgFhQUcDQFpifXxxc35nbA==/?ll=37.864529%2C48.002870&z=17"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                г. Донецк, пр. Ильича 109А
              </a>
            </p>
          </div>
          
          <div className="text-center">
            <a 
              href="tel:+79493420216"
              className="text-lg font-medium text-primary hover:text-primary/80 transition-colors mb-2 inline-block"
            >
              +7 949 342 0216
            </a>
            
            <div className="bg-muted/50 rounded-2xl px-4 py-3 mb-6">
              <p className="text-sm text-foreground">
                <span className="font-medium">Часы работы:</span> ежедневно с 10:00 до 19:00
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {footerData?.instagram && <a href={footerData.instagram} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-full py-3 px-4 text-center hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-primary/20">
                <span className="text-foreground font-medium text-sm">INSTAGRAM</span>
              </a>}
            
            {footerData?.whatsapp && <a href={`https://wa.me/${footerData.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-full py-3 px-4 text-center hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-primary/20">
                <span className="text-foreground font-medium text-sm">WHATSAPP</span>
              </a>}

            {footerData?.telegram && <a href={footerData.telegram} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-full py-3 px-4 text-center hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-primary/20">
                <span className="text-foreground font-medium text-sm">TELEGRAM</span>
              </a>}
            
            {footerData?.vkontakte && <a href={footerData.vkontakte} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-full py-3 px-4 text-center hover:from-primary/30 hover:to-accent/30 transition-all duration-300 border border-primary/20">
                <span className="text-foreground font-medium text-sm">ВКОНТАКТЕ</span>
              </a>}
          </div>
        </div>
      </div>
    </section>;
};
export { ContactsSection };