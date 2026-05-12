import { useState } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { useStore, THEME_PRESETS, THEME_PRESET_SWATCH, type ThemePreset, type ThemeMode } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SettingsManager() {
  const { t, lang } = useI18n();
  const { settings, updateSettings } = useStore();
  const [logoText, setLogoText] = useState(settings.logoText);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl ?? "");

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
