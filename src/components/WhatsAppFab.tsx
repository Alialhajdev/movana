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
      <svg viewBox="0 0 32 32" className="size-8" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.144-.33.144-.616.144-.974 0-.49-2.137-1.42-2.608-1.72zm-2.165 7.245c-1.794 0-3.531-.604-4.97-1.69l-3.466 1.114 1.13-3.45a8.45 8.45 0 0 1-1.747-5.151c0-4.673 3.834-8.466 8.553-8.466s8.553 3.793 8.553 8.466c0 4.673-3.834 8.5-8.553 8.5l.5.677zm0-18.658C11.06 5.792 6 10.834 6 16.798c0 1.964.535 3.84 1.473 5.546L6.04 26.92l4.706-1.502a11.198 11.198 0 0 0 5.202 1.317c5.886 0 10.946-5.04 10.946-11.005C26.894 9.766 22.012 5.792 16.946 5.792z"/>
      </svg>
      <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "#25D366", opacity: 0.35 }} />
    </a>
  );
}
