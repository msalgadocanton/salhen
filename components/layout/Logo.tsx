import Image from "next/image";
import { logos, type LogoVariant } from "@/lib/brand";

type Props = { variant?: LogoVariant; className?: string; priority?: boolean };

// Logotipo oficial. El tamaño se controla solo con la altura (className); el ancho sigue la proporción.
export function Logo({ variant = "horizontal", className = "h-10", priority = false }: Props) {
  const logo = logos[variant];
  return (
    <Image
      src={logo.src}
      alt="SALHEN"
      width={logo.width}
      height={logo.height}
      priority={priority}
      className={`w-auto ${className}`}
    />
  );
}
