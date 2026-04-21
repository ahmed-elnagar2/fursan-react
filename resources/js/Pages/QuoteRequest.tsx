import { useMemo, useState } from "react";
import { Building2, CheckCircle2, ChevronDown, Mail, Phone, RefreshCw, ShieldCheck, Plus, Minus, Box, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import logo from "@/assets/logo.jpg";
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

const generateCaptcha = () => {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  return { question: `${a} + ${b} = ?`, answer: a + b };
};

interface QuoteRequestProps {
  initialServices?: any[];
  initialSettings?: Record<string, string>;
}

const QuoteRequest = ({ initialServices }: QuoteRequestProps) => {
  const { t, language, direction } = useLanguage();
  const { settings } = usePage<PageProps>().props;

  // Get search params for pre-selection
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "");
  const preselectedServiceIds = useMemo(() => searchParams.getAll("service"), []);

  const [selectedServices, setSelectedServices] = useState<string[]>(preselectedServiceIds);
  const [selectedSubOptions, setSelectedSubOptions] = useState<Record<string, string[]>>({});
  const [expandedServices, setExpandedServices] = useState<string[]>(preselectedServiceIds);
  const [subServiceQuantities, setSubServiceQuantities] = useState<Record<string, Record<string, number>>>({});
  const [subStorageDetails, setSubStorageDetails] = useState<Record<string, Record<string, { space: number; units: number }>>>({});
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    details: "",
  });
  const [sending, setSending] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  let displayServices = (initialServices || [])
    .filter((s: any) => s.is_active !== false)
    .map((service: any) => ({
      ...service,
      title: language === "en" ? (service.title_en || service.title) : service.title,
      description: language === "en" ? (service.description_en || service.description) : service.description,
    }));

  const quoteHighlights = [
    {
      icon: ShieldCheck,
      title: t("quote_feature_speed_title"),
      description: t("quote_feature_speed_desc"),
    },
    {
      icon: Building2,
      title: t("quote_feature_custom_title"),
      description: t("quote_feature_custom_desc"),
    },
    {
      icon: CheckCircle2,
      title: t("quote_feature_followup_title"),
      description: t("quote_feature_followup_desc"),
    },
  ];

  const toggleService = (serviceId: string, checked: boolean) => {
    setSelectedServices((current) =>
      checked ? [...new Set([...current, serviceId])] : current.filter((id) => id !== serviceId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || selectedServices.length === 0) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: t("quote_required_error"),
        variant: "destructive",
      });
      return;
    }

    if (parseInt(captchaInput) !== captcha.answer) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "إجابة التحقق غير صحيحة، حاول مرة أخرى" : "Incorrect verification answer, try again",
        variant: "destructive",
      });
      refreshCaptcha();
      return;
    }

    const isStorageService = (title: string, titleEn?: string) => {
      const t = title.toLowerCase();
      const te = titleEn?.toLowerCase() || "";
      return t.includes("تخزين") || te.includes("storage");
    };

    const selectedServiceData = displayServices
      .filter((service: any) => selectedServices.includes(service.id))
      .map((service: any) => {
        const subOptions = selectedSubOptions[service.id] || [];

        const subOptionsData = service.sub_services || [];
        const subDetails = subOptions.map(subId => {
          const matchingOption = subOptionsData.find((opt: any) => opt.id === subId);
          const name = matchingOption ? (language === "ar" ? matchingOption.name.ar : matchingOption.name.en) : subId;
          const qty = subServiceQuantities[service.id]?.[subId] || 1;
          const storage = subStorageDetails[service.id]?.[subId];

          return {
            name,
            quantity: qty,
            storageSpace: storage?.space || 0,
            storageUnits: storage?.units || 0,
            hasStorage: !!storage
          };
        });

        return {
          name: service.title,
          subServices: subDetails,
          // Support old schema just in case
          quantity: 1,
        };
      });

    setSending(true);
    try {
      await api.post("/messages", {
        name: form.name.trim().slice(0, 100),
        email: form.email.trim().slice(0, 255),
        phone: form.phone.trim().slice(0, 20),
        message: form.details.trim().slice(0, 1000) || null,
        company: form.company.trim().slice(0, 100) || null,
        services: selectedServiceData,
      });

      toast({ title: t("quote_success_title"), description: t("quote_success_desc") });
      setForm({ name: "", company: "", email: "", phone: "", details: "" });
      setSelectedServices([]);
      refreshCaptcha();
    } catch (error: any) {
      console.error(error);
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: error.response?.data?.message || (language === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred"),
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setForm({ name: "", company: "", email: "", phone: "", details: "" });
    setSelectedServices([]);
    setSelectedSubOptions({});
    setSubServiceQuantities({});
    setSubStorageDetails({});
    setCaptchaInput("");
    refreshCaptcha();
    toast({
      title: language === "ar" ? "تم مسح البيانات" : "Data cleared",
      description: language === "ar" ? "يمكنك البدء في إدخال طلب جديد الآن." : "You can start entering a new request now.",
    });
  };

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <Head title={t("nav_quote_request")} />
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-gold-light/50 quote-hero-bg">
          <div className="container mx-auto grid max-w-7xl gap-10 px-6 pt-36 pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-gold-light bg-card/80 px-4 py-2 text-xs font-semibold text-gold-dark">
                {t("nav_quote_request")}
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-charcoal md:text-5xl">
                {t("quote_page_title")}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                {t("quote_page_desc")}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {quoteHighlights.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-border/50 bg-card/75 p-5 shadow-gold dark:shadow-none dark:bg-white/5">
                    <item.icon className="h-6 w-6 text-gold-dark" />
                    <h2 className="mt-4 text-sm font-bold text-charcoal">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-gold-light/30 bg-card p-8 shadow-gold dark:shadow-none dark:bg-white/5">
              <h2 className="text-2xl font-bold text-charcoal">{t("quote_process_title")}</h2>
              <div className="mt-6 space-y-5">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-gold text-sm font-bold text-white">
                      {step}
                    </div>
                    <div>
                      <p className="font-bold text-charcoal">{t(`quote_process_${step}_title`)}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(`quote_process_${step}_desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-gold-light/30 bg-card p-8 shadow-gold dark:shadow-none dark:bg-white/5">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-charcoal">{t("quote_form_title")}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{t("quote_form_desc")}</p>
              </div>

              <form id="quote-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label>{t("contact_form_name")} *</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
                  </div>
                  <div>
                    <Label>{t("quote_company_name")}</Label>
                    <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} maxLength={100} />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label>{t("contact_form_email")} *</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      dir="ltr"
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <Label>{t("contact_form_phone")} *</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      dir="ltr"
                      maxLength={20}
                    />
                  </div>
                </div>

                <div>
                  <Label>{t("quote_project_details")}</Label>
                  <Textarea
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    rows={5}
                    maxLength={700}
                    placeholder={t("quote_details_placeholder")}
                  />
                </div>

                <div className="rounded-3xl border border-gold-light/20 bg-gold-pale/30 dark:bg-gold-pale/10 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-bold text-charcoal">{t("quote_services_title")}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{t("quote_services_desc")}</p>
                    </div>
                    <span className="rounded-full bg-card border border-border px-3 py-2 text-xs font-semibold text-gold-dark">
                      {selectedServices.length} {t("quote_selected_count")}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {displayServices.map((service: any, index: number) => {
                      const isSelected = selectedServices.includes(service.id);
                      const isExpanded = expandedServices.includes(service.id);
                      const serviceSubs = service.sub_services || [];

                      return (
                        <div key={service.id} className={`rounded-3xl border transition-all duration-300 ${isSelected ? 'border-gold-medium shadow-[0_0_20px_rgba(207,175,103,0.15)]' : 'border-gold-light/60 hover:border-gold-medium/40'} bg-card overflow-hidden`}>
                          <div
                            className="flex cursor-pointer items-start gap-4 p-5 transition hover:bg-muted/30"
                            onClick={() => {
                              if (serviceSubs.length > 0) {
                                setExpandedServices(prev =>
                                  prev.includes(service.id) ? prev.filter(id => id !== service.id) : [...prev, service.id]
                                );
                              } else {
                                toggleService(service.id, !isSelected)
                              }
                            }}
                          >
                            <div onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  toggleService(service.id, checked === true);
                                  if (checked && !isExpanded) setExpandedServices(prev => [...prev, service.id]);
                                }}
                                className="mt-1 h-6 w-6 rounded-md border-gold-medium/60 data-[state=checked]:bg-gold-medium data-[state=checked]:border-transparent data-[state=checked]:text-white transition-all shadow-sm"
                              />
                            </div>
                            <img
                              src={service.image_url || fallbackImages[index] || meatImg}
                              alt={service.title}
                              className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-cover shrink-0 shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-base md:text-lg text-charcoal leading-tight">{service.title}</p>
                              <p className="mt-1 text-xs md:text-sm leading-relaxed text-muted-foreground line-clamp-2 md:line-clamp-3">{service.description}</p>
                            </div>
                            {serviceSubs.length > 0 && (
                              <div className={`shrink-0 pt-2 text-gold-dark/70 transition-transform duration-300 ease-spring ${isExpanded ? 'rotate-180 text-gold-dark' : 'rotate-0'}`}>
                                <ChevronDown className="h-6 w-6" />
                              </div>
                            )}
                          </div>

                          <AnimatePresence>
                            {(isExpanded || isSelected) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="border-t border-border/50 bg-gold-pale/5 shadow-inner"
                              >
                                <div className="p-4 md:p-5 ps-6 md:ps-12 space-y-4">
                                  {/* Sub Services */}
                                  {serviceSubs.length > 0 && (
                                    <div className="space-y-3">
                                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{language === 'ar' ? 'الخيارات المتاحة' : 'Available Options'}</p>
                                      <div className="grid gap-4 grid-cols-1">
                                        {serviceSubs.map((opt: any) => {
                                          const isSubSelected = selectedSubOptions[service.id]?.includes(opt.id) || false;
                                          const qty = subServiceQuantities[service.id]?.[opt.id] || 1;
                                          const isStorage = service.title.toLowerCase().includes("تخزين") || service.title_en?.toLowerCase().includes("storage");

                                          return (
                                            <div key={opt.id} className={`flex flex-col gap-3 p-3 rounded-2xl border transition-all duration-300 ${isSubSelected ? 'bg-background border-gold-medium/40 shadow-sm' : 'bg-transparent border-transparent hover:border-gold-light/30'}`}>
                                              <label className="flex items-center gap-3 cursor-pointer group select-none flex-1">
                                                <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200 ${isSubSelected ? 'border-gold-medium bg-gold-medium shadow-sm shadow-gold-medium/20' : 'border-muted-foreground/30 bg-background group-hover:border-gold-medium/50'}`}>
                                                  {isSubSelected && <span className="w-2 h-2 bg-white rounded-full"></span>}
                                                </div>
                                                <span className={`text-sm transition-colors duration-200 ${isSubSelected ? 'text-charcoal font-bold' : 'text-muted-foreground group-hover:text-charcoal font-medium'}`}>
                                                  {language === "ar" ? opt.name.ar : opt.name.en}
                                                </span>
                                                <input
                                                  type="checkbox"
                                                  className="sr-only"
                                                  checked={isSubSelected}
                                                  onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setSelectedSubOptions(prev => {
                                                      const current = prev[service.id] || [];
                                                      const next = checked ? [...current, opt.id] : current.filter(id => id !== opt.id);
                                                      return { ...prev, [service.id]: next };
                                                    });
                                                    // Auto-select parent if selecting child
                                                    if (checked && !isSelected) {
                                                      toggleService(service.id, true);
                                                    }
                                                  }}
                                                />
                                              </label>

                                              {isSubSelected && (
                                                <motion.div
                                                  initial={{ opacity: 0, x: -10 }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  className="flex flex-wrap items-center gap-4 ps-8"
                                                >
                                                  {isStorage ? (
                                                    <div className="flex flex-wrap gap-3">
                                                      <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-xl border border-border/50">
                                                        <Maximize2 className="w-3 h-3 text-gold-dark" />
                                                        <Input
                                                          type="number"
                                                          placeholder="م²"
                                                          className="h-8 w-16 text-center text-xs font-bold bg-transparent border-none p-0 focus-visible:ring-0"
                                                          min="0"
                                                          value={subStorageDetails[service.id]?.[opt.id]?.space || ""}
                                                          onChange={(e) => {
                                                            const val = Math.max(0, parseInt(e.target.value) || 0);
                                                            setSubStorageDetails({
                                                              ...subStorageDetails,
                                                              [service.id]: {
                                                                ...(subStorageDetails[service.id] || {}),
                                                                [opt.id]: { ...(subStorageDetails[service.id]?.[opt.id] || { units: 0 }), space: val }
                                                              }
                                                            })
                                                          }}
                                                        />
                                                      </div>
                                                      <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-xl border border-border/50">
                                                        <Box className="w-3 h-3 text-gold-dark" />
                                                        <Input
                                                          type="number"
                                                          min="0"
                                                          placeholder={language === 'ar' ? 'وحدة' : 'Unit'}
                                                          className="h-8 w-16 text-center text-xs font-bold bg-transparent border-none p-0 focus-visible:ring-0"
                                                          value={subStorageDetails[service.id]?.[opt.id]?.units || ""}
                                                          onChange={(e) => {
                                                            const val = Math.max(0, parseInt(e.target.value) || 0);
                                                            setSubStorageDetails({
                                                              ...subStorageDetails,
                                                              [service.id]: {
                                                                ...(subStorageDetails[service.id] || {}),
                                                                [opt.id]: { ...(subStorageDetails[service.id]?.[opt.id] || { space: 0 }), units: val }
                                                              }
                                                            })
                                                          }}
                                                        />
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-xl border border-border/50">
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          const current = subServiceQuantities[service.id]?.[opt.id] || 1;
                                                          if (current > 1) setSubServiceQuantities({
                                                            ...subServiceQuantities,
                                                            [service.id]: { ...(subServiceQuantities[service.id] || {}), [opt.id]: current - 1 }
                                                          });
                                                        }}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gold-pale text-gold-dark"
                                                      >
                                                        <Minus className="w-3 h-3" />
                                                      </button>
                                                      <span className="w-6 text-center text-xs font-black">{subServiceQuantities[service.id]?.[opt.id] || 1}</span>
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          const current = subServiceQuantities[service.id]?.[opt.id] || 1;
                                                          setSubServiceQuantities({
                                                            ...subServiceQuantities,
                                                            [service.id]: { ...(subServiceQuantities[service.id] || {}), [opt.id]: current + 1 }
                                                          });
                                                        }}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gold-pale text-gold-dark"
                                                      >
                                                        <Plus className="w-3 h-3" />
                                                      </button>
                                                    </div>
                                                  )}
                                                </motion.div>
                                              )}
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-border/50 bg-card/85 dark:bg-white/5 p-5 md:p-8 shadow-gold dark:shadow-none sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">{t("quote_summary_title")}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-[10px] h-7 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                  </Button>
                </div>
                <div className="space-y-5">
                  <div className="rounded-2xl bg-gold-pale/30 p-5 border border-gold-light/20">
                    <p className="text-xs font-bold text-muted-foreground uppercase">{t("quote_summary_count")}</p>
                    <p className="mt-2 text-3xl font-black text-charcoal">{selectedServices.length}</p>
                  </div>
                  <div className="rounded-2xl border border-gold-light p-5 bg-background/50">
                    <p className="text-sm font-bold text-charcoal border-b pb-2 mb-4">{t("quote_summary_services")}</p>
                    <div className="mt-4 space-y-4">
                      {selectedServices.length > 0 ? (
                        displayServices.filter((s: any) => selectedServices.includes(s.id)).map((service: any) => {
                          const subOpts = selectedSubOptions[service.id] || [];
                          const subOptionsData = service.sub_services || [];

                          return (
                            <div key={service.id} className="flex flex-col gap-2 w-full border-b border-border/50 pb-4 last:border-0 last:pb-0">
                              <div className="flex items-center gap-2">
                                <span className="rounded-lg bg-gold-pale px-3 py-1.5 text-xs font-black text-gold-dark border border-gold-medium/20 shadow-sm">
                                  {service.title}
                                </span>
                              </div>
                              {subOpts.length > 0 && (
                                <div className="space-y-2 ps-3 border-s-2 border-gold-pale">
                                  {subOpts.map(subId => {
                                    const matchingOption = subOptionsData.find((opt: any) => opt.id === subId);
                                    const name = matchingOption ? (language === "ar" ? matchingOption.name.ar : matchingOption.name.en) : subId;
                                    const qty = subServiceQuantities[service.id]?.[subId] || 1;
                                    const storage = subStorageDetails[service.id]?.[subId];

                                    return (
                                      <div key={subId} className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="text-muted-foreground font-medium flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3 text-gold-medium" />
                                            {name}
                                          </span>
                                          {qty > 1 && <span className="font-bold text-gold-dark bg-gold-pale/50 px-1.5 rounded">x{qty}</span>}
                                        </div>
                                        {storage && (
                                          <div className="flex gap-2 text-[10px] ps-4">
                                            <span className="text-gold-dark/70 font-bold bg-gold-pale/30 px-1.5 py-0.5 rounded border border-gold-medium/10">
                                              {storage.space}m²
                                            </span>
                                            <span className="text-gold-dark/70 font-bold bg-gold-pale/30 px-1.5 py-0.5 rounded border border-gold-medium/10">
                                              {storage.units} {language === 'ar' ? 'وحدة' : 'Units'}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground italic">{t("quote_summary_empty")}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3 rounded-2xl border border-gold-light/30 bg-muted/30 p-5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gold-dark" />
                      <span dir="ltr" className="font-medium text-foreground/80">{settings?.phone || "+20 123 456 789"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gold-dark" />
                      <span dir="ltr" className="font-medium text-foreground/80">{settings?.email || "info@forsangroup.com"}</span>
                    </div>
                  </div>
                  {/* Verification & Submit relocated here for professional flow */}
                  <div className="space-y-4 pt-4 border-t border-gold-medium/20">
                    <div className="rounded-2xl border border-gold-light/40 bg-background/80 p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">{t("contact_form_captcha")}</Label>
                        <Button type="button" variant="ghost" size="icon" onClick={refreshCaptcha} className="h-8 w-8 text-gold-dark">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-3 text-center text-2xl font-black tracking-widest text-gold-dark" dir="ltr">
                        {captcha.question}
                      </p>
                      <Input
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder={t("contact_form_answer")}
                        type="number"
                        dir="ltr"
                        form="quote-form"
                        className="mt-4 text-center h-12 text-lg font-bold bg-muted/30 border-gold-pale focus-visible:ring-gold-medium"
                      />
                    </div>

                    <Button
                      type="submit"
                      form="quote-form"
                      disabled={sending}
                      className="w-full h-14 text-lg font-bold gradient-gold text-primary-foreground shadow-lg shadow-gold-medium/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {sending ? t("quote_submit_loading") : t("quote_submit_cta")}
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground px-4">
                      {language === 'ar'
                        ? "بالضغط على إرسال، فإنك توافق على مراجعة طلبك من قبل فريقنا المختص والرد عليك في أقرب وقت."
                        : "By clicking send, you agree to have your request reviewed by our specialized team."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuoteRequest;
