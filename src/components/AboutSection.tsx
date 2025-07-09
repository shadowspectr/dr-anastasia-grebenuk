const AboutSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-light text-center mb-8 text-foreground">О НАС</h2>
        
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
          <div className="text-foreground space-y-4">
            <p className="text-sm leading-relaxed">
              <strong>RESIDENCE by Alya Kim</strong> – это не просто клиника в центре города, 
              это резиденция красивых людей и эстетического удовольствия.
            </p>
            
            <p className="text-sm leading-relaxed">
              Здесь работают самые востребованные специалисты высшей категории, 
              а каждая деталь интерьера создана с любовью, сочетая стиль и сильную энергетику.
            </p>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-6 text-center text-foreground">
              ПРЕИМУЩЕСТВА<br/>КЛИНИКИ
            </h3>
            
            <div className="space-y-3">
              {[
                "высококвалифицированные специалисты с медицинским образованием",
                "большой спектр различных услуг",
                "удобное расположение в самом центре Ростова-на-Дону",
                "высокий уровень сервиса",
                "безупречная репутация",
                "полное доверие более 10.000 пациентов"
              ].map((advantage, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{advantage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { AboutSection };