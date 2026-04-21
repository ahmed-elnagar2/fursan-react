import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import meatImg from "@/assets/meat-service.jpg";
import storageImg from "@/assets/storage-service.jpg";
import plasticsImg from "@/assets/plastics-service.jpg";
import cateringImg from "@/assets/catering-service.jpg";

const fallbackImages: Record<number, string> = {
  0: meatImg,
  1: storageImg,
  2: plasticsImg,
  3: cateringImg,
};

interface ServicesSectionProps {
  services?: any[];
}

const ServicesSection = ({ services: initialServices }: ServicesSectionProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-100px" });
  const { t, language } = useLanguage();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const fallbackServices = [
    { id: "1", title: t("service_meat_title"), description: t("service_meat_desc"), image_url: null },
    { id: "2", title: t("service_storage_title"), description: t("service_storage_desc"), image_url: null },
    { id: "3", title: t("service_plastics_title"), description: t("service_plastics_desc"), image_url: null },
    { id: "4", title: t("service_catering_title"), description: t("service_catering_desc"), image_url: null },
  ];

  let displayServices = initialServices && initialServices.length > 0 ? initialServices : fallbackServices;
  
  // Filter out inactive services for the public landing page
  displayServices = displayServices.filter((s: any) => s.is_active !== false);

  displayServices = displayServices.map((service: any) => ({
    ...service,
    title: language === "en" ? (service.title_en || service.title) : service.title,
    description: language === "en" ? (service.description_en || service.description) : service.description,
  }));

  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServices((current) =>
      current.includes(serviceId) ? current.filter((id) => id !== serviceId) : [...current, serviceId]
    );
  };

  const handleQuoteRequest = () => {
    if (selectedServices.length === 0) return;
    const params = new URLSearchParams();
    selectedServices.forEach((serviceId) => params.append("service", serviceId));
    router.get(`/quote-request?${params.toString()}`);
  };

  return (
    <section id="services" className="bg-gold-pale/45 py-24" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-light bg-card px-4 py-2 text-xs font-semibold tracking-[0.16em] text-gold-dark">
            <Sparkles className="h-3.5 w-3.5" />
            {t("nav_services")}
          </span>
          <h2 className="mt-5 text-4xl font-bold text-charcoal md:text-5xl">{t("services_title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{t("services_desc")}</p>
        </motion.div>

        <div className="mb-8 flex justify-center">
          <button
            type="button"
            onClick={handleQuoteRequest}
            disabled={selectedServices.length === 0}
            className="inline-flex items-center gap-2 rounded-full gradient-gold px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectedServices.length > 0
              ? t("service_quote_multi_cta").replace("{count}", String(selectedServices.length))
              : t("service_quote_multi_empty")}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {displayServices?.map((service, i) => {
            const isSelected = selectedServices.includes(service.id);

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.1 }}
                className={`group relative overflow-hidden rounded-[2.5rem] bg-charcoal h-[440px] shadow-2xl transition-all duration-300 ${
                  isSelected ? "ring-4 ring-gold-medium ring-offset-4 ring-offset-background" : "hover:-translate-y-2 hover:shadow-[0_20px_50px_-20px_rgba(90,70,25,0.3)]"
                }`}
              >
                <img
                  src={service.image_url || fallbackImages[i] || meatImg}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                  width={1280}
                  height={832}
                />
                <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-black/65' : 'bg-gradient-to-t from-black/95 via-black/40 to-black/10 group-hover:from-black/90'}`} />

                <div className="absolute inset-0 flex flex-col justify-end p-8 z-10 w-full h-full">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-3xl font-bold text-white tracking-wide">{service.title}</h3>
                    {isSelected && <CheckCircle2 className="mt-1 h-7 w-7 shrink-0 text-gold-medium drop-shadow-md" />}
                  </div>
                  
                  <p className="mb-6 text-[15px] leading-relaxed text-white/80 line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-3 mt-auto">
                    <button
                      type="button"
                      onClick={() => toggleServiceSelection(service.id)}
                      className={`rounded-full px-6 py-3 text-sm font-semibold transition backdrop-blur-md ${
                        isSelected
                          ? "bg-gold-medium text-white shadow-lg shadow-gold-medium/40"
                          : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {isSelected ? t("service_remove_cta") : t("service_quote_cta")}
                    </button>
                    {isSelected && <span className="text-sm font-semibold text-gold-medium drop-shadow-md">{t("service_selected_badge")}</span>}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
