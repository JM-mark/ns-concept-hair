import Hero from "@/components/Hero";
import WhyNS from "@/components/WhyNS";
import Journey from "@/components/Journey";
import ReviewsMap from "@/components/ReviewsMap";
import ServicesGrid from "@/components/ServicesGrid";
import Team from "@/components/Team";
import BookHome from "@/components/BookHome";
import FaqSection from "@/components/FaqSection";

/** Ritmo: hero escuro → areia (por que a NS) → areia (jornada) → areia (avaliações) → escuro (serviços) → areia (equipe) → agendamento → areia (FAQ) → footer escuro. */
export default function Home() {
  return (
    <>
      <Hero />
      <WhyNS />
      <Journey />
      <ReviewsMap />
      <ServicesGrid />
      <Team />
      <BookHome />
      <FaqSection />
    </>
  );
}
