import { useCallback, useEffect, useRef, useState } from "react";

export function useCardDeck(initialItems = []) {
  const [cards, setCards] = useState([]);
  const [order, setOrder] = useState([]);
  const [flipped, setFlipped] = useState(() => new Set());

  const nextId = useRef(0);
  const initializedRef = useRef(false);

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

  const addCard = useCallback(
    (word, translation, example1 = "", example2 = "") => {
      const id = nextId.current++;
      setCards((c) => [...c, { id, word, translation, example1, example2 }]);
      setOrder((o) => [id, ...o]);
    },
    [],
  );

  const frontCard = cards.find((c) => c.id === order[0]);

  return { cards, order, flipped, frontCard, addCard, next, prev, toggleFlip };
}
