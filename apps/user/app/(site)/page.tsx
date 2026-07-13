import { AboutSection } from "../_components/AboutSection";
import { BlogSection } from "../_components/BlogSection";
import { CtaSection } from "../_components/CtaSection";
import { CustomerReviewSection } from "../_components/CustomerReviewSection";
import { FaqSection } from "../_components/FaqSection";
import { Hero } from "../_components/Hero";
import { Metrics } from "../_components/Metrics";
import { PortfolioSection } from "../_components/PortfolioSection";
import { ServicesSection } from "../_components/ServicesSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Metrics />
      <PortfolioSection />
      <ServicesSection />
      <AboutSection />
      <CustomerReviewSection />
      <BlogSection />
      <CtaSection />
      <FaqSection />
    </>
  );
}
