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
 * 联系 25 届队长，提供微信号 + 一键复制。
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
      panelClassName="relative max-w-md w-full bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      ariaLabel="加入我们"
    >
      {/* 顶部品牌渐变条 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-amber-500" />

      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/15">
            <Heart className="w-5 h-5 text-amber-400" strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold text-white">想加入 Funk &amp; Love？</h3>
        </div>

        <p className="text-gray-300 leading-relaxed mb-6">
          欢迎所有热爱 Locking 的朋友！无论你是零基础还是已经在跳，我们都期待和你一起 funk。
        </p>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-6">
          <p className="text-sm text-gray-400 mb-3">
            请联系 {RECRUIT_CONTACT.term} 队长 <span className="text-white font-medium">{RECRUIT_CONTACT.name}</span>：
          </p>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-1">微信号</p>
              <p className="text-lg font-mono text-white tracking-wide truncate">
                {RECRUIT_CONTACT.wechat}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
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
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
        >
          关闭
        </button>
      </div>
    </DetailSheet>
  );
}
