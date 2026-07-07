import { useTranslations } from "next-intl";

export function AnnouncementBar() {
  const t = useTranslations("announcementBar");
  return (
    <div className="bg-foreground text-background px-4 py-2 text-center text-xs font-medium tracking-wide">
      {t("text")}
    </div>
  );
}
