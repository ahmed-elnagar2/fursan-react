import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import { Award, Globe, Users } from "lucide-react";

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-100px" });
  const { t, language } = useLanguage();

  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await api.get("/settings");
      return data;
    },
  });

  const stats = [
    { icon: Globe, value: settings?.years_experience || "+15", label: t("about_years") },
    { icon: Users, value: settings?.happy_clients || "+500", label: t("about_clients") },
    { icon: Award, value: settings?.trade_partners || "+20", label: t("about_partners") },
  ];

  return (
    <section id="about" className="py-24 bg-card" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ type: "spring", stiffness: 80, damping: 20 }} className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">{t("about_title")}</h2>
          <div className="w-16 h-0.5 gradient-gold mx-auto mb-8" />
          <p className="text-muted-foreground leading-relaxed text-lg">
            {language === 'en' 
              ? (settings?.company_description_en || t("about_desc")) 
              : (settings?.company_description || t("about_desc"))}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.15 }} className="text-center p-6">
              <stat.icon className="w-8 h-8 text-gold-medium mx-auto mb-3" />
              <p className="text-3xl font-bold gradient-gold-text mb-1">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
