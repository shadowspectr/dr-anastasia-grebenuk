import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface VacationPeriod {
  id: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
}

const VacationSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch vacation periods
  const { data: vacationPeriods, isLoading } = useQuery({
    queryKey: ['vacation-periods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vacation_periods')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data as VacationPeriod[];
    }
  });

  // Add vacation period
  const addVacation = useMutation({
    mutationFn: async () => {
      if (!startDate || !endDate) {
        throw new Error('Выберите даты начала и окончания отпуска');
      }

      const { error } = await supabase
        .from('vacation_periods')
        .insert({
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
          description: description || 'Отпуск'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Отпуск добавлен",
        description: "Период отпуска успешно добавлен",
      });
      setStartDate(undefined);
      setEndDate(undefined);
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ['vacation-periods'] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete vacation period
  const deleteVacation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vacation_periods')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Отпуск удален",
        description: "Период отпуска успешно удален",
      });
      queryClient.invalidateQueries({ queryKey: ['vacation-periods'] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить период отпуска",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addVacation.mutateAsync();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот период отпуска?')) {
      deleteVacation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Добавить период отпуска
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Дата начала</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd.MM.yyyy") : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Дата окончания</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd.MM.yyyy") : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < new Date() || (startDate && date < startDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Описание (необязательно)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание периода отпуска"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || !startDate || !endDate}
              className="w-full"
            >
              {isSubmitting ? "Добавление..." : "Добавить отпуск"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Запланированные отпуски</CardTitle>
        </CardHeader>
        <CardContent>
          {vacationPeriods && vacationPeriods.length > 0 ? (
            <div className="space-y-3">
              {vacationPeriods.map((period) => (
                <div 
                  key={period.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">
                      {format(new Date(period.start_date), "dd.MM.yyyy")} - {format(new Date(period.end_date), "dd.MM.yyyy")}
                    </div>
                    {period.description && (
                      <div className="text-sm text-muted-foreground">
                        {period.description}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(period.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Нет запланированных отпусков
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VacationSection;