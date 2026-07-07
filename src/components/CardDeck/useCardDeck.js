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
      docId: item.$id ?? null, // реальний id документа в Appwrite, потрібен для updateWord
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

  // docId — id документа, який щойно створив createNewWord (response.$id)
  const addCard = useCallback(
    (word, translation, example1 = "", example2 = "", docId = null) => {
      const id = nextId.current++;
      setCards((c) => [
        ...c,
        { id, docId, word, translation, example1, example2 },
      ]);
      setOrder((o) => [id, ...o]);
    },
    [],
  );

  // Оновлює дані картки локально після успішного updateWord
  const updateCard = useCallback((id, data) => {
    setCards((c) =>
      c.map((card) => (card.id === id ? { ...card, ...data } : card)),
    );
  }, []);

  const frontCard = cards.find((c) => c.id === order[0]);

  return {
    cards,
    order,
    flipped,
    frontCard,
    addCard,
    updateCard,
    next,
    prev,
    toggleFlip,
  };
}
