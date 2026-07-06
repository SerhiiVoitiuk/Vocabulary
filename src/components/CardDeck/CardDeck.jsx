import Card from "./Card";
import AddCardForm from "./AddCardForm";
import DeckReadout from "./DeckReadout";
import { useCardDeck } from "./useCardDeck";

export default function CardDeck({ words = [] }) {
  const {
    cards,
    order,
    flipped,
    drag,
    frontCard,
    slots,
    addCard,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  } = useCardDeck(words);

  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-b from-purple-950 via-fuchsia-950 to-black">
      <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-24 top-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative z-10 flex h-full w-full max-w-4xl select-none flex-col items-center justify-between gap-2 overflow-hidden px-5 py-6 sm:justify-center sm:gap-6 sm:py-16">
        <div
          className="relative mx-auto aspect-[3/5] w-auto min-h-0 max-h-[60dvh] flex-1 touch-none sm:flex-none sm:h-auto sm:w-full sm:max-w-xs"
          style={{ perspective: "1200px" }}
          onWheel={handleWheel}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {cards.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-fuchsia-500/20 bg-purple-950/40 text-sm text-fuchsia-100/60">
              Loading…
            </div>
          )}
          {order.map((id, slot) => {
            const card = cards.find((c) => c.id === id);
            if (!card) return null;
            const isDragging = drag?.id === id;
            const cfg = slots[Math.min(slot, slots.length - 1)];
            const transform = isDragging
              ? `translate(${drag.dx}px, ${drag.dy}px) rotate(${drag.dx / 18}deg)`
              : `translate(${cfg.xp}%, ${cfg.yp}%) rotate(${cfg.r}deg) scale(${cfg.s})`;

            return (
              <Card
                key={id}
                card={card}
                transform={transform}
                opacity={isDragging ? 1 : cfg.o}
                zIndex={isDragging ? 999 : cfg.z}
                isFront={slot === 0}
                isFlipped={flipped.has(id)}
                isDragging={isDragging}
                onPointerDown={handlePointerDown(id)}
              />
            );
          })}
        </div>

        {/* <div className="shrink-0">
          <DeckReadout index={frontCard?.id ?? 0} name={frontCard?.word} />
        </div> */}

        <div className="max-w-xs shrink-0 text-center text-xs leading-relaxed text-fuchsia-100/60">
          Клік — перевернути картку. Свайп або скрол — гортати колоду.
        </div>

        {/* <AddCardForm onAdd={addCard} /> */}
      </div>
    </div>
  );
}
