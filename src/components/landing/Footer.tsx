import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const { data: contacts = [] } = useQuery({
    queryKey: ["contact_info"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_info").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const getContact = (key: string) => contacts.find((c) => c.key === key)?.value;

  return (
    <footer id="contacts" className="bg-foreground text-card py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">Dr. Anastasia Grebenuk</h3>
            <p className="text-sm opacity-70 mt-1">Обучение косметологии</p>
          </div>

          <div className="flex gap-4 text-sm">
            {getContact("telegram") && (
              <a href={getContact("telegram")} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                Telegram
              </a>
            )}
            {getContact("whatsapp") && (
              <a href={getContact("whatsapp")} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                WhatsApp
              </a>
            )}
            {getContact("instagram") && (
              <a href={getContact("instagram")} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                Instagram
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-card/20 pt-4 text-center text-xs opacity-50">
          © {new Date().getFullYear()} Dr. Anastasia Grebenuk. Все права защищены.
        </div>
      </div>
    </footer>
  );
};
