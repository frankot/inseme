"use client";

import { useLayoutEffect, useRef, useState, type ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * A one-line field for short texts that often run long — photo captions and
 * alt texts. At rest it is exactly an `<Input>`: one line, the overflow cut
 * off. Focused, it grows to show the whole text, wrapped, so a long
 * description can be read and edited without scrolling sideways; on blur it
 * folds back.
 *
 * Still a single-line value: Enter finishes editing instead of adding a line
 * break, and pasted line breaks become spaces.
 */
export function ExpandingInput({
  value,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  className,
  ...props
}: Omit<ComponentProps<"textarea">, "value" | "onChange" | "rows"> & {
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  // Fit the height to the text while focused; one line otherwise.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "";
    if (focused) el.style.height = `${el.scrollHeight + 2}px`;
  }, [focused, value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/[\r\n]+/g, " "))}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        event.currentTarget.scrollTop = 0;
        onBlur?.(event);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
        onKeyDown?.(event);
      }}
      className={cn(
        // The same look as <Input>, so the two sit side by side unnoticed.
        "block min-h-8 w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-2.5 py-[5px] text-base leading-5 transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        // At rest: one line, cut off like an input. Focused: wrapped in full.
        focused ? "overflow-hidden whitespace-pre-wrap" : "h-8 overflow-hidden whitespace-nowrap text-ellipsis",
        className,
      )}
      {...props}
    />
  );
}
