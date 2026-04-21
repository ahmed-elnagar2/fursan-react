import { useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone, RefreshCw, Send, Sparkles } from "lucide-react";
import api from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { toast } from "@/hooks/use-toast";

const generateCaptcha = () => {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  return { question: `${a} + ${b} = ?`, answer: a + b };
};

interface ContactSectionProps {
  settings?: Record<string, string>;
}

const ContactSection = ({ settings }: ContactSectionProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-100px" });
  const { t, language } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill all required fields",
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

    setSending(true);
    try {
      await api.post("/messages", {
        name: form.name.trim().slice(0, 100),
        email: form.email.trim().slice(0, 255),
        phone: form.phone.trim().slice(0, 20) || null,
        message: form.message.trim().slice(0, 1000),
      });
      
      toast({ title: t("contact_success"), description: t("contact_success_desc") });
      setForm({ name: "", email: "", phone: "", message: "" });
      refreshCaptcha();
    } catch (err: any) {
      console.error(err);
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" 
          ? `تعذر إرسال الرسالة: ${err.response?.data?.message || "حدث خطأ غير متوقع"}` 
          : `Failed to send message: ${err.response?.data?.message || "An unexpected error occurred"}`,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: t("contact_info_phone"), value: settings?.phone || "+20 123 456 789", href: `tel:${settings?.phone || "+20 123 456 789"}` },
    { icon: Mail, label: t("contact_info_email"), value: settings?.email || "info@forsangroup.com", href: `mailto:${settings?.email || "info@forsangroup.com"}` },
    { 
      icon: MapPin, 
      label: t("contact_info_address"), 
      value: language === "en" ? (settings?.address_en || settings?.address || "Cairo, Egypt") : (settings?.address || "Cairo, Egypt"), 
      href: settings?.address ? `https://maps.google.com/?q=${encodeURIComponent(settings.address)}` : undefined 
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden bg-background py-24 text-charcoal" ref={ref}>
      <div className="absolute top-1/4 right-1/4 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-gold-medium/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-gold-light/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-light bg-card px-4 py-2 text-xs font-semibold tracking-[0.16em] text-gold-dark shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {t("contact_title")}
          </span>
          <h2 className="mt-5 text-4xl font-bold text-charcoal md:text-5xl">{t("contact_title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{t("contact_desc")}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
            className="space-y-5"
          >
            {contactInfo.map((item, index) => {
              const Tag: any = item.href ? motion.a : motion.div;
              return (
                <Tag
                  key={item.label}
                  href={item.href}
                  target={item.href?.startsWith("http") ? "_blank" : undefined}
                  rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 + index * 0.1 }}
                  className="group flex flex-col sm:flex-row border-transparent custom-hover-effect sm:items-start gap-5 rounded-[2rem] bg-card p-7 shadow-xl shadow-black/[0.03] border transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-medium/10 md:items-center text-start overflow-hidden relative cursor-pointer"
                >
                  <div className="flex h-14 w-14 shrink-0 sm:self-start md:self-auto items-center justify-center rounded-[1.25rem] bg-gold-pale/50 text-gold-dark transition-colors group-hover:bg-gold-medium group-hover:text-white">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 w-full min-w-0">
                    <p className="text-sm font-semibold text-charcoal">{item.label}</p>
                    <p className="mt-2 text-sm text-muted-foreground transition-colors group-hover:text-charcoal w-full truncate" dir="ltr" title={item.value}>
                      {item.value}
                    </p>
                  </div>
                </Tag>
              );
            })}
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.15 }}
            className="rounded-[2.5rem] border border-border bg-card p-8 shadow-2xl shadow-gold-medium/5 md:p-10"
          >
            <h3 className="text-2xl font-bold text-charcoal">{t("contact_form_title")}</h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <Label className="mb-2 block text-muted-foreground">{t("contact_form_name")} *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  maxLength={100}
                  className="h-14 rounded-2xl bg-muted/80 border-transparent text-charcoal placeholder:text-muted-foreground focus:border-gold-medium focus:bg-background focus:ring-2 focus:ring-gold-medium/20 transition-all font-medium"
                />
              </div>
              <div>
                <Label className="mb-2 block text-muted-foreground">{t("contact_form_phone")}</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  dir="ltr"
                  maxLength={20}
                  className="h-14 rounded-2xl bg-muted/80 border-transparent text-charcoal placeholder:text-muted-foreground focus:border-gold-medium focus:bg-background focus:ring-2 focus:ring-gold-medium/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="mt-5">
              <Label className="mb-2 block text-muted-foreground">{t("contact_form_email")} *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                dir="ltr"
                maxLength={255}
                className="h-14 rounded-2xl bg-muted/80 border-transparent text-charcoal placeholder:text-muted-foreground focus:border-gold-medium focus:bg-background focus:ring-2 focus:ring-gold-medium/20 transition-all font-medium"
              />
            </div>

            <div className="mt-5">
              <Label className="mb-2 block text-muted-foreground">{t("contact_form_message")} *</Label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={6}
                maxLength={1000}
                className="rounded-[1.5rem] bg-muted/80 border-transparent text-charcoal placeholder:text-muted-foreground focus:border-gold-medium focus:bg-background focus:ring-2 focus:ring-gold-medium/20 transition-all font-medium resize-none p-4"
              />
            </div>

            <div className="mt-6 rounded-[1.5rem] border-transparent bg-gold-pale/35 p-5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-charcoal">{t("contact_form_captcha")}</Label>
                <Button type="button" variant="ghost" size="icon" onClick={refreshCaptcha} className="h-8 w-8 rounded-full text-charcoal hover:bg-muted/80">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-3 text-center text-lg font-bold text-charcoal tracking-wider" dir="ltr">
                {captcha.question}
              </p>
              <Input
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder={t("contact_form_answer")}
                required
                dir="ltr"
                type="number"
                className="mt-4 h-14 rounded-2xl bg-background border-transparent text-charcoal placeholder:text-muted-foreground focus:border-gold-medium focus:ring-2 focus:ring-gold-medium/20 text-center text-lg font-bold transition-all"
              />
            </div>

            <Button type="submit" disabled={sending} className="mt-8 h-14 w-full rounded-2xl gradient-gold text-white font-bold text-base shadow-lg shadow-gold-medium/20 hover:shadow-xl hover:shadow-gold-medium/40 hover:-translate-y-1 transition-all">
              <Send className="me-2 h-5 w-5" />
              {sending ? t("contact_form_sending") : t("contact_form_send")}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
