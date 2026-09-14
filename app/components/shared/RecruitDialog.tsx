"use client";

import { useState } from "react";
import { Heart, Copy, Check } from "lucide-react";
import { RECRUIT_CONTACT } from "@/lib/data/team";
import DetailSheet from "./DetailSheet";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * 招新提示弹窗 - "加入我们"CTA 触发。
 * 联系当届队长,提供微信号 + 一键复制。
 * 桌面 modal / 移动 bottom sheet 自适应。
 */
export default function RecruitDialog({ open, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(RECRUIT_CONTACT.wechat);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — 用户可手动复制可见的微信号
    }
  };

  return (
    <DetailSheet
      open={open}
      onClose={onClose}
      panelClassName="relative max-w-md w-full bg-paper text-ink rounded-3xl overflow-hidden border-2 border-ink shadow-paper"
      ariaLabel="加入我们"
    >
      {/* 顶部品牌色条 */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-500 via-pop-500 to-accent-500" />

      <div className="p-7 sm:p-8 pt-9">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-pop-500/30 border border-ink/10">
            <Heart className="w-5 h-5 text-accent-600" strokeWidth={2.25} />
          </div>
          <h3 className="font-display text-2xl text-ink">想加入 Funk <span className="font-sans font-semibold">&amp;</span> Love？</h3>
        </div>

        <p className="text-ink-2 leading-relaxed mb-6">
          欢迎所有热爱 Locking 的朋友！无论你是零基础还是已经在跳,我们都期待和你一起 funk。
        </p>

        <div className="rounded-2xl bg-paper-2 border border-ink/15 p-5 mb-6">
          <p className="text-sm text-ink-muted mb-3">
            请联系 {RECRUIT_CONTACT.term} 队长{" "}
            <span className="text-ink font-bold">{RECRUIT_CONTACT.name}</span>：
          </p>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-ink-faint mb-1">微信号</p>
              <p className="text-lg font-mono text-ink tracking-wide truncate">{RECRUIT_CONTACT.wechat}</p>
            </div>
            <button
              onClick={handleCopy}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm border-2 transition-colors duration-200 cursor-pointer ${
                copied
                  ? "bg-ok-500 border-ok-500 text-paper"
                  : "bg-ink border-ink text-paper hover:bg-accent-500 hover:border-accent-500"
              }`}
              aria-label={copied ? "已复制" : "复制微信号"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> 已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> 复制
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full border-2 border-ink text-ink font-bold hover:bg-ink hover:text-paper transition-colors cursor-pointer"
        >
          关闭
        </button>
      </div>
    </DetailSheet>
  );
}
