import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

const KEY = "movana_popup_seen_v";

export function WelcomePopup() {
  const { lang } = useI18n();
  const { settings } = useStore();
  const [open, setOpen] = useState(false);

  const title = lang === "ar" ? settings.popupTitleAr : settings.popupTitleEn;
  const text = lang === "ar" ? settings.popupTextAr : settings.popupTextEn;
  // Signature changes whenever admin updates the popup -> show again
  const sig = `${settings.popupActive ? 1 : 0}|${title ?? ""}|${text ?? ""}`;

  useEffect(() => {
    if (!settings.popupActive) { setOpen(false); return; }
    if (!title && !text) { setOpen(false); return; }
    try {
      const seen = sessionStorage.getItem(KEY);
      if (seen !== sig) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [sig, settings.popupActive, title, text]);

  const close = () => {
    try { sessionStorage.setItem(KEY, sig); } catch { /* noop */ }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-up" onClick={close}>
      <div className="relative max-w-md w-full glass rounded-2xl p-6 shadow-glow border border-primary/30" onClick={(e) => e.stopPropagation()}>
        <button onClick={close} aria-label="close" className="absolute top-3 end-3 grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20">
          <X className="size-4" />
        </button>
        {title && <h2 className="font-display text-2xl text-primary mb-3">{title}</h2>}
        {text && <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">{text}</p>}
        <button onClick={close} className="mt-5 w-full rounded-md gradient-red px-4 py-2.5 text-sm font-bold text-primary-foreground">
          {lang === "ar" ? "حسناً" : "Got it"}
        </button>
      </div>
    </div>
  );
}
