import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LogoSection } from "@/components/admin/LogoSection";
import { MainPhotoSection } from "@/components/admin/MainPhotoSection";
import { ServicesSection } from "@/components/admin/ServicesSection";
import { GallerySection } from "@/components/admin/gallery/GallerySection";
import { FooterSection } from "@/components/admin/FooterSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const AdminPanel = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
        <Link
          to="/"
          className="inline-flex items-center text-white/60 hover:text-white mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться на сайт
        </Link>
        <Tabs defaultValue="logo" className="space-y-4">
          <TabsList className="bg-white/5">
            <TabsTrigger value="logo">Логотип</TabsTrigger>
            <TabsTrigger value="main-photo">Главное фото</TabsTrigger>
            <TabsTrigger value="services">Услуги</TabsTrigger>
            <TabsTrigger value="gallery">Галерея</TabsTrigger>
            <TabsTrigger value="footer">Подвал</TabsTrigger>
          </TabsList>
          <TabsContent value="logo" className="space-y-4">
            <LogoSection />
          </TabsContent>
          <TabsContent value="main-photo" className="space-y-4">
            <MainPhotoSection />
          </TabsContent>
          <TabsContent value="services" className="space-y-4">
            <ServicesSection />
          </TabsContent>
          <TabsContent value="gallery" className="space-y-4">
            <GallerySection />
          </TabsContent>
          <TabsContent value="footer" className="space-y-4">
            <FooterSection />
          </TabsContent>
        </Tabs>
      </div>
    </QueryClientProvider>
  );
};

export default AdminPanel;