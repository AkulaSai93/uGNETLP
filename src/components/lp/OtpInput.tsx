"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

/** Six single-digit boxes: auto-advance, backspace to previous, paste a full code, SMS autofill. */
export function OtpInput({
  value,
  onChange,
  invalid,
  disabled,
  length = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  length?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const setAt = (i: number, d: string) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join("").slice(0, length));
  };

  const onInput = (i: number, raw: string) => {
    const clean = raw.replace(/\D/g, "");
    if (!clean) return setAt(i, "");
    if (clean.length > 1) {
      // autofill or fast typing: spread across the boxes
      const next = (value.slice(0, i) + clean).slice(0, length);
      onChange(next);
      focus(next.length);
      return;
    }
    setAt(i, clean);
    focus(i + 1);
  };

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i]) {
      e.preventDefault();
      setAt(i - 1, "");
      focus(i - 1);
    } else if (e.key === "ArrowLeft") focus(i - 1);
    else if (e.key === "ArrowRight") focus(i + 1);
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const code = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!code) return;
    e.preventDefault();
    onChange(code);
    focus(code.length);
  };

  return (
    <div role="group" aria-label="One-time code" className="flex gap-1.5 sm:gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          onChange={(e) => onInput(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          onPaste={onPaste}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={length}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid}
          className={`h-12 w-full min-w-0 rounded-[4px] border bg-white text-center text-[20px] font-semibold text-ink outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/[0.06] disabled:opacity-60 sm:w-11 ${invalid ? "border-accent" : "border-black/[0.12]"}`}
        />
      ))}
    </div>
  );
}
