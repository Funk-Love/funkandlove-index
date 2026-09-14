"use client";

import SectionHeader from "./ui/SectionHeader";
import ImagePlaceholder from "./ui/ImagePlaceholder";
import { SITE_CONFIG } from "@/lib/constants";
import { getIcon } from "@/lib/icons";

/** 利用舞台照片左侧暗部排字；窄屏延伸暗部，完整保留右侧人物。 */
export default function TeamFeatures() {
  return (
    <div className="features-scene relative isolate w-full text-paper">
      <div className="features-photo absolute inset-0 -z-20">
        <ImagePlaceholder src={SITE_CONFIG.images.featuresBackground}
          alt="Funk & Love 舞台演出" fill priority sizes="100vw"
          className="w-full h-full" imageClassName="object-cover"
          placeholderText="舞台演出照片" rounded={false} />
      </div>
      <div className="features-shade absolute inset-0 -z-10" aria-hidden="true" />
      <div className="features-layout max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12">
        <div className="features-copy">
          <SectionHeader index={3} eyebrow="features" title="团队特色" theme="dark" className="mb-6" />
          <div className="divide-y divide-paper/15 border-t border-paper/15">
            {SITE_CONFIG.features.map((feature, index) => {
              const Icon = getIcon(feature.icon);
              return (
                <div key={feature.title} className="flex items-start gap-4 py-[clamp(0.9rem,2.6vh,1.4rem)]">
                  <span className="pt-1 text-[10px] font-mono text-paper/45">{String(index + 1).padStart(2, "0")}</span>
                  <div className="flex-1">
                    <h3 className="flex items-center gap-2.5 font-bold text-lg leading-tight">
                      {Icon && <Icon size={19} strokeWidth={1.5} className="text-pop-500 shrink-0" />}
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-paper/75 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
