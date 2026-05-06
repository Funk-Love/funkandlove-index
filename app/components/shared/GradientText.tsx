import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** Tailwind color stops, e.g. 'from-violet-500' */
  from?: string;
  via?: string;
  to?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

export default function GradientText({
  children,
  className = "",
  from = "from-violet-500",
  via = "via-pink-500",
  to = "to-amber-500",
  as: Tag = "span",
}: Props) {
  return (
    <Tag
      className={`bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </Tag>
  );
}
