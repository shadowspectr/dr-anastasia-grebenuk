import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  price: string;
  category_id: string;
}

interface Category {
  id: string;
  title: string;
  services?: Service[];
}

const Index = () => {
  // Fetch categories with their services
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories-with-services'],
    queryFn: async () => {
      // First, fetch all categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Then fetch all services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (servicesError) throw servicesError;

      // Map services to their categories
      const categoriesWithServices = categoriesData.map((category: Category) => ({
        ...category,
        services: servicesData.filter((service: Service) => service.category_id === category.id)
      }));

      return categoriesWithServices;
    }
  });

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <header className="py-4">
        <h1 className="text-3xl font-bold text-center">Добро пожаловать</h1>
      </header>

      {/* Services Section */}
      <section className="max-w-2xl mx-auto mb-16 bg-white/5 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-8 text-center">Наши услуги</h2>
        {isLoading ? (
          <div className="text-center py-4">Загрузка услуг...</div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="mb-8 last:mb-0">
              <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white">Услуга</TableHead>
                    <TableHead className="text-right text-white">Цена</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.services?.map((service) => (
                    <TableRow key={service.id} className="border-white/10">
                      <TableCell className="text-white">{service.title}</TableCell>
                      <TableCell className="text-right text-white">{service.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))
        )}
      </section>

      <footer className="py-4">
        <p className="text-center">© 2023 Ваш Сайт</p>
      </footer>
    </div>
  );
};

export default Index;