import { useForm, Link, Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Sun, Moon, Globe, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/hooks/useLanguage";
import logo from "@/assets/logopng.png";

const AdminLogin = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, direction } = useLanguage();

  const { data, setData, post, processing, clearErrors } = useForm({
    email: '',
    password: '',
    remember: true,
  });

  const updateField = (field: 'email' | 'password', value: string) => {
    setData(field, value);
    clearErrors(field);
  };

  const getFirstErrorMessage = (errors: Record<string, string | string[]>) => {
    const firstError = Object.values(errors)[0];

    if (Array.isArray(firstError)) {
      return firstError[0];
    }

    return firstError;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('login'), {
      onSuccess: () => {
        toast({ title: t("success") || "تم تسجيل الدخول" });
      },
      onError: (err) => {
        const errorMsg = getFirstErrorMessage(err) || t("invalid_credentials") || "خطأ في تسجيل الدخول";

        toast({ 
          title: t("error") || "خطأ", 
          description: errorMsg, 
          variant: "destructive",
          duration: 5000,
          className: "border-0 bg-[#991b1b] text-white shadow-2xl [&>button]:text-white/80 [&>button]:hover:text-white",
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-500 relative overflow-hidden" dir={direction}>
      <Head title={t("admin_dashboard") || "Login"} />
      
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-medium/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-pale/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-sm bg-card rounded-3xl p-8 shadow-2xl border border-gold-light/20 backdrop-blur-sm relative z-10">
        {/* controls */}
        <div className={`absolute top-6 ${direction === 'rtl' ? 'left-6' : 'right-6'} flex gap-2`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-xl border border-border/50 bg-background/50 hover:bg-gold-pale/20 transition-all"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="h-9 w-auto px-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-gold-pale/20 transition-all flex items-center gap-1.5"
          >
            <Globe className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{language === "ar" ? "EN" : "ع"}</span>
          </Button>
        </div>

        <div className="text-center mb-8 pt-4">
          <img src={logo} alt="مجموعة فرسان" className="h-20 mx-auto mb-4 object-contain" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-dark via-gold-medium to-gold-dark">
            {t("admin_dashboard") || "لوحة التحكم"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("admin_login_subtitle") || "تسجيل دخول المسؤول"}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("admin_email")}</Label>
            <Input 
              id="email" 
              type="email" 
              value={data.email} 
              onChange={e => updateField('email', e.target.value)} 
              required 
              dir="ltr" 
            />
          </div>
          <div>
            <Label htmlFor="password">{t("admin_password")}</Label>
            <Input 
              id="password" 
              type="password" 
              value={data.password} 
              onChange={e => updateField('password', e.target.value)} 
              required 
              dir="ltr"
            />
          </div>
          
          <Button type="submit" className="w-full gradient-gold text-primary-foreground" disabled={processing}>
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {processing ? t("admin_saving") : t("admin_signin")}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/admin/forgot" className="font-medium text-gold-dark hover:text-gold-medium">
            {t("admin_forgot")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
