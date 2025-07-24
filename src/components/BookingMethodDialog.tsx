import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Globe } from "lucide-react";

interface BookingMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMethod: (method: 'telegram' | 'website') => void;
}

export const BookingMethodDialog = ({ open, onOpenChange, onSelectMethod }: BookingMethodDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Выберите способ записи</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Button
            onClick={() => onSelectMethod('telegram')}
            variant="outline"
            className="w-full h-16 flex-col gap-2 border-primary/20 hover:border-primary hover:bg-primary/5"
          >
            <Phone className="h-6 w-6 text-primary" />
            <span>Записаться в Telegram</span>
          </Button>
          
          <Button
            onClick={() => onSelectMethod('website')}
            variant="outline"
            className="w-full h-16 flex-col gap-2 border-primary/20 hover:border-primary hover:bg-primary/5"
          >
            <Globe className="h-6 w-6 text-primary" />
            <span>Записаться на сайте</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};