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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-purple-950 via-fuchsia-950 to-black">
      <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-24 top-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-8xl select-none flex-col items-center gap-6 px-5 py-16">
        <div
          className="relative mx-auto aspect-square w-full max-w-xs touch-none sm:max-w-sm"
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

        <DeckReadout index={frontCard?.id ?? 0} name={frontCard?.name} />

        <div className="max-w-xs text-center text-xs leading-relaxed text-fuchsia-100/60">
          Click — flip the card. Swipe or scroll — navigate through the deck.
        </div>

        {/* <AddCardForm onAdd={addCard} /> */}
      </div>
    </div>
  );
}
