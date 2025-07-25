import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LogoSection } from "@/components/admin/LogoSection";
import { AboutSection } from "@/components/admin/AboutSection";
import { ServicesSection } from "@/components/admin/ServicesSection";
import { GallerySection } from "@/components/admin/gallery/GallerySection";
import { TeamSection } from "@/components/admin/TeamSection";
import { FAQSection } from "@/components/admin/FAQSection";
import { FooterSection } from "@/components/admin/FooterSection";
import { EducationSection } from "@/components/admin/EducationSection";
import { PrivacyPolicySection } from "@/components/admin/PrivacyPolicySection";
import { useEffect } from "react";

const AdminPanel = () => {
  useEffect(() => {
    // Блокируем индексацию админ панели
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow, noarchive, nosnippet';
    document.head.appendChild(robotsMeta);

    return () => {
      document.head.removeChild(robotsMeta);
    };
  }, []);

  return (
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
          <TabsTrigger value="about">О нас</TabsTrigger>
          <TabsTrigger value="services">Услуги</TabsTrigger>
          <TabsTrigger value="gallery">Галерея</TabsTrigger>
          <TabsTrigger value="team">Команда</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="education">Обучение</TabsTrigger>
          <TabsTrigger value="footer">Контакты</TabsTrigger>
          <TabsTrigger value="privacy">Политика</TabsTrigger>
        </TabsList>
        <TabsContent value="logo" className="space-y-4">
          <LogoSection />
        </TabsContent>
        <TabsContent value="about" className="space-y-4">
          <AboutSection />
        </TabsContent>
        <TabsContent value="services" className="space-y-4">
          <ServicesSection />
        </TabsContent>
        <TabsContent value="gallery" className="space-y-4">
          <GallerySection />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <TeamSection />
        </TabsContent>
        <TabsContent value="faq" className="space-y-4">
          <FAQSection />
        </TabsContent>
        <TabsContent value="education" className="space-y-4">
          <EducationSection />
        </TabsContent>
        <TabsContent value="footer" className="space-y-4">
          <FooterSection />
        </TabsContent>
        <TabsContent value="privacy" className="space-y-4">
          <PrivacyPolicySection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;