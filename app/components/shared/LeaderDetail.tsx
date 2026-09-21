"use client";

import type { Leader } from "@/lib/types";
import { asset } from "@/lib/cdn";
import "./people-details.css";

interface Props {
  leader: Leader;
}

/**
 * 队长详情内容(不含 modal/sheet 外壳),纸面配色。
 * 用于 <DetailSheet> 的 children。
 */
export default function LeaderDetail({ leader }: Props) {
  const imageSrc = asset(leader.image);

  return (
    <article className="leader-profile" data-role={leader.role}>
      <div className="leader-profile-photo">
        <img src={imageSrc} alt={leader.name} decoding="async"
          style={{ objectPosition: `${leader.cardX ?? "50%"} ${leader.modalY ?? "50%"}` }} />
      </div>
      <div className="leader-profile-copy">
        <h2>{leader.name}</h2>
        <div className="leader-profile-meta">
          <span>{leader.term}</span>
          <span className="leader-profile-role"><i aria-hidden />{leader.title}</span>
        </div>
        {leader.bio && <p className="leader-profile-bio">{leader.bio}</p>}
        <p className="leader-profile-signature font-display">Funk <span className="font-sans">&amp;</span> Love</p>
      </div>
    </article>
  );
}
