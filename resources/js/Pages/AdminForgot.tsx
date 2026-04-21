import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logopng.png";

const AdminForgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { language, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Placeholder as Laravel email reset requires SMTP configuration
    setTimeout(() => {
      setLoading(false);
      toast({
        title: t("error"),
        description: "يرجى التواصل مع مسؤول النظام لإعادة تعيين كلمة المرور.",
        variant: "destructive"
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Head title={t("admin_forgot") || "Forgot Password"} />
      
      <div className="w-full max-w-sm bg-card rounded-[2rem] p-8 shadow-gold border border-gold-light/20 backdrop-blur-sm relative z-10">
        <div className="text-center mb-8">
          <img src={logo} alt="مجموعة فرسان" className="h-20 mx-auto mb-4 object-contain" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-dark via-gold-medium to-gold-dark">
            {t("admin_forgot") || "نسيت كلمة المرور"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("admin_login_subtitle") || "تسجيل دخول المسؤول"}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("admin_email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full gradient-gold text-primary-foreground" disabled={loading}>
            {loading ? t("admin_saving") : t("admin_forgot")}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href={route("admin.login")} className="font-medium text-gold-dark hover:text-gold-medium">
             {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminForgot;
