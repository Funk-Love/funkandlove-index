/**
 * 统一的 section 标题:mono eyebrow + 编号 + 大标题 + (可选)副标题。
 * 编辑设计感,去 SaaS 模板。深浅底自动配色。
 */
interface Props {
  /** 1 起的章节号,会渲染成 "/ 01"、"/ 02" */
  index: number;
  /** eyebrow 里的英文名,如 "about" / "team" */
  eyebrow: string;
  /** 中文主标题 */
  title: string;
  /** 可选副标题(原先标题下面的描述行) */
  subtitle?: string;
  /** 深底用 dark,浅底用 light。默认 dark */
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
  theme = "dark",
  align = "left",
  className = "",
}: Props) {
  const isDark = theme === "dark";
  const isCenter = align === "center";

  const eyebrowColor = isDark ? "text-white/40" : "text-neutral-500";
  const dividerColor = isDark ? "bg-white/15" : "bg-neutral-300";
  const titleColor = isDark ? "text-white" : "text-neutral-900";
  const subtitleColor = isDark ? "text-white/60" : "text-neutral-600";

  return (
    <div className={`${isCenter ? "text-center" : ""} ${className}`}>
      <div
        className={`flex items-baseline gap-4 mb-3 ${
          isCenter ? "justify-center" : ""
        }`}
      >
        {isCenter && <span className={`h-px w-12 ${dividerColor}`} />}
        <span
          className={`font-mono text-[11px] tracking-[0.3em] uppercase whitespace-nowrap ${eyebrowColor}`}
        >
          / {String(index).padStart(2, "0")} · {eyebrow}
        </span>
        <span
          className={`h-px ${dividerColor} ${isCenter ? "w-12" : "flex-1"}`}
        />
      </div>
      <h2
        className={`font-bold tracking-tight leading-none text-[clamp(2rem,5.5vh,3.25rem)] ${titleColor}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-[clamp(0.95rem,2vh,1.125rem)] ${subtitleColor}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
