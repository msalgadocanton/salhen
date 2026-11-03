import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero/Hero";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { ServicesIndex } from "@/components/sections/ServicesIndex";
import { Buildings } from "@/components/sections/Buildings";
import { Business, Homes } from "@/components/sections/Segments";
import { Passport } from "@/components/sections/Passport";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { QuoteSection } from "@/components/sections/QuoteSection";

export const metadata: Metadata = {
  title: { absolute: "SALHEN · Mantención de edificios, empresas y hogares en Las Condes, Vitacura y Providencia" },
  description:
    "Mantención y reparaciones para edificios, condominios, empresas y casas del sector oriente de Santiago: electricidad, techumbres, impermeabilización, pintura, soldadura y más. Un solo contacto, con respaldo documentado.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SALHEN · Mantención con respaldo",
    description: "Un solo contacto. Múltiples soluciones. Mantención y reparaciones en el sector oriente de Santiago.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProposition />
      <ServicesIndex />
      <Buildings />
      <Business />
      <Homes />
      <Passport />
      <Process />
      <Projects />
      <QuoteSection />
    </>
  );
}
