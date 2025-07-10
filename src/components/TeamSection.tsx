import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TeamSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fetch team members from database
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const nextMember = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevMember = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  return (
    <section className="py-16 px-4 animate-fade-in">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-light text-center mb-8 text-foreground transition-all duration-300 hover:scale-105">
          КОМАНДА<br/>СПЕЦИАЛИСТОВ
        </h2>
        
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-6 relative hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id}
              className={`transition-opacity duration-300 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0 absolute top-6 left-6 right-6'
              }`}
            >
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black flex-shrink-0 relative">
                  <img 
                    src={member.photo_url} 
                    alt={member.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
                    style={{ aspectRatio: '1/1' }}
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {member.position}
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
          
          {teamMembers.length > 1 && (
            <button 
              onClick={nextMember}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>
        
        {teamMembers.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export { TeamSection };