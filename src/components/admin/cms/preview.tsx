"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export type PreviewHandle = {
  /** Re-render the draft (after a save), keeping the scroll position. */
  refresh: () => void;
  /** Scroll the preview to a section and outline it. */
  focus: (sectionId: string) => void;
};

/** The site is designed at this width; the frame is scaled down to the pane. */
const DESKTOP = 1440;

/**
 * The live preview (plans/CMS_PLAN.md §5, simplified): an iframe of the real
 * site rendering the draft, desktop width only, scaled to fit. It talks to the
 * frame through `postMessage`; the frame's bridge is `PreviewBridge`.
 */
export const CmsPreview = forwardRef<PreviewHandle, { pageKey: string }>(function CmsPreview(
  { pageKey },
  ref,
) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [size, setSize] = useState({ width: DESKTOP, height: 800 });

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useImperativeHandle(ref, () => {
    const post = (message: object) =>
      frame.current?.contentWindow?.postMessage(message, window.location.origin);
    return {
      refresh: () => post({ type: "cms:refresh" }),
      focus: (sectionId) => post({ type: "cms:focus", sectionId }),
    };
  }, []);

  const scale = size.width / DESKTOP;

  return (
    <div ref={box} className="relative min-w-0 overflow-hidden bg-muted/40">
      <iframe
        ref={frame}
        title="Podgląd strony"
        src={`/admin/preview/${pageKey}`}
        className="absolute top-0 left-0 origin-top-left border-0 bg-white"
        style={{
          width: DESKTOP,
          height: size.height / scale,
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
});
