import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null); // { message, type, key }
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    clearTimeout(timeoutRef.current);
    setToast({ message, type, key: Date.now() });
    timeoutRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
}
