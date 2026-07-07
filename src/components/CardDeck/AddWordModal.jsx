import { useEffect, useState } from "react";

export default function AddWordModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  submitLabel = "Add Word",
}) {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [example1, setExample1] = useState("");
  const [example2, setExample2] = useState("");
  const [saving, setSaving] = useState(false);

  // Заповнюємо поля щоразу, коли модалка відкривається (порожні для додавання, заповнені для редагування)
  useEffect(() => {
    if (isOpen) {
      setWord(initialValues?.word ?? "");
      setTranslation(initialValues?.translation ?? "");
      setExample1(initialValues?.example1 ?? "");
      setExample2(initialValues?.example2 ?? "");
    }
  }, [isOpen, initialValues]);

  // Закриття по Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const canSubmit = word.trim().length > 0 && !saving;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      await onSubmit({
        word: word.trim(),
        translation: translation.trim(),
        example1: example1.trim(),
        example2: example2.trim(),
      });
      onClose();
    } catch (err) {
      console.error("Не вдалося зберегти слово:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-md flex-col rounded-2xl border border-fuchsia-500/30 bg-gradient-to-br from-purple-950 to-fuchsia-950 p-5 sm:h-auto sm:max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="Закрити"
        >
          ✕
        </button>

        <h2 className="mb-5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text pr-10 text-xl font-extrabold italic uppercase tracking-tight text-transparent">
          New Word
        </h2>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-fuchsia-100/70">
              Word (in English) *
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Example: apple"
              className="w-full rounded-md border border-fuchsia-500/30 bg-white/5 px-3 py-2 text-white placeholder-fuchsia-100/40 focus:border-fuchsia-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-fuchsia-100/70">
              translation (in Ukrainian)
            </label>
            <input
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Example: яблуко"
              className="w-full rounded-md border border-fuchsia-500/30 bg-white/5 px-3 py-2 text-white placeholder-fuchsia-100/40 focus:border-fuchsia-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-fuchsia-100/70">
              Example 1
            </label>
            <input
              type="text"
              value={example1}
              onChange={(e) => setExample1(e.target.value)}
              placeholder="I ate an apple."
              className="w-full rounded-md border border-fuchsia-500/30 bg-white/5 px-3 py-2 text-white placeholder-fuchsia-100/40 focus:border-fuchsia-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-fuchsia-100/70">
              Example 2
            </label>
            <input
              type="text"
              value={example2}
              onChange={(e) => setExample2(e.target.value)}
              placeholder="This apple is red."
              className="w-full rounded-md border border-fuchsia-500/30 bg-white/5 px-3 py-2 text-white placeholder-fuchsia-100/40 focus:border-fuchsia-400 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-4 w-full shrink-0 rounded-md bg-gradient-to-br from-cyan-300 to-fuchsia-500 px-3 py-3 text-sm font-semibold text-purple-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </div>
  );
}
