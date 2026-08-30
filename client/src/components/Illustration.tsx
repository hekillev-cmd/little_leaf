import React from "react";
import { cn } from "@/lib/utils";

type IllustrationProps = {
  kind: string;
  className?: string;
  compact?: boolean;
};

const artByKind: Record<string, { eyebrow: string; icon: string; shapes: string[] }> = {
  garden: { eyebrow: "مغامرة ناعمة", icon: "✿", shapes: ["☼", "◌", "✦"] },
  draw: { eyebrow: "ارسمها بطريقتك", icon: "✎", shapes: ["○", "△", "□"] },
  rainy: { eyebrow: "وقت ممتع", icon: "☂", shapes: ["✦", "◡", "•"] },
  letters: { eyebrow: "نتعلم باللعب", icon: "أ", shapes: ["ب", "ت", "♡"] },
  space: { eyebrow: "رحلة بعيدة", icon: "☾", shapes: ["✦", "✧", "·"] },
  stickers: { eyebrow: "قص ولصق", icon: "★", shapes: ["☁", "✿", "♥"] },
};

export function Illustration({ kind, className, compact = false }: IllustrationProps) {
  const art = artByKind[kind] || artByKind.garden;
  return (
    <div className={cn("product-art", `art-${kind}`, compact && "product-art-compact", className)} aria-hidden="true">
      <div className="art-sun" />
      <span className="art-shape art-shape-one">{art.shapes[0]}</span>
      <span className="art-shape art-shape-two">{art.shapes[1]}</span>
      <span className="art-shape art-shape-three">{art.shapes[2]}</span>
      <div className="art-card">
        <span className="art-eyebrow">{art.eyebrow}</span>
        <span className="art-icon">{art.icon}</span>
        {!compact && <span className="art-lines"><i /><i /><i /></span>}
      </div>
      <div className="art-ground" />
    </div>
  );
}
