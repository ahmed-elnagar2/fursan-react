import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 gradient-gold text-center">
      <p className="text-primary-foreground text-sm">
        © {new Date().getFullYear()} {t("footer_copyright")}
      </p>
    </footer>
  );
};

export default Footer;
