import Hero from "@/components/Hero";
import { Marquee } from "@/components/motion";
import Manifesto from "@/components/Manifesto";
import ServicesShowcase from "@/components/ServicesShowcase";
import MegaHairFeature from "@/components/MegaHairFeature";
import ResultsSection from "@/components/ResultsSection";
import ReviewsMap from "@/components/ReviewsMap";
import CtaBand from "@/components/CtaBand";
import { SERVICES } from "@/content/services";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={SERVICES.map((s) => s.nome)} />
      <Manifesto />
      <ServicesShowcase />
      <MegaHairFeature />
      <ResultsSection />
      <ReviewsMap />
      <CtaBand />
    </>
  );
}
