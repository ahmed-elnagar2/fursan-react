import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ArrowUpRight, Moon, Sun } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "next-themes";
import { Button } from "@/Components/ui/button";
import logoPng from "@/assets/logopng.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t, direction } = useLanguage();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { label: t("nav_home"), href: "/#hero", key: "nav_home" },
    { label: t("nav_about"), href: "/#about", key: "nav_about" },
    { label: t("nav_services"), href: "/#services", key: "nav_services" },
    { label: t("nav_contact"), href: "/#contact", key: "nav_contact" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5" dir={direction}>
      <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-gold-medium/20 bg-gradient-to-r from-gold-medium/10 via-background/60 to-gold-light/15 backdrop-blur-xl shadow-gold overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
          <a
            href="/#hero"
            className="flex items-center rounded-[1.25rem] border border-gold-medium/20 bg-background/40 px-3 py-2 shadow-sm transition hover:bg-gold-pale/50 backdrop-blur-md"
          >
            <img src={logoPng} alt="Forsan Group" className="h-14 w-auto object-contain" />
          </a>

          <div className="hidden xl:flex flex-1 justify-center px-6">
            <div className="flex items-center gap-2 rounded-full border border-gold-medium/20 bg-background/40 px-2 py-2 backdrop-blur-md">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors duration-200 hover:bg-gold-pale hover:text-gold-dark"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-11 w-11 rounded-full border border-border bg-background text-foreground shadow-sm hover:bg-muted"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="h-11 rounded-full border border-border bg-background px-4 text-foreground shadow-sm hover:bg-muted"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-semibold">{language === "ar" ? "EN" : "ع"}</span>
            </Button>

            <Link
              href="/quote-request"
              className="hidden xl:inline-flex items-center gap-2 rounded-full gradient-gold px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              {t("nav_quote_request")}
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold-medium/20 bg-background/40 text-foreground shadow-sm transition hover:bg-gold-pale/50 backdrop-blur-md xl:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden px-4 pb-4"
            >
              <div className="rounded-[1.25rem] border border-gold-medium/20 bg-gradient-to-b from-background/90 to-background/95 p-3 shadow-gold backdrop-blur-xl">
                <ul className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        className="block rounded-xl px-4 py-3 text-sm font-semibold text-charcoal transition-colors duration-200 hover:bg-gold-pale hover:text-gold-dark"
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                  <li className="pt-2">
                    <Link
                      href="/quote-request"
                      className="flex items-center justify-center gap-2 rounded-xl gradient-gold px-4 py-3 text-sm font-semibold text-white"
                      onClick={() => setOpen(false)}
                    >
                      {t("nav_quote_request")}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
