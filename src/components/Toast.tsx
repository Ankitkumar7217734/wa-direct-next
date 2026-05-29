"use client";

import { useEffect, useRef } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, visible, onHide }: ToastProps) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (visible) {
      clearTimeout(timer.current);
      timer.current = setTimeout(onHide, 2400);
    }
    return () => clearTimeout(timer.current);
  }, [visible, message, onHide]);

  return (
    <div className={`wa-toast ${visible ? "show" : ""}`}>{message}</div>
  );
}
