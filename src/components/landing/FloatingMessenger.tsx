import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const FloatingMessenger = () => {
  const { data: contacts = [] } = useQuery({
    queryKey: ["contact_info"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_info").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const telegram = contacts.find((c) => c.key === "telegram")?.value;
  if (!telegram) return null;

  return (
    <a
      href={telegram}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Написать в Telegram"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};
