import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ResultsGallery from "@/components/ResultsGallery";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Resultados",
  description: "Trabalhos reais do NS Concept Hair: Mega Hair, coloração, corte e tratamentos.",
  alternates: { canonical: "resultados/" },
};

export default function ResultadosPage() {
  return (
    <>
      <PageHero
        label="Resultados"
        lines={["Trabalhos", <em key="e" className="italic-champagne">reais.</em>]}
        intro="Resultados publicados pelo próprio salão, com cabelo de verdade e luz de verdade."
      />
      <ResultsGallery />
      <CtaBand />
    </>
  );
}
