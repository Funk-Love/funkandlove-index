"use client";

import { Fragment } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { useReveal } from "../../hooks/useReveal";
import SectionHeader from "../ui/SectionHeader";

const SLOGAN_PHRASES = SITE_CONFIG.slogan.split(", ");

const FACTS = [
  { label: "所属组织", value: SITE_CONFIG.organization },
  { label: "舞种", value: SITE_CONFIG.danceStyle },
  { label: "规模", value: `${SITE_CONFIG.memberCount} 成员` },
  { label: "理念", value: SITE_CONFIG.philosophy },
];

/**
 * 关于我们(纸面):章节头 → 大 slogan(焦橙 display)→ 一段描述 → 编号事实表。
 * 事实表走编辑部表格:mono 序号 / 灰标签 / 粗墨值,细墨线分隔,不做卡片。
 */
export default function MobileTeamInfo() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="team-info"
      ref={ref}
      className="relative bg-paper text-ink paper-grain px-6 py-16 scroll-mt-4 focus:outline-none"
    >
      <div className="max-w-md mx-auto">
        <SectionHeader index={1} eyebrow="about" title="关于我们" theme="light" className="mb-8" />

        {/* slogan 按逗号分短语,短语内不折行,窄屏只在短语之间断 */}
        <p
          data-reveal="lock"
          className="font-display text-accent-600 leading-[1.1] text-[clamp(1.75rem,8vw,2.5rem)] mb-6"
        >
          {SLOGAN_PHRASES.map((phrase, i) => (
            <Fragment key={phrase}>
              <span className="whitespace-nowrap">
                {phrase}
                {i < SLOGAN_PHRASES.length - 1 ? "," : ""}
              </span>
              {i < SLOGAN_PHRASES.length - 1 ? " " : null}
            </Fragment>
          ))}
        </p>

        <p data-reveal className="text-base leading-relaxed text-ink-2 mb-8">
          {SITE_CONFIG.teamDescription}
        </p>

        <dl data-reveal className="border-t-2 border-ink">
          {FACTS.map((f, i) => (
            <div
              key={f.label}
              className="grid grid-cols-[2rem_5.5rem_1fr] items-baseline gap-3 py-4 border-b border-ink/15"
            >
              <span className="font-mono text-[11px] text-ink-faint tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <dt className="text-base text-ink-muted">{f.label}</dt>
              <dd className="text-ink font-bold text-base text-right">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
