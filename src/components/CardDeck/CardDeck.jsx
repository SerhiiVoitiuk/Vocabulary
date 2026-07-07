import { useCallback, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Card from "./Card";
import AddCardForm from "./AddCardForm";
import DeckReadout from "./DeckReadout";
import { useCardDeck } from "./useCardDeck";
import { SLOTS } from "./utils/constants";

export default function CardDeck({ words = [] }) {
  const { cards, order, flipped, frontCard, addCard, next, prev, toggleFlip } =
    useCardDeck(words);

  const cardRefs = useRef(new Map());
  const dragRef = useRef(null); // { id, startX, startY, dx, dy, time }
  const hasAnimatedRef = useRef(false);

  const setCardRef = useCallback(
    (id) => (node) => {
      if (node) cardRefs.current.set(id, node);
      else cardRefs.current.delete(id);
    },
    [],
  );

  const animateToSlots = useCallback(
    (instant = false) => {
      const isMobile = window.matchMedia("(max-width: 639px)").matches;
      order.forEach((id, slot) => {
        const el = cardRefs.current.get(id);
        if (!el) return;
        const cfg = SLOTS[Math.min(slot, SLOTS.length - 1)];
        const vars = {
          x: 0,
          y: 0,
          xPercent: cfg.xp,
          yPercent: cfg.yp,
          rotation: cfg.r,
          scale: cfg.s,
          opacity: cfg.o,
          zIndex: cfg.z,
          pointerEvents: slot === 0 ? "auto" : "none",
        };
        if (instant) {
          gsap.set(el, vars);
        } else {
          gsap.to(el, {
            ...vars,
            duration: isMobile ? 0.35 : 0.5,
            ease: isMobile ? "power2.out" : "power3.out",
            overwrite: "auto",
          });
        }
      });
    },
    [order],
  );

  // Спрацьовує щоразу, коли міняється черга карток (next/prev)
  useLayoutEffect(() => {
    if (order.length === 0) return;
    animateToSlots(!hasAnimatedRef.current);
    hasAnimatedRef.current = true;
  }, [order, animateToSlots]);

  const handlePointerDown = (id) => (e) => {
    if (order[0] !== id) return;
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dy: 0,
      time: Date.now(),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    d.dx = e.clientX - d.startX;
    d.dy = e.clientY - d.startY;
    const el = cardRefs.current.get(d.id);
    if (!el) return;
    gsap.set(el, { x: d.dx, y: d.dy, rotation: d.dx / 18 });
  };

  const handlePointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;

    const dist = Math.hypot(d.dx, d.dy);
    const elapsed = Date.now() - d.time;
    const el = cardRefs.current.get(d.id);

    if (dist < 8 && elapsed < 300) {
      toggleFlip(d.id);
      if (el)
        gsap.to(el, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
    } else if (Math.abs(d.dx) > 40 || Math.abs(d.dy) > 40) {
      d.dx < 0 || d.dy < 0 ? next() : prev();
      // animateToSlots (спрацює автоматично через useLayoutEffect на order) сам скине x/y/rotation
    } else if (el) {
      gsap.to(el, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const frontEl = cardRefs.current.get(order[0]);
    if (frontEl && gsap.isTweening(frontEl)) return; // не даємо новій анімації стартувати поверх незавершеної
    e.deltaY > 0 ? next() : prev();
  };

  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-b from-purple-950 via-fuchsia-950 to-black">
      <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-24 top-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative z-10 flex h-full w-full max-w-4xl select-none flex-col items-center justify-between gap-2 overflow-hidden px-5 py-6 sm:justify-center sm:gap-6 sm:py-16">
        <div
          className="relative mx-auto aspect-[3/5] w-auto min-h-0 max-h-[70dvh] max-w-[85vw] flex-1 touch-none sm:flex-none sm:h-auto sm:max-h-none sm:w-full sm:max-w-sm"
          style={{ perspective: "1200px", WebkitPerspective: "1200px" }}
          onWheel={handleWheel}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {cards.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-fuchsia-500/20 bg-purple-950/40 text-sm text-fuchsia-100/60">
              Завантаження слів…
            </div>
          )}
          {order.map((id, slot) => {
            const card = cards.find((c) => c.id === id);
            if (!card) return null;
            return (
              <Card
                key={id}
                ref={setCardRef(id)}
                card={card}
                isFront={slot === 0}
                isFlipped={flipped.has(id)}
                onPointerDown={handlePointerDown(id)}
              />
            );
          })}
        </div>

        <div className="max-w-xs shrink-0 text-center text-xs leading-relaxed text-fuchsia-100/60">
          Tap or click to flip the card. Swipe or scroll to browse the deck.
        </div>

        {/* <AddCardForm onAdd={addCard} /> */}
      </div>
    </div>
  );
}
