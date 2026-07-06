export default function DeckReadout({ index, name }) {
  return (
    <div className="flex items-baseline gap-2 font-serif">
      <span className="text-sm text-white">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-base text-white">{name}</span>
    </div>
  );
}
