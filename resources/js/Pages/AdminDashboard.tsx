import { useEffect, useState } from "react";
import { router, Head, usePage } from "@inertiajs/react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Button } from "@/Components/ui/button";
import { LogOut, Settings, Package, MessageSquare, Home, Users, Sun, Moon, Key } from "lucide-react";
import AdminSettings from "@/Components/admin/AdminSettings";
import AdminServices from "@/Components/admin/AdminServices";
import AdminMessages from "@/Components/admin/AdminMessages";
import AdminContent from "@/Components/admin/AdminContent";
import AdminUsers from "@/Components/admin/AdminUsers";
import AdminLoading from "@/Components/admin/AdminLoading";
import { useLanguage } from "@/hooks/useLanguage";
import logo from "@/assets/logopng.png";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

const AdminDashboard = () => {
  const { user, loading, isAdmin, isModerator, userRole, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, direction } = useLanguage();

  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passDialogOpen, setPassDialogOpen] = useState(false);
  
  // Define default tab based on role
  const getDefaultTab = () => {
    if (isAdmin) return "content";
    if (userRole === "services_manager") return "services";
    if (userRole === "operations_manager") return "services";
    return "messages";
  };

  const [activeTab, setActiveTab] = useState("messages");

  useEffect(() => {
    if (userRole || isAdmin) {
      setActiveTab(getDefaultTab());
    }
  }, [userRole, isAdmin]);

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: t("error"), description: t("password_too_short") || "كلمة المرور قصيرة جداً", variant: "destructive" });
      return;
    }

    setUpdatingPassword(true);
    try {
      await api.put("/update-password", { password: newPassword });
      toast({ title: t("success"), description: t("password_updated_successfully") });
      setPassDialogOpen(false);
      setNewPassword("");
    } catch (error: any) {
      toast({ title: t("error"), description: error.response?.data?.message || t("failed_to_update_password"), variant: "destructive" });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const canSee = (tab: string) => {
    if (isAdmin) return true;
    if (tab === "messages") return ["moderator", "operations_manager", "messages_moderator"].includes(userRole || "");
    if (tab === "services") return ["services_manager", "operations_manager"].includes(userRole || "");
    return false;
  };

  if (!user && !loading) {
    router.get(route('admin.login'));
    return null;
  }

  if (loading) return <AdminLoading fullScreen />;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500" dir={direction}>
      <Head title={t("admin_dashboard") || "Admin Dashboard"} />
      
      <header className="bg-card/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/50 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-gold-pale/10 dark:bg-gold-medium/20 backdrop-blur-md rounded-xl border border-gold-medium/30 shadow-lg shadow-gold-medium/5 relative group transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gold-medium/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img src={logo} alt="مجموعة فرسان" className="relative h-9 w-auto object-contain drop-shadow-sm" />
          </div>
          <h1 className="text-lg font-bold gradient-gold-text">{t("admin_dashboard") || "لوحة التحكم"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground h-9 w-9 rounded-full"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="text-muted-foreground h-9 w-9 rounded-full px-0 flex items-center justify-center font-bold text-xs"
          >
            {language === "ar" ? "EN" : "ع"}
          </Button>

          <div className="w-px h-6 bg-border mx-1 hidden md:block"></div>

          <Dialog open={passDialogOpen} onOpenChange={setPassDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9 rounded-full" title={t("update_password")}>
                <Key className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("change_password_title")}</DialogTitle>
                <DialogDescription>{t("change_password_desc")}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="new-pass-dash">{t("new_password")}</Label>
                <Input
                  id="new-pass-dash"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  dir="ltr"
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleUpdatePassword} disabled={updatingPassword} className="w-full gradient-gold text-primary-foreground">
                  {updatingPassword ? t("saving") : t("update_password")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="sm" onClick={() => router.get("/")} className="text-muted-foreground gap-1.5">
            <Home className="w-4 h-4" /> <span className="hidden md:inline">{t("nav_home")}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground gap-1.5">
            <LogOut className="w-4 h-4" /> <span className="hidden md:inline">{t("admin_logout_btn")}</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} dir={direction}>
          <TabsList className={`grid w-full mb-6 ${isAdmin ? "grid-cols-5" : canSee("services") && canSee("messages") ? "grid-cols-2" : "grid-cols-1 max-w-xs mx-auto"}`}>
            {canSee("content") && (
              <TabsTrigger value="content" className="flex items-center gap-1 text-xs md:text-sm">
                <Home className="w-4 h-4" /> {t("admin_content")}
              </TabsTrigger>
            )}
            {canSee("services") && (
              <TabsTrigger value="services" className="flex items-center gap-1 text-xs md:text-sm">
                <Package className="w-4 h-4" /> {t("admin_services")}
              </TabsTrigger>
            )}
            {canSee("messages") && (
              <TabsTrigger value="messages" className="flex items-center gap-1 text-xs md:text-sm">
                <MessageSquare className="w-4 h-4" /> {t("admin_messages")}
              </TabsTrigger>
            )}
            {canSee("users") && (
              <TabsTrigger value="users" className="flex items-center gap-1 text-xs md:text-sm">
                <Users className="w-4 h-4" /> {t("admin_users")}
              </TabsTrigger>
            )}
            {canSee("settings") && (
              <TabsTrigger value="settings" className="flex items-center gap-1 text-xs md:text-sm">
                <Settings className="w-4 h-4" /> {t("admin_settings")}
              </TabsTrigger>
            )}
          </TabsList>

          {canSee("content") && <TabsContent value="content"><AdminContent /></TabsContent>}
          {canSee("services") && <TabsContent value="services"><AdminServices /></TabsContent>}
          {canSee("users") && <TabsContent value="users"><AdminUsers /></TabsContent>}
          {canSee("settings") && <TabsContent value="settings"><AdminSettings /></TabsContent>}
          {canSee("messages") && <TabsContent value="messages"><AdminMessages /></TabsContent>}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
