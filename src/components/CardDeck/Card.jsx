import { forwardRef } from "react";
import StarField from "./StarField";

const Card = forwardRef(function Card(
  { card, isFront, isFlipped, onPointerDown },
  ref,
) {
  const num = String(card.id + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      className="absolute inset-0 cursor-grab rounded-xl shadow-2xl active:cursor-grabbing"
      onPointerDown={onPointerDown}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 ease-out"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          willChange: "transform",
        }}
      >
        {/* ПЕРЕДНЯ СТОРОНА — слово по центру, майже на весь розмір картки */}
        <div
          className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br from-purple-900 to-purple-950 p-4 ${
            isFront ? "border-fuchsia-500/60" : "border-fuchsia-500/20"
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="absolute inset-0 opacity-40">
            <StarField seed={card.id + 1} />
          </div>
          <div className="absolute left-3 top-3 font-serif text-xs tracking-wide text-white/60">
            {num}
          </div>
          <div className="relative z-10 break-words bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text px-2 text-center text-4xl font-extrabold italic uppercase leading-tight tracking-tight text-transparent drop-shadow-lg sm:text-5xl">
            {card.word}
          </div>
        </div>

        {/* ЗАДНЯ СТОРОНА — слово зверху, переклад і приклади знизу окремими виділеними блоками */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-950 to-purple-950 p-4"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="mt-5 shrink-0 break-words bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-center text-2xl font-extrabold italic uppercase leading-tight tracking-tight text-transparent drop-shadow">
            {card.word}
          </div>

          <div className="mt-10 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
            {card.translation && (
              <div className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-center font-serif text-base font-semibold text-cyan-200">
                {card.translation}
              </div>
            )}
            {card.example1 && (
              <div className="rounded-lg border-l-4 border-fuchsia-500 bg-white/5 px-3 py-5 text-xs italic leading-snug text-white/90">
                {card.example1}
              </div>
            )}
            {card.example2 && (
              <div className="rounded-lg border-l-4 border-fuchsia-500 bg-white/5 px-3 py-2 text-xs italic leading-snug text-white/90">
                {card.example2}
              </div>
            )}
          </div>

          <div className="mt-2 shrink-0 text-center text-xs tracking-wide text-fuchsia-100/50">
            ← клікніть, щоб повернути
          </div>
        </div>
      </div>
    </div>
  );
});

export default Card;
