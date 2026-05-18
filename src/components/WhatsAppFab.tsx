import { MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function WhatsAppFab() {
  const { lang } = useI18n();
  const { settings } = useStore();
  const num = (settings.whatsappNumber ?? "").replace(/[^\d+]/g, "");
  if (!num) return null;
  const text = encodeURIComponent(lang === "ar" ? "مرحباً، أحتاج للمساعدة." : "Hi, I need help.");
  const href = `https://wa.me/${num.replace(/^\+/, "")}?text=${text}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-20 md:bottom-6 end-4 z-[60] grid size-14 place-items-center rounded-full shadow-xl text-white transition hover:scale-105"
      style={{ background: "#25D366" }}
    >
      <MessageCircle className="size-7 fill-white" />
      <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "#25D366", opacity: 0.35 }} />
    </a>
  );
}
