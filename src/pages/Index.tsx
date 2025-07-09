import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AboutSection } from "@/components/AboutSection";
import { TeamSection } from "@/components/TeamSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WorksSection } from "@/components/WorksSection";
import { FAQSection } from "@/components/FAQSection";
import { ContactsSection } from "@/components/ContactsSection";




const Index = () => {
  const [mainPhoto, setMainPhoto] = useState("/lovable-uploads/731c0a35-be6b-42db-8dfe-5c8ee32e6d65.png");

  // Load main photo from localStorage
  useEffect(() => {
    const savedPhoto = localStorage.getItem('adminMainPhoto');
    if (savedPhoto) {
      setMainPhoto(savedPhoto);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-8 px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-foreground mb-2 tracking-wide">
              RESIDENCE
            </h1>
            <p className="text-lg font-light text-muted-foreground italic">
              by Alya Kim
            </p>
          </div>
          
          {/* Team Photo */}
          <div className="mb-8">
            <img
              src={mainPhoto}
              alt="Команда специалистов"
              className="w-full max-w-md mx-auto rounded-3xl shadow-lg"
            />
          </div>
          
          {/* CTA Button */}
          <Button 
            className="w-full max-w-sm bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground font-medium py-6 rounded-full text-lg shadow-lg border-0"
            asChild
          >
            <a 
              href="https://t.me/dr_anastasia_grebenuk"
              target="_blank"
              rel="noopener noreferrer"
            >
              ЗАПИСАТЬСЯ
            </a>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Team Section */}
      <TeamSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Works Section */}
      <WorksSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Contacts Section */}
      <ContactsSection />
    </div>
  );
};

export default Index;
