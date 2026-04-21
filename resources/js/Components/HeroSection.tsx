import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import heroBg from "@/assets/hero-bg.jpg";
import logoPng from "@/assets/logoonly.png";

import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

interface HeroSectionProps {
  settings?: any;
}

const HeroSection = ({ settings: propsSettings }: HeroSectionProps) => {
  const { t, language } = useLanguage();
  const { settings: sharedSettings } = usePage<PageProps>().props;
  const settings = propsSettings || sharedSettings;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.img
        src={heroBg}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <img src={logoPng} alt="Forsan Group" className="mx-auto mb-8 h-44 w-auto md:h-52 lg:h-60 object-contain" />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            {settings?.hero_title || t("hero_title")}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-4 font-light tracking-wide">FORSAN GROUP</p>
          <div className="w-24 h-0.5 gradient-gold mx-auto mb-8" />
          <p className="text-base md:text-lg text-primary-foreground/90 max-w-xl mx-auto leading-relaxed">
            {language === "ar" ? settings?.hero_subtitle || t("hero_subtitle") : t("hero_subtitle")}
          </p>
          <motion.a
            href="#services"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-block mt-10 px-8 py-3 gradient-gold rounded-full text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            {t("hero_cta")}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
