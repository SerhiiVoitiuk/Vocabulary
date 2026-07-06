import { useState } from "react";

export default function AddCardForm({ onAdd }) {
  const [name, setName] = useState("");
  const [fact, setFact] = useState("");

  const submit = () => {
    if (!name.trim() || !fact.trim()) return;
    onAdd(name.trim(), fact.trim());
    setName("");
    setFact("");
  };

  return (
    <div className="mt-1 flex w-full max-w-xs flex-col gap-2">
      <input
        type="text"
        placeholder="Назва"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className="w-full rounded-md border border-fuchsia-500/30 bg-white/5 px-3 py-2 text-sm text-white placeholder-fuchsia-100/50 focus:border-fuchsia-400 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Текст на звороті"
        value={fact}
        onChange={(e) => setFact(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className="w-full rounded-md border border-fuchsia-500/30 bg-white/5 px-3 py-2 text-sm text-white placeholder-fuchsia-100/50 focus:border-fuchsia-400 focus:outline-none"
      />
      <button
        type="button"
        onClick={submit}
        className="w-full rounded-md bg-gradient-to-br from-cyan-300 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-purple-950 transition hover:brightness-110"
      >
        + Додати картку
      </button>
    </div>
  );
}
