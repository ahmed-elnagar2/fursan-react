import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Save, Phone, Mail, MapPin, Layout, Info } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import AdminLoading from "./AdminLoading";
import { Textarea } from "@/Components/ui/textarea";

const AdminSettings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setLoading(true);
    api.get("/settings").then(({ data }) => {
      setSettings(data);
      setTimeout(() => setLoading(false), 800);
    }).catch(error => {
      console.error("Failed to fetch settings:", error);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await api.put("/settings", settings);
      toast({ title: t("success"), description: t("content_updated_successfully") });
    } catch (error: any) {
      toast({ title: t("error"), description: error.response?.data?.message || t("failed_to_save"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold gradient-gold-text">{t("admin_settings_title")}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold gradient-gold-text flex items-center gap-2">
            <Phone className="w-5 h-5" />
            {t("admin_settings_contact_info") || "معلومات التواصل"}
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">{t("contact_info_phone")}</Label>
              <Input value={settings?.phone || ""} onChange={e => setSettings({ ...settings, phone: e.target.value })} dir="ltr" className="rounded-xl border-border/60" />
            </div>
            <div>
              <Label className="mb-1.5 block">{t("contact_info_email")}</Label>
              <Input value={settings?.email || ""} onChange={e => setSettings({ ...settings, email: e.target.value })} dir="ltr" className="rounded-xl border-border/60" />
            </div>
            <div>
              <Label className="mb-1.5 block">{t("contact_info_address")}</Label>
              <Input value={settings?.address || ""} onChange={e => setSettings({ ...settings, address: e.target.value })} className="rounded-xl border-border/60" />
            </div>
            <div>
              <Label className="mb-1.5 block">{t("contact_info_address")} (English)</Label>
              <Input value={settings?.address_en || ""} onChange={e => setSettings({ ...settings, address_en: e.target.value })} dir="ltr" className="rounded-xl border-border/60" />
            </div>
          </div>
        </div>

        {/* Site Content */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold gradient-gold-text flex items-center gap-2">
            <Layout className="w-5 h-5" />
            {t("admin_settings_content") || "إدارة نصوص الموقع"}
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">{t("hero_title") || "عنوان الهيرو"}</Label>
              <Input value={settings?.hero_title || ""} onChange={e => setSettings({ ...settings, hero_title: e.target.value })} className="rounded-xl border-border/60 font-bold" />
            </div>
            <div>
              <Label className="mb-1.5 block">{t("hero_subtitle") || "الوصف المختصر للبطل"}</Label>
              <Textarea
                value={settings?.hero_subtitle || ""}
                onChange={e => setSettings({ ...settings, hero_subtitle: e.target.value })}
                className="rounded-xl border-border/60 min-h-[80px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Section Management */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-bold gradient-gold-text flex items-center gap-2">
          <Info className="w-5 h-5" />
          {t("admin_about_management") || "إدارة قسم من نحن"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bold">{t("about_desc")} (العربية)</Label>
            <Textarea
              value={settings?.company_description || ""}
              onChange={e => setSettings({ ...settings, company_description: e.target.value })}
              className="rounded-xl border-border/60 min-h-[150px] leading-relaxed"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold">{t("about_desc")} (English)</Label>
            <Textarea
              value={settings?.company_description_en || ""}
              onChange={e => setSettings({ ...settings, company_description_en: e.target.value })}
              dir="ltr"
              className="rounded-xl border-border/60 min-h-[150px] leading-relaxed"
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="gradient-gold text-primary-foreground">
        <Save className="w-4 h-4 me-2" />
        {saving ? t("admin_saving") : t("admin_save")}
      </Button>
    </div>
  );
};

export default AdminSettings;
