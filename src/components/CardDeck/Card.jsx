import { forwardRef, useEffect, useRef, useState } from "react";
import StarField from "./StarField";

const FLIP_DURATION = 500; // мс — має збігатися з тривалістю анімації нижче

const Card = forwardRef(function Card(
  { card, isFront, isFlipped, onPointerDown },
  ref,
) {
  const num = String(card.id + 1).padStart(2, "0");
  const [showBack, setShowBack] = useState(isFlipped);
  const timeoutRef = useRef(null);

  // Контент задньої сторони підключається в DOM тільки на середині анімації повороту.
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setShowBack(isFlipped),
      FLIP_DURATION / 2,
    );
    return () => clearTimeout(timeoutRef.current);
  }, [isFlipped]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 cursor-grab rounded-xl shadow-2xl active:cursor-grabbing"
      onPointerDown={onPointerDown}
    >
      <div
        className="relative h-full w-full ease-out"
        style={{
          transition: `transform ${FLIP_DURATION}ms`,
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          WebkitTransform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          willChange: "transform",
        }}
      >
        {!showBack && (
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
            <div className="relative z-10 break-words px-2 text-center text-4xl font-extrabold italic uppercase leading-tight tracking-tight text-yellow-300 drop-shadow-lg sm:text-5xl">
              {card.word}
            </div>
          </div>
        )}

        {showBack && (
          <div
            className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-950 to-purple-950 p-4"
            style={{
              transform: "rotateY(180deg)",
              WebkitTransform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="shrink-0 break-words px-2 text-center text-2xl font-extrabold italic uppercase leading-tight tracking-tight text-yellow-300 drop-shadow">
              {card.word}
            </div>

            <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
              {card.translation && (
                <div className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-center font-serif text-base font-semibold text-cyan-200">
                  {card.translation}
                </div>
              )}
              {card.example1 && (
                <div className="rounded-lg border-l-4 border-fuchsia-500 bg-white/5 px-3 py-2 text-xs italic leading-snug text-white/90">
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
        )}
      </div>
    </div>
  );
});

export default Card;
