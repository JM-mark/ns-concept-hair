import Hero from "@/components/Hero";
import WhyNS from "@/components/WhyNS";
import ServicesGrid from "@/components/ServicesGrid";
import MegaHairFeature from "@/components/MegaHairFeature";
import ReviewsHome from "@/components/ReviewsHome";
import BookHome from "@/components/BookHome";
import FaqSection from "@/components/FaqSection";

/** Hierarquia: marca → serviços → Mega Hair → prova social → agendar. 6 fotos na Home (5 da grade + 1 do Mega Hair). */
export default function Home() {
  return (
    <>
      <Hero />
      <WhyNS />
      <ServicesGrid />
      <MegaHairFeature />
      <ReviewsHome />
      <BookHome />
      <FaqSection />
    </>
  );
}
