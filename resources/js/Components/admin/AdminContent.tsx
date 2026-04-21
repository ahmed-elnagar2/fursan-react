import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import AdminLoading from "./AdminLoading";

const AdminContent = () => {
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
      <h2 className="text-xl font-bold gradient-gold-text">{t("admin_content_title")}</h2>
      <div className="grid gap-4">
        <div>
          <Label>{t("admin_content_hero")}</Label>
          <Input value={settings?.hero_title || ""} onChange={e => setSettings({ ...settings, hero_title: e.target.value })} />
        </div>
        <div>
          <Label>{t("hero_subtitle")}</Label>
          <Textarea value={settings?.hero_subtitle || ""} onChange={e => setSettings({ ...settings, hero_subtitle: e.target.value })} rows={3} />
        </div>
        <div>
          <Label>{t("about_desc")}</Label>
          <Textarea value={settings?.company_description || ""} onChange={e => setSettings({ ...settings, company_description: e.target.value })} rows={4} />
        </div>
        <div>
          <Label>{t("about_desc")} (English)</Label>
          <Textarea value={settings?.company_description_en || ""} onChange={e => setSettings({ ...settings, company_description_en: e.target.value })} rows={4} dir="ltr" />
        </div>

        <h3 className="text-lg font-semibold gradient-gold-text mt-4">{t("admin_content_stats")}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>{t("about_years")}</Label>
            <Input value={settings?.years_experience || ""} onChange={e => setSettings({ ...settings, years_experience: e.target.value })} />
          </div>
          <div>
            <Label>{t("about_clients")}</Label>
            <Input value={settings?.happy_clients || ""} onChange={e => setSettings({ ...settings, happy_clients: e.target.value })} />
          </div>
          <div>
            <Label>{t("about_partners")}</Label>
            <Input value={settings?.trade_partners || ""} onChange={e => setSettings({ ...settings, trade_partners: e.target.value })} />
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

export default AdminContent;
