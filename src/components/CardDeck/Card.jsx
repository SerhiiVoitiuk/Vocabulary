import StarField from "./StarField";

export default function Card({
  card,
  transform,
  opacity,
  zIndex,
  isFront,
  isFlipped,
  isDragging,
  onPointerDown,
}) {
  const num = String(card.id + 1).padStart(2, "0");

  return (
    <div
      className={`absolute inset-0 cursor-grab rounded-xl shadow-2xl active:cursor-grabbing ${
        isDragging ? "transition-none" : "transition-all duration-500 ease-out"
      }`}
      style={{
        transform,
        opacity,
        zIndex,
        pointerEvents: isFront ? "auto" : "none",
      }}
      onPointerDown={onPointerDown}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br from-purple-900 to-purple-950 p-4 ${
            isFront ? "border-fuchsia-500/60" : "border-fuchsia-500/20"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="font-serif text-xs tracking-wide text-white">
            {num}
          </div>
          <StarField seed={card.id + 1} />
          <div className="flex flex-1 items-center justify-center font-serif text-5xl text-white drop-shadow">
            {card.word}
          </div>
        </div>

        <div
          className="absolute inset-0 flex flex-col justify-between rounded-xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-950 to-purple-950 p-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-xs uppercase tracking-widest text-white">
            Card №{num}
          </div>
          <div className="flex flex-1 flex-col justify-center gap-4 text-white">
            {/* WORD (головний акцент) */}
            <div className="text-center font-serif text-4xl tracking-wide text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]">
              {card.word}
            </div>

            {/* TRANSLATION */}
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-3 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.08)]">
              <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">
                Translation
              </div>
              <div className="text-base text-cyan-100 font-serif">
                {card.translation || "Coming soon"}
              </div>
            </div>

            <div className="rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-3 backdrop-blur-md shadow-[0_0_20px_rgba(255,0,255,0.08)]">
              <div className="text-[10px] uppercase tracking-[0.25em] text-fuchsia-300">
                Example 1
              </div>
              <div className="text-sm text-white/90 leading-snug">
                {card.example1 || "Example coming soon"}
              </div>
            </div>

            <div className="rounded-xl border border-amber-300/20 bg-amber-500/10 p-3 backdrop-blur-md shadow-[0_0_20px_rgba(255,180,0,0.08)]">
              <div className="text-[10px] uppercase tracking-[0.25em] text-amber-300">
                Example 2
              </div>
              <div className="text-sm text-white/90 leading-snug">
                {card.example2 || "Example coming soon"}
              </div>
            </div>
          </div>
          <div className="text-xs tracking-wide text-fuchsia-100/60">
            ← Click to flip
          </div>
        </div>
      </div>
    </div>
  );
}
