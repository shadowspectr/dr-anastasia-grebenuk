import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const EducationSection = () => {
  // Fetch education data
  const { data: educationData } = useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const { data: education, error: educationError } = await supabase
        .from('education')
        .select('*')
        .single();

      if (educationError) throw educationError;

      const { data: photos, error: photosError } = await supabase
        .from('education_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (photosError) throw photosError;

      return {
        education,
        photos: photos || []
      };
    }
  });

  if (!educationData?.education) return null;

  return (
    <section className="max-w-4xl mx-auto mb-16">
      <h2 className="text-2xl font-semibold text-center mb-8">{educationData.education.title}</h2>
      
      {educationData.photos && educationData.photos.length > 0 && (
        <div className="relative mb-8">
          <Carousel className="w-full">
            <CarouselContent>
              {educationData.photos.map((photo) => (
                <CarouselItem key={photo.id}>
                  <div className="p-1">
                    <img
                      src={photo.photo_url}
                      alt="Education"
                      className="w-full h-64 md:h-96 object-cover rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-[#00332b] hover:bg-[#004d40] border-none text-white" />
            <CarouselNext className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-[#00332b] hover:bg-[#004d40] border-none text-white" />
          </Carousel>
          <div className="text-center mt-4 text-white/60">
            <p className="md:hidden mb-2">Проведите пальцем для просмотра всех фото</p>
            <p className="hidden md:block mb-2">Используйте стрелки для просмотра всех фото</p>
          </div>
        </div>
      )}

      {educationData.education.description && (
        <div className="text-white/80 text-center px-4">
          {educationData.education.description}
        </div>
      )}
    </section>
  );
};