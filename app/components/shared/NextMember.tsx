"use client";

import { useId, useState } from "react";
import { ArrowUpRight, Disc3 } from "lucide-react";

export default function NextMember({ onJoinClick }: { onJoinClick: () => void }) {
  const [name, setName] = useState("");
  const announced = name.trim();
  const inputId = useId();
  return (
    <div className="mt-8 mb-9 max-w-sm">
      <div className="next-member-card relative bg-paper-2 px-6 pt-6 pb-5 border border-ink/15" data-announced={!!announced}>
        <div className="min-h-48" aria-live="polite" aria-atomic="true">
          {announced ? (
            <div className="locker-announcement">
              <p className="text-sm text-ink-muted">接下来上场的是</p>
              <p className="mt-3 font-display text-xl text-action">DFM Locker</p>
              <p className="mt-1 break-words font-display text-4xl leading-tight text-ink">{announced}!</p>
              <p className="mt-4 flex items-center gap-2 font-display text-lg text-ink"><Disc3 size={19} aria-hidden="true" /> DJ, drop the beat!</p>
            </div>
          ) : (
            <p className="pt-5 pb-9 font-display text-[2rem] leading-tight text-ink">下一页，你来。</p>
          )}
        </div>
        <div className="mt-6">
          <label htmlFor={inputId} className="block text-xs text-ink-muted">怎么称呼你？</label>
          <div className="mt-2 flex items-center gap-3 border-b border-ink/25">
            <input id={inputId} value={name} onChange={(event) => setName(event.target.value)} maxLength={16}
              autoComplete="off" placeholder="你的花名"
              className="min-w-0 w-full rounded-none border-0 bg-transparent py-3 text-base text-ink placeholder:text-ink-muted" />
          </div>
        </div>
      </div>
      <button type="button" onClick={onJoinClick} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-action hover:text-action-hover transition-colors">
        找到队友 <ArrowUpRight size={17} aria-hidden="true" />
      </button>
    </div>
  );
}
