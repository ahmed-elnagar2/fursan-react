import Navbar from "@/Components/Navbar";
import HeroSection from "@/Components/HeroSection";
import AboutSection from "@/Components/AboutSection";
import ServicesSection from "@/Components/ServicesSection";
import ContactSection from "@/Components/ContactSection";
import Footer from "@/Components/Footer";
import { Head } from "@inertiajs/react";

interface IndexProps {
  initialServices?: any[];
  initialSettings?: Record<string, string>;
}

const Index = ({ initialServices, initialSettings }: IndexProps) => {
  return (
    <div className="min-h-screen">
      <Head title="Home" />
      <Navbar />
      <HeroSection settings={initialSettings} />
      <AboutSection />
      <ServicesSection services={initialServices} />
      <ContactSection settings={initialSettings} />
      <Footer />
    </div>
  );
};

export default Index;
