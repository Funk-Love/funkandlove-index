"use client";

import { Crown } from "lucide-react";
import type { Leader } from "@/lib/types";
import { getRoleBadgeStyle } from "./leaderStyles";
import { asset } from "@/lib/cdn";

interface Props {
  leader: Leader;
  width: number;
  height: number;
  priority?: boolean;
  onClick?: () => void;
}

/** Photograph and a paper caption, inside the unchanged horizontal-scroll footprint. */
export default function LeaderCard({ leader, width, height, priority, onClick }: Props) {
  const founder = leader.role === "founder";
  return (
    <button type="button" onClick={onClick} style={{ width, height }}
      aria-label={`${leader.name} · ${leader.term} ${leader.title}`}
      className="leader-photo shrink-0 text-left cursor-pointer">
      <span className={`flex h-full w-full flex-col rounded-[6px] bg-paper p-2.5 shadow-paper ${founder ? 'ring-1 ring-warm-400/70' : ''}`}>
        <span className="relative min-h-0 flex-1 overflow-hidden rounded-[2px] bg-stage-2">
          <img src={asset(`/images/leader-previews/${leader.id}.webp`)} alt={leader.name}
            className="h-full w-full object-cover" decoding="async"
            style={{ objectPosition: `${leader.cardX || '50%'} center` }} loading={priority ? 'eager' : 'lazy'} />
          <span className="absolute left-3 top-3 bg-paper/95 px-2 py-1 text-[11px] font-medium tracking-wide text-ink">{leader.term}</span>
        </span>
        <span className="flex min-h-[76px] shrink-0 items-center justify-between gap-2 px-2 pb-1 pt-3 text-ink">
          <span className="min-w-0">
            <span className={`block font-semibold leading-tight ${founder ? 'text-2xl' : 'text-xl'}`}>{leader.name}</span>
            <span className={`mt-2 inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium ${getRoleBadgeStyle(leader.role)}`}><span aria-hidden="true" className={`h-1.5 w-1.5 border border-current ${leader.role === "vice" ? "rotate-45" : "rounded-full"}`} />{leader.title}</span>
          </span>
          {founder && <Crown aria-hidden className="h-5 w-5 shrink-0 text-warm-900" strokeWidth={1.5} />}
        </span>
      </span>
    </button>
  );
}
