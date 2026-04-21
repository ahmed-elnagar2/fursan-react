import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, GripVertical, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/Components/ui/switch";
import { Badge } from "@/Components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import AdminLoading from "./AdminLoading";

export interface SubService {
  id: string;
  name: { ar: string; en: string };
}

interface Service {
  id: string;
  title: string;
  description: string;
  title_en?: string;
  description_en?: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  sub_services: SubService[];
}

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/services");
      setServices(data || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    if (newlyAddedId) {
      const element = document.getElementById(`service-${newlyAddedId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setNewlyAddedId(null), 3000);
      }
    }
  }, [newlyAddedId, services]);

  useEffect(() => { fetchServices(); }, []);

  const addService = async () => {
    try {
      const { data } = await api.post("/services", {
        title: "خدمة جديدة",
        description: "وصف الخدمة",
        sort_order: services.length + 1,
        sub_services: [],
        is_active: false
      });

      await fetchServices();
      queryClient.invalidateQueries({ queryKey: ["services"] });
      if (data) {
        setNewlyAddedId(data.id);
      }
      toast({ title: t("contact_success") || "تمت الإضافة بنجاح، يمكنك التعديل الآن" });
    } catch (error: any) {
      toast({ title: t("error") || "حدث خطأ أثناء الإضافة", description: error.response?.data?.message, variant: "destructive" });
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const { data } = await api.put(`/services/${id}`, updates);
      setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({ title: t("contact_success") || "تم التحديث بنجاح" });
    } catch (error: any) {
      toast({ title: t("error") || "خطأ في التحديث", description: error.response?.data?.message, variant: "destructive" });
    }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الخدمة بصفة نهائية؟")) return;
    
    try {
      console.log("Deleting service:", id);
      await api.delete(`/services/${id}`);
      setServices(prev => prev.filter(s => s.id !== id));
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "تم حذف الخدمة بنجاح" });
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast({ 
        title: "خطأ في الحذف", 
        description: error.response?.data?.message || "تعذر الاتصال بالخادم", 
        variant: "destructive" 
      });
    }
  };

  const restoreDefaultServices = async () => {
    const hasExisting = services.length > 0;
    const confirmMsg = hasExisting 
      ? "سيتم حذف جميع الخدمات الحالية واستعادة الخدمات الأساسية الأربعة. هل أنت متأكد؟" 
      : "سيتم استعادة الخدمات الأساسية الأربعة بجميع تفرعاتها. هل أنت متأكد؟";

    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      // If there are existing services, clear them first
      if (hasExisting) {
        for (const s of services) {
          await api.delete(`/services/${s.id}`);
        }
      }

      const defaults = [
        {
          title: "اللحوم والدواجن والمجمدات",
          title_en: "Meat, Poultry & Frozen Foods",
          description: "أجود أنواع اللحوم البرازيلية والدواجن المجمدة، مع تشكيلة واسعة من الأسماك ومقطعات الدجاج المجهزة بعناية لتلبية كافة احتياجات التموين.",
          description_en: "Premium Brazilian meat and frozen poultry, offering a wide range of fish and carefully processed chicken parts for all catering needs.",
          sort_order: 1,
          is_active: true,
          sub_services: [
            { id: crypto.randomUUID(), name: { ar: "لحم بقري برازيلي", en: "Brazilian Beef" } },
            { id: crypto.randomUUID(), name: { ar: "لحم بقري هندي", en: "Indian Beef" } },
            { id: crypto.randomUUID(), name: { ar: "دجاج مجمد كامل", en: "Whole Frozen Chicken" } },
            { id: crypto.randomUUID(), name: { ar: "مقطعات دجاج (صدور، أوراك)", en: "Chicken Parts (Breasts, Thighs)" } },
            { id: crypto.randomUUID(), name: { ar: "أسماك مجمدة", en: "Frozen Fish" } },
          ]
        },
        {
          title: "التخزين المبرد والمجمد",
          title_en: "Cold & Frozen Storage",
          description: "مساحات تخزين حديثة ومجهزة بأحدث التقنيات لضمان الحفاظ على المنتجات الغذائية في درجات حرارة مثالية سواء للتبريد أو التجميد.",
          description_en: "Modern storage spaces equipped with the highest tech to ensure food preservation at optimal temperatures for freezing or cooling.",
          sort_order: 2,
          is_active: true,
          sub_services: [
            { id: crypto.randomUUID(), name: { ar: "تخزين مبرد (0 إلى 4 درجة)", en: "Cold Storage (0 to 4 °C)" } },
            { id: crypto.randomUUID(), name: { ar: "تخزين مجمد (-18 درجة فأقل)", en: "Freezing Storage (-18 °C and below)" } },
            { id: crypto.randomUUID(), name: { ar: "تخزين جاف", en: "Dry Storage" } },
          ]
        },
        {
          title: "المنتجات البلاستيكية والتغليف",
          title_en: "Plastics & Packaging",
          description: "مجموعة متكاملة من المنتجات البلاستيكية الآمنة غذائياً وأدوات التغليف التي تضمن سلامة منتجاتكم المعبأة والمحفوظة.",
          description_en: "A comprehensive range of food-grade plastics and packaging materials ensuring the safety of your packaged goods.",
          sort_order: 3,
          is_active: true,
          sub_services: [
            { id: crypto.randomUUID(), name: { ar: "أكياس بلاستيكية للتعبئة", en: "Plastic Packaging Bags" } },
            { id: crypto.randomUUID(), name: { ar: "رولات ومواد تغليف", en: "Wrapping Rolls" } },
            { id: crypto.randomUUID(), name: { ar: "علب وحوافظ بلاستيكية", en: "Plastic Containers" } },
          ]
        },
        {
          title: "الإعاشة والتموين الشامل",
          title_en: "Comprehensive Catering",
          description: "خدمات تموين متكاملة ومصممة خصيصاً للشركات والمستشفيات والفنادق، مدعومة بمعايير جودة صارمة وجاهزية لا مثيل لها.",
          description_en: "Complete catering services tailored for corporates, hospitals, and hotels, backed by rigorous quality standards.",
          sort_order: 4,
          is_active: true,
          sub_services: [
            { id: crypto.randomUUID(), name: { ar: "إعاشة شركات ومصانع", en: "Corporate & Factory Catering" } },
            { id: crypto.randomUUID(), name: { ar: "توريدات مستشفيات", en: "Hospitals Supplies" } },
            { id: crypto.randomUUID(), name: { ar: "تموين فنادق ومطاعم", en: "Hotels & Restaurants Supply" } },
          ]
        }
      ];

      for (const item of defaults) {
        await api.post("/services", item);
      }
      
      toast({ title: "تم استعادة الخدمات الأساسية بنجاح" });
      await fetchServices();
      queryClient.invalidateQueries({ queryKey: ["services"] });
    } catch (error: any) {
      toast({ title: "حدث خطأ", description: error.response?.data?.message || error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addSubService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              sub_services: [
                ...(s.sub_services || []),
                { id: crypto.randomUUID(), name: { ar: "خدمة فرعية", en: "Sub Service" } },
              ],
            }
          : s
      )
    );
  };

  const updateSubService = (serviceId: string, subId: string, lang: "ar" | "en", value: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              sub_services: (s.sub_services || []).map((sub) =>
                sub.id === subId ? { ...sub, name: { ...sub.name, [lang]: value } } : sub
              ),
            }
          : s
      )
    );
  };

  const removeSubService = (serviceId: string, subId: string) => {
    console.log("Removing subservice:", subId, "from service:", serviceId);
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              sub_services: (s.sub_services || []).filter((sub) => sub.id !== subId),
            }
          : s
      )
    );
    toast({ title: "تمت إزالة الخدمة الفرعية (لا تنسى حفظ التعديلات)" });
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-dark to-gold-medium dark:from-gold-medium dark:to-gold-pale">{t("admin_services_title")}</h2>
        <div className="flex items-center gap-2">
          <Button onClick={restoreDefaultServices} variant="outline" className="text-gold-dark border-gold-medium hover:bg-gold-pale/10">
            <Plus className="w-4 h-4 me-2" /> {t("admin_services_restore")}
          </Button>
          <Button onClick={addService} className="gradient-gold text-primary-foreground">
            <Plus className="w-4 h-4 me-2" /> {t("admin_services_add")}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div 
            key={service.id} 
            id={`service-${service.id}`}
            className={`bg-card border rounded-2xl p-6 space-y-4 transition-all duration-500 ${newlyAddedId === service.id ? 'border-gold-medium ring-2 ring-gold-medium/20 shadow-lg scale-[1.01]' : 'border-border/60 hover:border-gold-light shadow-sm'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">#{service.sort_order}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  type="button"
                  variant={service.is_active ? "default" : "outline"} 
                  size="sm" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateService(service.id, { is_active: !service.is_active });
                  }}
                  className={`h-8 gap-1.5 transition-all duration-300 ${service.is_active ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : 'text-muted-foreground border-border/50 hover:text-foreground'}`}
                  title={service.is_active ? t("admin_services_draft") : t("admin_services_published")}
                >
                  {service.is_active ? (
                    <>
                      <Eye className="w-3.5 h-3.5 pointer-events-none" />
                      <span className="text-xs font-bold pointer-events-none">{t("admin_services_published")}</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 pointer-events-none" />
                      <span className="text-xs pointer-events-none">{t("admin_services_draft")}</span>
                    </>
                  )}
                </Button>
                <div className="w-px h-4 bg-border/50 mx-1"></div>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Trash clicked for service:", service.id);
                    deleteService(service.id);
                  }} 
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive z-10"
                >
                  <Trash2 className="w-4 h-4 pointer-events-none" />
                </Button>
              </div>
            </div>
            <div>
              <Label>{t("admin_services_label_title")}</Label>
              <Input value={service.title} onChange={e => setServices(prev => prev.map(s => s.id === service.id ? { ...s, title: e.target.value } : s))} />
            </div>
            <div>
              <Label>{t("admin_services_label_title")} (English)</Label>
              <Input value={service.title_en || ""} onChange={e => setServices(prev => prev.map(s => s.id === service.id ? { ...s, title_en: e.target.value } : s))} dir="ltr" />
            </div>
            <div>
              <Label>{t("admin_services_label_desc")}</Label>
              <Textarea value={service.description} onChange={e => setServices(prev => prev.map(s => s.id === service.id ? { ...s, description: e.target.value } : s))} rows={2} />
            </div>
            <div>
              <Label>{t("admin_services_label_desc")} (English)</Label>
              <Textarea value={service.description_en || ""} onChange={e => setServices(prev => prev.map(s => s.id === service.id ? { ...s, description_en: e.target.value } : s))} rows={2} dir="ltr" />
            </div>
            <div>
              <Label>{t("admin_services_label_image")}</Label>
              <Input value={service.image_url || ""} onChange={e => setServices(prev => prev.map(s => s.id === service.id ? { ...s, image_url: e.target.value } : s))} dir="ltr" placeholder="https://..." />
            </div>

            <div className="pt-4 border-t border-border/30">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-bold text-foreground">{t("admin_services_label_subs")}</Label>
                <Button variant="outline" size="sm" onClick={() => addSubService(service.id)} className="border-gold-medium/30 hover:bg-gold-pale/10">
                  <Plus className="w-3 h-3 me-1" /> {t("admin_services_add_sub")}
                </Button>
              </div>
              <div className="space-y-2">
                {(!service.sub_services || service.sub_services.length === 0) && (
                  <p className="text-xs text-muted-foreground">{t("admin_services_no_subs")}</p>
                )}
                {(service.sub_services || []).map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2 bg-background p-2 rounded border border-border">
                    <Input 
                      className="h-8 text-xs" 
                      placeholder="عربي" 
                      value={sub.name.ar} 
                      onChange={(e) => updateSubService(service.id, sub.id, "ar", e.target.value)} 
                    />
                    <Input 
                      className="h-8 text-xs" 
                      placeholder="English" 
                      dir="ltr" 
                      value={sub.name.en} 
                      onChange={(e) => updateSubService(service.id, sub.id, "en", e.target.value)} 
                    />
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive shrink-0 hover:bg-destructive/10" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Trash clicked for subservice:", sub.id);
                        removeSubService(service.id, sub.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3 pointer-events-none" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full gradient-gold" onClick={() => updateService(service.id, { 
                title: service.title, 
                description: service.description, 
                title_en: service.title_en, 
                description_en: service.description_en, 
                image_url: service.image_url,
                sub_services: service.sub_services 
              })}>
                <Save className="w-4 h-4 me-2" /> {t("admin_services_save_all")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;
