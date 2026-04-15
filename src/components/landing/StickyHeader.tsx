import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Обо мне", href: "#about" },
  { label: "Курсы", href: "#courses" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Портфолио", href: "#works" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

export const StickyHeader = () => {
  const [open, setOpen] = useState(false);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="text-lg font-semibold text-foreground tracking-wide">
          Dr. Anastasia Grebenuk
        </span>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </button>
          ))}
          <Button size="sm" onClick={() => scrollTo("#application")}>
            Записаться
          </Button>
        </nav>

        {/* Mobile burger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-border bg-card px-4 pb-4 space-y-2">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-primary"
            >
              {l.label}
            </button>
          ))}
          <Button className="w-full" size="sm" onClick={() => scrollTo("#application")}>
            Записаться
          </Button>
        </nav>
      )}
    </header>
  );
};
