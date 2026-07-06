import { useCallback, useEffect, useRef, useState } from "react";
import { SLOTS } from "./utils/constants";

// initialItems — масив ваших слів з Appwrite, будь-якої форми (документи колекції).
// Хук сам перетворює їх у формат картки { id, name, fact }.
export function useCardDeck(initialItems = []) {
  const [cards, setCards] = useState([]);
  const [order, setOrder] = useState([]);
  const [flipped, setFlipped] = useState(() => new Set());
  const [drag, setDrag] = useState(null); // { id, dx, dy }

  const nextId = useRef(0);
  const initializedRef = useRef(false);
  const dragInfo = useRef({ x: 0, y: 0, time: 0 });
  const wheelLock = useRef(false);

  // Спрацьовує один раз, коли words з Appwrite нарешті прийшли (initialItems.length > 0).
  useEffect(() => {
    if (initializedRef.current || !initialItems.length) return;
    initializedRef.current = true;

    const withIds = initialItems.map((item, i) => ({
      id: i,
      word: item.word ?? "",
      translation: item.translation ?? "",
      example1: item.example1 ?? "",
      example2: item.example2 ?? "",
    }));

    setCards(withIds);
    setOrder(withIds.map((c) => c.id));
    nextId.current = withIds.length;
  }, [initialItems]);

  const next = useCallback(() => {
    setOrder((o) => {
      const n = [...o];
      n.push(n.shift());
      return n;
    });
  }, []);

  const prev = useCallback(() => {
    setOrder((o) => {
      const n = [...o];
      n.unshift(n.pop());
      return n;
    });
  }, []);

  const toggleFlip = useCallback((id) => {
    setFlipped((f) => {
      const n = new Set(f);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  // Додає нову картку і робить її першою зверху колоди.
  const addCard = useCallback(
    (word, translation, example1 = "", example2 = "") => {
      const id = nextId.current++;
      setCards((c) => [...c, { id, word, translation, example1, example2 }]);
      setOrder((o) => [id, ...o]);
    },
    [],
  );

  const handlePointerDown = useCallback(
    (id) => (e) => {
      if (order[0] !== id) return;
      dragInfo.current = { x: e.clientX, y: e.clientY, time: Date.now() };
      setDrag({ id, dx: 0, dy: 0 });
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [order],
  );

  const handlePointerMove = useCallback((e) => {
    setDrag((d) =>
      d
        ? {
            ...d,
            dx: e.clientX - dragInfo.current.x,
            dy: e.clientY - dragInfo.current.y,
          }
        : d,
    );
  }, []);

  const handlePointerUp = useCallback(() => {
    const d = drag; // беремо поточний drag напряму

    if (!d) return;

    const { id, dx, dy } = d;

    const dist = Math.hypot(dx, dy);
    const elapsed = Date.now() - dragInfo.current.time;

    if (dist < 8 && elapsed < 300) {
      toggleFlip(id);
    } else if (Math.abs(dx) > 40 || Math.abs(dy) > 40) {
      dx < 0 || dy < 0 ? next() : prev();
    }

    setDrag(null); // тільки очистка стану
  }, [drag, next, prev, toggleFlip]);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      if (wheelLock.current) return;
      wheelLock.current = true;
      e.deltaY > 0 ? next() : prev();
      setTimeout(() => {
        wheelLock.current = false;
      }, 380);
    },
    [next, prev],
  );

  const frontCard = cards.find((c) => c.id === order[0]);

  return {
    cards,
    order,
    flipped,
    drag,
    frontCard,
    slots: SLOTS,
    addCard,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  };
}
