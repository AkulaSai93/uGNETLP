import { Hero } from "@/components/lp/Hero";
import { DataStrip } from "@/components/lp/DataStrip";
import { Legacy } from "@/components/sections/Legacy";
import { Pathways } from "@/components/sections/Pathways";
import { Curriculum } from "@/components/sections/Curriculum";
import { Campuses } from "@/components/sections/Campuses";
import { Admission } from "@/components/sections/Admission";
import { Scholarships } from "@/components/sections/Scholarships";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faqs } from "@/components/sections/Faqs";
import { Footer } from "@/components/site/Footer";

export default function Page() {
  return (
    <>
      {/* the page sits above the footer and slides up off it */}
      <DataStrip />
      <main className="relative z-10 flex-1 bg-canvas">
        <Hero />
        <Legacy />
        <Pathways />
        <Curriculum />
        <Campuses />
        <Admission />
        <Scholarships />
        <Testimonials />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
