export default function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
      <div
        key={toast.key}
        className={`fixed bottom-6 left-1/2 z-[60] w-fit max-w-[90vw] rounded-full border px-5 py-3 text-center text-sm font-medium shadow-2xl ${
          isError
            ? "border-red-400/40 bg-red-950/90 text-red-200"
            : "border-cyan-400/40 bg-cyan-950/90 text-cyan-100"
        }`}
        style={{ animation: "toastIn 0.3s ease-out" }}
      >
        {toast.message}
      </div>
    </>
  );
}
