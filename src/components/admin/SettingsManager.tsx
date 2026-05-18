import { useState } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, Sun, Moon, MessageCircle, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";
import { useStore, THEME_PRESETS, THEME_PRESET_SWATCH, type ThemePreset, type ThemeMode } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SettingsManager() {
  const { t, lang } = useI18n();
  const { settings, updateSettings } = useStore();
  const [logoText, setLogoText] = useState(settings.logoText);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl ?? "");
  const [whatsapp, setWhatsapp] = useState(settings.whatsappNumber ?? "");
  const [popupActive, setPopupActive] = useState(!!settings.popupActive);
  const [popupTitleAr, setPopupTitleAr] = useState(settings.popupTitleAr ?? "");
  const [popupTitleEn, setPopupTitleEn] = useState(settings.popupTitleEn ?? "");
  const [popupTextAr, setPopupTextAr] = useState(settings.popupTextAr ?? "");
  const [popupTextEn, setPopupTextEn] = useState(settings.popupTextEn ?? "");

  const save = () => {
    updateSettings({ logoText: logoText.trim() || "MOVANA", logoUrl: logoUrl.trim() || undefined });
    toast.success(t("saved"));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t("admin_settings")}</h2>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <ImageIcon className="size-4 text-primary" />
          {t("site_logo")}
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-muted-foreground mb-1 block">{t("logo_text")}</span>
            <Input value={logoText} onChange={(e) => setLogoText(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground mb-1 block">{t("logo_url")}</span>
            <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
          </label>
        </div>
        <div className="rounded-lg bg-input p-4 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{t("preview")}:</span>
          {logoUrl && <img src={logoUrl} alt="logo" className="h-10 w-auto object-contain" />}
          <span className="font-display text-2xl tracking-wider text-primary">{logoText || "MOVANA"}</span>
        </div>
        <Button className="gradient-red" onClick={save}>{t("save")}</Button>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <MessageCircle className="size-4 text-primary" />
          {lang === "ar" ? "رقم واتساب للتواصل" : "WhatsApp contact number"}
        </h3>
        <Input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="+967xxxxxxxxx"
          dir="ltr"
        />
        <p className="text-xs text-muted-foreground">
          {lang === "ar" ? "أدخل الرقم بصيغة دولية مع رمز الدولة." : "Use international format including country code."}
        </p>
        <Button
          className="gradient-red"
          onClick={() => { updateSettings({ whatsappNumber: whatsapp.trim() || undefined }); toast.success(t("saved")); }}
        >
          {t("save")}
        </Button>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <Megaphone className="size-4 text-primary" />
          {lang === "ar" ? "نافذة الترحيب المنبثقة" : "Welcome popup"}
        </h3>
        <label className="flex items-center justify-between gap-3 rounded-md bg-white/5 px-3 py-2">
          <span className="text-sm">{lang === "ar" ? "إظهار النافذة" : "Show popup"}</span>
          <Switch checked={popupActive} onCheckedChange={setPopupActive} />
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-muted-foreground mb-1 block">{lang === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</span>
            <Input value={popupTitleAr} onChange={(e) => setPopupTitleAr(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground mb-1 block">{lang === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</span>
            <Input value={popupTitleEn} onChange={(e) => setPopupTitleEn(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground mb-1 block">{lang === "ar" ? "النص (عربي)" : "Text (Arabic)"}</span>
            <Textarea rows={4} value={popupTextAr} onChange={(e) => setPopupTextAr(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground mb-1 block">{lang === "ar" ? "النص (إنجليزي)" : "Text (English)"}</span>
            <Textarea rows={4} value={popupTextEn} onChange={(e) => setPopupTextEn(e.target.value)} />
          </label>
        </div>
        <Button
          className="gradient-red"
          onClick={() => {
            updateSettings({
              popupActive,
              popupTitleAr: popupTitleAr.trim() || undefined,
              popupTitleEn: popupTitleEn.trim() || undefined,
              popupTextAr: popupTextAr.trim() || undefined,
              popupTextEn: popupTextEn.trim() || undefined,
            });
            toast.success(t("saved"));
          }}
        >
          {t("save")}
        </Button>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h3 className="font-bold">{t("theme_preset")}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {THEME_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => { updateSettings({ themePreset: p as ThemePreset }); toast.success(t("saved")); }}
              className={cn(
                "rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition",
                settings.themePreset === p ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-primary/50"
              )}
            >
              <span className="size-10 rounded-full" style={{ background: THEME_PRESET_SWATCH[p] }} />
              <span className="text-xs capitalize">{p}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h3 className="font-bold">{t("theme_mode")}</h3>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {(["dark", "light"] as ThemeMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { updateSettings({ themeMode: m }); toast.success(t("saved")); }}
              className={cn(
                "rounded-xl border-2 p-4 flex items-center justify-center gap-2 transition",
                settings.themeMode === m ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              )}
            >
              {m === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              <span className="text-sm font-bold">{m === "dark" ? t("theme_dark") : t("theme_light")}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {lang === "ar" ? "تطبق التغييرات فوراً على كامل الموقع." : "Changes apply instantly across the site."}
        </p>
      </div>
    </div>
  );
}
