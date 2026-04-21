import Navbar from "@/Components/Navbar";
import HeroSection from "@/Components/HeroSection";
import AboutSection from "@/Components/AboutSection";
import ServicesSection from "@/Components/ServicesSection";
import ContactSection from "@/Components/ContactSection";
import Footer from "@/Components/Footer";
import { Head } from "@inertiajs/react";

import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

interface IndexProps {
  initialServices?: any[];
}

const Index = ({ initialServices }: IndexProps) => {
  const { settings } = usePage<PageProps>().props;
  const siteTitle = settings?.site_title || "Forsan Group";

  return (
    <div className="min-h-screen">
      <Head title={siteTitle} />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection services={initialServices} />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
