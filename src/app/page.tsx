import Hero from "@/components/marketing/Hero";
import TrustBadges from "@/components/marketing/TrustBadges";
import AnimatedCounters from "@/components/marketing/AnimatedCounters";
import ServicesSection from "@/components/marketing/ServicesSection";
import VaultTiersSection from "@/components/marketing/VaultTiersSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import GalleryStrip from "@/components/marketing/GalleryStrip";
import ContactSection from "@/components/marketing/ContactSection";
import FinalCTA from "@/components/marketing/FinalCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <main>
        <section className="relative">
          <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
            <TrustBadges />
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_20%_0%,rgba(212,175,55,0.18)_0%,rgba(10,10,10,0)_60%),radial-gradient(60%_60%_at_80%_20%,rgba(239,68,68,0.12)_0%,rgba(10,10,10,0)_55%)]" />
          <div className="mx-auto max-w-7xl px-4 py-14 md:py-18">
            <AnimatedCounters />
          </div>
        </section>

        <section id="services">
          <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
            <ServicesSection />
          </div>
        </section>

        <section id="vault-sizes">
          <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
            <VaultTiersSection />
          </div>
        </section>

        <section id="testimonials">
          <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
            <TestimonialsSection />
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
            <GalleryStrip />
          </div>
        </section>

        <section id="contact">
          <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
            <ContactSection />
          </div>
        </section>

        <FinalCTA />
      </main>
    </div>
  );
}
