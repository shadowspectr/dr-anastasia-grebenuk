import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LogoSection } from "@/components/admin/logo/LogoSection";
import { MainPhotoSection } from "@/components/admin/main-photo/MainPhotoSection";
import { ServicesSection } from "@/components/admin/services/ServicesSection";
import { GallerySection } from "@/components/admin/gallery/GallerySection";
import { FooterSection } from "@/components/admin/footer/FooterSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AdminPanel = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-[#001a1a] to-[#004d40] text-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <Link 
              to="/" 
              className="text-white hover:text-[#00695c] transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-6 w-6" />
              <span className="text-sm">Вернуться на сайт</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-semibold">Панель администратора</h1>
          </div>

          <Tabs defaultValue="logo" className="space-y-6">
            <TabsList className="bg-white/10 w-full justify-start overflow-x-auto">
              <TabsTrigger value="logo" className="text-white data-[state=active]:bg-[#004d40]">
                Логотип
              </TabsTrigger>
              <TabsTrigger value="main-photo" className="text-white data-[state=active]:bg-[#004d40]">
                Главное фото
              </TabsTrigger>
              <TabsTrigger value="services" className="text-white data-[state=active]:bg-[#004d40]">
                Услуги
              </TabsTrigger>
              <TabsTrigger value="gallery" className="text-white data-[state=active]:bg-[#004d40]">
                Галерея
              </TabsTrigger>
              <TabsTrigger value="footer" className="text-white data-[state=active]:bg-[#004d40]">
                Футер
              </TabsTrigger>
            </TabsList>

            <TabsContent value="logo">
              <LogoSection />
            </TabsContent>

            <TabsContent value="main-photo">
              <MainPhotoSection />
            </TabsContent>

            <TabsContent value="services">
              <ServicesSection />
            </TabsContent>

            <TabsContent value="gallery">
              <GallerySection />
            </TabsContent>

            <TabsContent value="footer">
              <FooterSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default AdminPanel;