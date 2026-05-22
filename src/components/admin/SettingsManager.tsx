import { useRef, useState } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, Sun, Moon, MessageCircle, Megaphone, Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";
import { useStore, THEME_PRESETS, THEME_PRESET_SWATCH, type ThemePreset, type ThemeMode, type LogoSize } from "@/lib/store";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export function SettingsManager() {
  const { t, lang } = useI18n();
  const { settings, updateSettings } = useStore();
  const [logoText, setLogoText] = useState(settings.logoText);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
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

  const optimizeImage = (file: File): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => { img.src = reader.result as string; };
      reader.onerror = reject;
      img.onload = () => {
        // Optimize to a max of 256px height (2x of XL=128). Preserves quality across all sizes.
        const targetH = Math.min(256, img.height);
        const ratio = img.width / img.height;
        const w = Math.round(targetH * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, targetH);
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Blob failed"))), "image/png", 0.92);
      };
      img.onerror = reject;
      reader.readAsDataURL(file);
    });

  const uploadLogo = async (file: File) => {
    setUploading(true);
    try {
      const blob = await optimizeImage(file);
      const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
      const { error } = await supabase.storage.from("series-images").upload(path, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/png",
      });
      if (error) throw error;
      const { data } = supabase.storage.from("series-images").getPublicUrl(path);
      setLogoUrl(data.publicUrl);
      updateSettings({ logoText: logoText.trim() || "MOVANA", logoUrl: data.publicUrl });
      toast.success(t("saved"));
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t("admin_settings")}</h2>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <ImageIcon className="size-4 text-primary" />
          {t("site_logo")}
        </h3>
        <p className="text-xs text-muted-foreground">
          {lang === "ar"
            ? "اختر إما صورة شعار أو نصاً. عند رفع صورة سيتم استخدامها بدلاً من النص."
            : "Use either an image logo or a text logo. If an image is set, it replaces the text."}
        </p>
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
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); e.target.value = ""; }}
          />
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="size-4 me-2 animate-spin" /> : <Upload className="size-4 me-2" />}
            {lang === "ar" ? "رفع صورة الشعار" : "Upload logo image"}
          </Button>
          {logoUrl && (
            <Button type="button" variant="ghost" onClick={() => { setLogoUrl(""); updateSettings({ logoText: logoText.trim() || "MOVANA", logoUrl: undefined }); toast.success(t("saved")); }}>
              <X className="size-4 me-2" />
              {lang === "ar" ? "إزالة الصورة" : "Remove image"}
            </Button>
          )}
        </div>
        <div>
          <span className="text-xs text-muted-foreground mb-2 block">
            {lang === "ar" ? "حجم الشعار" : "Logo size"}
          </span>
          <div className="grid grid-cols-4 gap-2">
            {(["sm", "md", "lg", "xl"] as LogoSize[]).map((sz) => {
              const labels: Record<LogoSize, { ar: string; en: string }> = {
                sm: { ar: "صغير", en: "Small" },
                md: { ar: "متوسط", en: "Medium" },
                lg: { ar: "كبير", en: "Large" },
                xl: { ar: "كبير جداً", en: "Extra Large" },
              };
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => { updateSettings({ logoSize: sz }); toast.success(t("saved")); }}
                  className={cn(
                    "rounded-md border-2 px-3 py-2 text-xs font-bold transition",
                    settings.logoSize === sz ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                  )}
                >
                  {lang === "ar" ? labels[sz].ar : labels[sz].en}
                </button>
              );
            })}
          </div>
        </div>
        <div className="rounded-lg bg-input p-4 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{t("preview")}:</span>
          <div className="flex items-center font-display text-2xl tracking-wider text-primary leading-none">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="logo"
                className={cn(
                  "w-auto object-contain block",
                  settings.logoSize === "sm" && "h-20",
                  settings.logoSize === "md" && "h-28",
                  settings.logoSize === "lg" && "h-36",
                  settings.logoSize === "xl" && "h-44",
                )}
              />
            ) : (
              <span>{logoText || "MOVANA"}</span>
            )}
          </div>
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
