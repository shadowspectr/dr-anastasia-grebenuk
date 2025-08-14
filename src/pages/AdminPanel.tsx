import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import { AboutSection } from "@/components/admin/AboutSection";
import { ServicesSection } from "@/components/admin/ServicesSection";
import { GallerySection } from "@/components/admin/gallery/GallerySection";
import { TeamSection } from "@/components/admin/TeamSection";
import { FAQSection } from "@/components/admin/FAQSection";
import { FooterSection } from "@/components/admin/FooterSection";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const AdminPanel = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("about");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const tabs = [
    { value: "about", label: "О нас" },
    { value: "services", label: "Услуги" },
    { value: "gallery", label: "Галерея" },
    { value: "team", label: "Команда" },
    { value: "footer", label: "Социальные сети" },
    { value: "faq", label: "FAQ" },
  ];

  const TabNavigation = ({ className = "" }: { className?: string }) => (
    <div className={`space-y-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => {
            setActiveTab(tab.value);
            setMobileMenuOpen(false);
          }}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
            activeTab === tab.value
              ? "bg-white/20 text-white"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212] border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center text-white/60 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Вернуться на сайт</span>
            <span className="sm:hidden">Назад</span>
          </Link>
          
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#121212] border-white/10">
                <div className="pt-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Админ панель</h2>
                  <TabNavigation />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-64 bg-white/5 min-h-[calc(100vh-73px)] p-4 border-r border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Админ панель</h2>
            <TabNavigation />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            {/* Desktop TabsList - Hidden on mobile */}
            {!isMobile && (
              <TabsList className="bg-white/5 grid grid-cols-6 gap-1 w-full">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="text-xs px-2 py-2"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
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
            <TabsContent value="footer" className="space-y-4">
              <FooterSection />
            </TabsContent>
            <TabsContent value="faq" className="space-y-4">
              <FAQSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;