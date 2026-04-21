import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/Components/ui/button";
import { toast } from "@/hooks/use-toast";
import AdminLoading from "./AdminLoading";
import { useLanguage } from "@/hooks/useLanguage";
import { Mail, Trash2, Eye, EyeOff, Phone, Calendar, User, MessageSquare, Building2 } from "lucide-react";
import { Badge } from "@/Components/ui/badge";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company?: string | null;
  services?: any[] | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const parseLegacyMessage = (rawText: string) => {
  let company = null;
  let services: string[] = [];
  let message = rawText;

  // Extract from Arabic format
  if (rawText.includes("الخدمات المطلوبة: ")) {
    const parts = rawText.split("الخدمات المطلوبة: ");
    const lines = parts[1].split("\n");
    const servicesLine = lines[0];
    services = servicesLine.split(" | ").map(s => s.trim()).filter(Boolean);
    message = rawText.replace(`الخدمات المطلوبة: ${servicesLine}`, "").trim();
  }

  if (message.includes("اسم الشركة: ")) {
    const parts = message.split("اسم الشركة: ");
    const lines = parts[1].split("\n");
    const companyLine = lines[0];
    company = companyLine.trim();
    message = message.replace(`اسم الشركة: ${companyLine}`, "").trim();
  }

  if (message.includes("تفاصيل المشروع: ")) {
    message = message.replace("تفاصيل المشروع: ", "").trim();
  }

  // Extract from English format
  if (message.includes("Requested Services: ")) {
    const parts = message.split("Requested Services: ");
    const lines = parts[1].split("\n");
    services = lines[0].split(" | ").map(s => s.trim()).filter(Boolean);
    message = message.replace(`Requested Services: ${lines[0]}`, "").trim();
  }
  
  if (message.includes("Company Name: ")) {
    const parts = message.split("Company Name: ");
    const lines = parts[1].split("\n");
    company = lines[0].trim();
    message = message.replace(`Company Name: ${lines[0]}`, "").trim();
  }

  if (message.includes("Project Details: ")) {
    message = message.replace("Project Details: ", "").trim();
  }

  return { company, services, message: message.trim() };
};

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/messages");
      setMessages(data || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      // Small artificial delay to let the beautiful animation be seen
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (id: string, current: boolean) => {
    try {
      await api.put(`/messages/${id}`, { is_read: !current });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: !current } : m));
    } catch (error) {
      console.error("Failed to toggle read status:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await api.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
      toast({ title: t("admin_delete") || "تم حذف الرسالة" });
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-pale/30 flex items-center justify-center text-gold-dark">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold gradient-gold-text">{t("admin_messages_title")}</h2>
            <p className="text-sm text-muted-foreground">{t("admin_messages_subtitle")}</p>
          </div>
        </div>
        {unreadCount > 0 && <Badge className="gradient-gold text-primary-foreground shadow-sm shadow-gold-medium/20 text-sm py-1 px-3">{unreadCount} {t("admin_messages_new_badge")}</Badge>}
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 bg-card border rounded-2xl border-dashed">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>
          <p className="text-lg font-medium text-foreground">{t("admin_messages_empty")}</p>
          <p className="text-sm text-muted-foreground mt-1">{t("admin_messages_empty_subtitle")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((rawMsg) => {
            const legacyParsed = (!rawMsg.services && !rawMsg.company && (rawMsg.message.includes("الخدمات المطلوبة:") || rawMsg.message.includes("Requested Services:"))) 
              ? parseLegacyMessage(rawMsg.message) 
              : { company: rawMsg.company, services: rawMsg.services, message: rawMsg.message };
            
            const msg = { ...rawMsg, ...legacyParsed };

            return (
              <div 
                key={msg.id} 
                className={`group relative bg-card rounded-2xl p-5 md:p-6 shadow-sm transition-all hover:shadow-md overflow-hidden border
                  ${msg.is_read 
                    ? "border-border/40 opacity-80" 
                    : "border-gold-medium/30 ring-1 ring-gold-medium/10 bg-gold-pale/5 dark:bg-gold-medium/5"
                  }`}
              >
                {!msg.is_read && (
                  <div className="absolute top-0 start-0 w-1.5 h-full bg-gold-medium"></div>
                )}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                  <div className="flex-1 space-y-4 min-w-0">
                  <div className="flex items-center justify-between md:justify-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${msg.is_read ? 'bg-muted text-muted-foreground' : 'bg-gold-pale/50 text-gold-dark'}`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-foreground flex items-center gap-2 truncate">
                          {msg.name}
                          {!msg.is_read && <Badge className="bg-gold-medium hover:bg-gold-dark text-white text-[10px] px-1.5 py-0 h-4 shadow-sm">{t("admin_messages_new_badge")}</Badge>}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground gap-1.5 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span dir="ltr">{new Date(msg.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a href={`mailto:${msg.email}`} className="inline-flex items-center gap-2 text-sm bg-muted/20 hover:bg-gold-pale/20 text-foreground px-3.5 py-2 rounded-xl transition-colors border border-border/50" dir="ltr">
                      <Mail className="w-4 h-4 text-gold-dark/80" />
                      <span className="truncate max-w-[200px] md:max-w-none">{msg.email}</span>
                    </a>
                    {msg.phone && (
                      <a href={`tel:${msg.phone}`} className="inline-flex items-center gap-2 text-sm bg-muted/20 hover:bg-gold-pale/20 text-foreground px-3.5 py-2 rounded-xl transition-colors border border-border/50" dir="ltr">
                        <Phone className="w-4 h-4 text-gold-dark/80" />
                        <span>{msg.phone}</span>
                      </a>
                    )}
                    {msg.company && (
                      <div className="inline-flex items-center gap-2 text-sm bg-gold-pale/10 text-foreground px-3.5 py-2 rounded-xl border border-gold-medium/30" title={t("quote_company_name")}>
                        <Building2 className="w-4 h-4 text-gold-dark" />
                        <span className="font-bold">{msg.company}</span>
                      </div>
                    )}
                  </div>

                  {msg.services && msg.services.length > 0 && (
                    <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground/60 uppercase tracking-wider">
                        <div className="h-px flex-1 bg-border/50"></div>
                        <span>{t("admin_messages_requested")}</span>
                        <div className="h-px flex-1 bg-border/50"></div>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        {msg.services.map((svc: any, i: number) => {
                          const isObject = typeof svc === 'object' && svc !== null;
                          const name = isObject ? svc.name : svc;
                          const quantity = isObject ? svc.quantity : 1;
                          const subServices = isObject ? svc.subServices : [];
                          const hasStorage = isObject && (svc.storageSpace !== undefined || svc.storageUnits !== undefined);

                          return (
                            <div key={i} className="flex flex-col gap-1.5 p-3 rounded-xl bg-background border border-gold-light/30 shadow-sm transition-all hover:border-gold-medium/50 group/svc">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-gold-medium group-hover/svc:scale-125 transition-transform"></div>
                                  <span className="text-[14px] font-bold text-foreground">{name}</span>
                                  {quantity > 1 && (
                                    <Badge variant="outline" className="text-gold-dark border-gold-medium/30 bg-gold-pale/30">
                                      x{quantity}
                                    </Badge>
                                  )}
                                </div>
                                {hasStorage && (
                                  <div className="flex items-center gap-2">
                                     <span className="text-[10px] uppercase tracking-tighter font-bold bg-muted px-2 py-1 rounded-md text-muted-foreground border border-border/50">
                                       {svc.storageSpace} م² | {svc.storageUnits} وحدة
                                     </span>
                                  </div>
                                )}
                              </div>
                              
                              {subServices && subServices.length > 0 && (
                                <div className="flex flex-col gap-2 ps-4 mt-1">
                                  {subServices.map((sub: any, index: number) => {
                                    const isSubObj = typeof sub === 'object' && sub !== null;
                                    const subName = isSubObj ? sub.name : sub;
                                    const subQty = isSubObj ? sub.quantity : 1;
                                    const subSpace = isSubObj ? sub.storageSpace : 0;
                                    const subUnits = isSubObj ? sub.storageUnits : 0;
                                    const subHasStorage = isSubObj && (subSpace > 0 || subUnits > 0);

                                    return (
                                      <div key={index} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                           <span className="text-[12px] px-2.5 py-0.5 rounded-md bg-muted/50 text-muted-foreground border border-border/40 flex items-center gap-2">
                                              <span className="w-1 h-1 rounded-full bg-gold-medium/60"></span>
                                              <span className="font-medium">{subName}</span>
                                              {subQty > 1 && (
                                                <Badge variant="outline" className="h-4 text-[10px] px-1 bg-gold-pale/40 border-gold-medium/20 text-gold-dark">
                                                  x{subQty}
                                                </Badge>
                                              )}
                                           </span>
                                        </div>
                                        {subHasStorage && (
                                          <div className="flex gap-2 ps-3">
                                            {subSpace > 0 && (
                                              <span className="text-[10px] font-bold text-gold-dark/80 bg-gold-pale/20 px-2 py-0.5 rounded-md border border-gold-medium/10">
                                                {subSpace} م²
                                              </span>
                                            )}
                                            {subUnits > 0 && (
                                              <span className="text-[10px] font-bold text-gold-dark/80 bg-gold-pale/20 px-2 py-0.5 rounded-md border border-gold-medium/10">
                                                {subUnits} وحدة
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {msg.message && msg.message.trim() !== "" && msg.message !== "لا توجد رسالة مرفقة." && msg.message !== "No attached message or project details." && msg.message !== "لا توجد رسالة مرفقة أو تفاصيل للمشروع." && (
                    <div className="bg-muted/30 p-4 rounded-xl border border-border/30 relative mt-2">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex bg-muted/40 rounded-xl p-1 shrink-0 md:flex-col gap-1 border border-border/40 md:w-auto w-full justify-end">
                  <Button variant="ghost" size="sm" onClick={() => toggleRead(msg.id, msg.is_read)} title={msg.is_read ? t("admin_messages_unread") : t("admin_messages_read")} className={`h-9 w-9 p-0 rounded-lg ${msg.is_read ? 'text-muted-foreground hover:text-foreground hover:bg-background' : 'text-gold-dark hover:text-gold-dark/90 bg-gold-pale/30 hover:bg-gold-pale/50'}`}>
                    {msg.is_read ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMessage(msg.id)} title="حذف الرسالة" className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4.5 h-4.5" />
                  </Button>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
