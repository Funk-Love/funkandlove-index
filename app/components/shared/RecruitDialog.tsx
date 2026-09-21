"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { RECRUIT_CONTACT } from "@/lib/data/team";
import DetailSheet from "./DetailSheet";
import BrandMark from "./BrandMark";
import "./recruit-dialog.css";

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
  const [copyError, setCopyError] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(RECRUIT_CONTACT.wechat);
      setCopyError(false);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <DetailSheet
      open={open}
      onClose={onClose}
      panelClassName="recruit-panel"
      closeButtonClassName="recruit-close"
      ariaLabel="加入我们"
    >
      <div className="recruit-layout">
        <div className="recruit-brand">
          <p className="recruit-wordmark font-display">Funk <span className="font-sans font-semibold">&amp;</span> Love</p>
          <BrandMark className="recruit-mark" />
          <p className="recruit-signature">浙江大学 DFM 街舞社<br />LOCKING</p>
        </div>
        <div className="recruit-contact">
          <h2>加入我们</h2>
          <p className="recruit-intro">欢迎所有热爱 Locking 的朋友！无论你是零基础还是已经在跳，我们都期待和你一起 funk。</p>
          <div className="recruit-person">
            <span className="recruit-name">{RECRUIT_CONTACT.name}</span>
            <span className="recruit-role">{RECRUIT_CONTACT.term} 队长</span>
          </div>
          <div className="recruit-wechat">
            <span>微信号</span>
            <p>{RECRUIT_CONTACT.wechat}</p>
          </div>
          <button type="button" onClick={handleCopy} className="recruit-copy" aria-label={copied ? "已复制微信号" : "复制微信号"}>
            <span aria-live="polite">{copied ? "微信号已复制" : "复制微信号"}</span>
            {copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
          </button>
          {copyError && <p className="recruit-copy-error" role="status">复制未成功，请长按或选中微信号复制。</p>}
        </div>
      </div>
    </DetailSheet>
  );
}
