import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { BookingMethodDialog } from "@/components/BookingMethodDialog";
import { PrivacyPolicyCheckbox } from "@/components/PrivacyPolicyCheckbox";

const bookingSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  categoryId: z.string().optional(),
  serviceId: z.string().optional(),
  isConsultation: z.boolean().default(false),
  date: z.date({
    required_error: "Выберите дату",
  }),
  time: z.string().min(1, "Выберите время"),
  privacyConsent: z.boolean().refine(val => val === true, {
    message: "Необходимо согласие на обработку персональных данных"
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00"
];

const BookingPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMethodDialog, setShowMethodDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<BookingFormData | null>(null);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      isConsultation: false,
      time: "",
      privacyConsent: false,
    },
  });

  const watchIsConsultation = form.watch("isConsultation");
  const watchCategoryId = form.watch("categoryId");
  const watchDate = form.watch("date");

  const [busySlots, setBusySlots] = useState<string[]>([]);

  // Check availability when date changes
  const { refetch: checkAvailability } = useQuery({
    queryKey: ['check-availability', watchDate],
    queryFn: async () => {
      if (!watchDate) return { busySlots: [] };
      
      const response = await supabase.functions.invoke('check-availability', {
        body: { date: format(watchDate, 'dd.MM.yyyy') }
      });

      if (response.error) {
        console.error('Error checking availability:', response.error);
        return { busySlots: [] };
      }

      setBusySlots(response.data?.busySlots || []);
      return response.data;
    },
    enabled: !!watchDate
  });

  // Get available time slots (excluding busy ones)
  const availableTimeSlots = timeSlots.filter(time => !busySlots.includes(time));

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['service_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  // Fetch services for selected category
  const { data: services } = useQuery({
    queryKey: ['services', watchCategoryId],
    queryFn: async () => {
      if (!watchCategoryId) return [];
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category_id', watchCategoryId);
      if (error) throw error;
      return data;
    },
    enabled: !!watchCategoryId && !watchIsConsultation
  });

  const submitBooking = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await supabase.functions.invoke('send-booking', {
        body: {
          name: data.name,
          phone: data.phone,
          serviceType: data.isConsultation ? 'Консультация по телефону' : 'Запись на услугу',
          categoryId: data.categoryId,
          serviceId: data.serviceId,
          date: format(data.date, 'dd.MM.yyyy'),
          time: data.time,
        }
      });

      if (response.error) {
        throw new Error('Ошибка при отправке заявки');
      }
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте еще раз.",
        variant: "destructive",
      });
      console.error('Booking error:', error);
    }
  });

  const onSubmit = async (data: BookingFormData) => {
    setPendingFormData(data);
    setShowMethodDialog(true);
  };

  const handleMethodSelection = async (method: 'telegram' | 'website') => {
    setShowMethodDialog(false);
    
    if (method === 'telegram') {
      // Redirect to Telegram bot
      window.open('https://t.me/your_bot_username', '_blank');
      return;
    }

    // Continue with website booking
    if (!pendingFormData) return;
    
    setIsSubmitting(true);
    try {
      await submitBooking.mutateAsync(pendingFormData);
    } finally {
      setIsSubmitting(false);
      setPendingFormData(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-foreground mb-2">Запись на приём</h1>
          <p className="text-muted-foreground">Заполните форму и мы свяжемся с вами</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Введите ваше имя" 
                      className="bg-background border-border"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер телефона</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+7 (999) 999-99-99" 
                      className="bg-background border-border"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isConsultation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Консультация по телефону
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Отметьте, если не знаете какая услуга вам нужна
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {!watchIsConsultation && (
              <>
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Категория услуг</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchCategoryId && (
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Услуга</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue placeholder="Выберите услугу" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services?.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.title} - {service.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Желаемая дата</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-background border-border",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd.MM.yyyy")
                          ) : (
                            <span>Выберите дату</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Желаемое время</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Выберите время" />
                      </SelectTrigger>
                    </FormControl>
                     <SelectContent>
                       {availableTimeSlots.length > 0 ? (
                         availableTimeSlots.map((time) => (
                           <SelectItem key={time} value={time}>
                             {time}
                           </SelectItem>
                         ))
                       ) : (
                         <SelectItem value="" disabled>
                           {watchDate ? "Все время занято" : "Выберите дату"}
                         </SelectItem>
                       )}
                       {busySlots.length > 0 && (
                         <div className="px-2 py-1">
                           <p className="text-xs text-muted-foreground">
                             Занято: {busySlots.join(', ')}
                           </p>
                         </div>
                       )}
                     </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PrivacyPolicyCheckbox control={form.control} />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground font-medium py-6 rounded-full text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Отправка..." : "Записаться"}
            </Button>
          </form>
        </Form>

        <BookingMethodDialog
          open={showMethodDialog}
          onOpenChange={setShowMethodDialog}
          onSelectMethod={handleMethodSelection}
        />
      </div>
    </div>
  );
};

export default BookingPage;