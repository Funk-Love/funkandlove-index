/**
 * 统一的 section 标题:海报色条 + mono eyebrow + 编号 + display 大标题 + (可选)副标题。
 * 70s 海报 × 编辑部网格。paper(浅底)/ stage(深底)两种配色。
 */
interface Props {
  /** 1 起的章节号,会渲染成 "/ 01"、"/ 02" */
  index: number;
  /** eyebrow 里的英文名,如 "about" / "team" */
  eyebrow: string;
  /** 中文主标题 */
  title: string;
  /** 可选副标题 */
  subtitle?: string;
  /** 深底(stage)用 dark,纸面(paper)用 light。默认 light */
  theme?: "light" | "dark";
  /** 对齐方式。默认 left */
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  index,
  eyebrow,
  title,
  subtitle,
  theme = "light",
  align = "left",
  className = "",
}: Props) {
  const isDark = theme === "dark";
  const isCenter = align === "center";

  const eyebrowColor = isDark ? "text-paper/60" : "text-ink-muted";
  const dividerColor = isDark ? "bg-paper/20" : "bg-ink/15";
  const titleColor = isDark ? "text-paper" : "text-ink";
  const subtitleColor = isDark ? "text-paper/70" : "text-ink-2";

  return (
    <div className={`${isCenter ? "text-center" : ""} ${className}`}>
      <div
        className={`flex items-center gap-4 mb-4 ${isCenter ? "justify-center" : ""}`}
        data-reveal
      >
        <span className="rule-accent shrink-0 rounded-full" aria-hidden />
        <span
          className={`font-mono text-xs tracking-[0.12em] uppercase whitespace-nowrap ${eyebrowColor}`}
        >
          / {String(index).padStart(2, "0")} · {eyebrow}
        </span>
        <span className={`h-px ${dividerColor} ${isCenter ? "w-12" : "flex-1"}`} />
      </div>
      <h2
        data-reveal="lock"
        className={`font-display font-bold tracking-tight leading-[1.05] text-[clamp(2.25rem,6vh,3.75rem)] ${titleColor}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          data-reveal
          className={`mt-4 max-w-prose text-[clamp(0.95rem,2vh,1.125rem)] leading-relaxed ${
            isCenter ? "mx-auto" : ""
          } ${subtitleColor}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
