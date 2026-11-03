import { whatsappHref } from "@/lib/site";

// Solo se muestra si NEXT_PUBLIC_WHATSAPP_NUMBER está configurado.
export function WhatsAppButton() {
  const href = whatsappHref("Hola SALHEN, quiero solicitar una evaluación.");
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed z-30 flex h-14 items-center gap-3 bg-ink pl-4 pr-5 text-paper shadow-[0_8px_24px_-12px_rgb(0_0_0/0.5)] transition-colors hover:bg-olive"
      style={{
        right: "max(1rem, env(safe-area-inset-right, 0px))",
        bottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
      }}
      aria-label="Escribir a SALHEN por WhatsApp (se abre en una pestaña nueva)"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" />
      </svg>
      <span className="font-display text-[1.05rem] font-semibold uppercase tracking-wide">WhatsApp</span>
    </a>
  );
}
