import { StickyHeader } from "@/components/landing/StickyHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { AboutMeSection } from "@/components/landing/AboutMeSection";
import { CoursesSection } from "@/components/landing/CoursesSection";
import { TrainingProcessSection } from "@/components/landing/TrainingProcessSection";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { StudentWorksSection } from "@/components/landing/StudentWorksSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ApplicationForm } from "@/components/landing/ApplicationForm";
import { Footer } from "@/components/landing/Footer";
import { FloatingMessenger } from "@/components/landing/FloatingMessenger";
import { SEOHead } from "@/components/SEOHead";

const Index = () => {
  return (
    <>
      <SEOHead
        title="Dr. Anastasia Grebenuk — Обучение косметологии"
        description="Курсы косметологии от врача с многолетним опытом. Контурная пластика, биоревитализация, мезотерапия. Онлайн и очно."
        keywords="обучение косметологии, курсы косметолога, контурная пластика обучение, биоревитализация курс"
        url="https://dr-anastasia-grebenuk.lovable.app/"
      />
      <div className="min-h-screen bg-background">
        <StickyHeader />
        <HeroSection />
        <SocialProofSection />
        <AboutMeSection />
        <CoursesSection />
        <TrainingProcessSection />
        <ReviewsSection />
        <StudentWorksSection />
        <FAQSection />
        <ApplicationForm />
        <Footer />
        <FloatingMessenger />
      </div>
    </>
  );
};

export default Index;
