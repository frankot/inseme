import "server-only";

import type { Block } from "@/lib/blocks";
import { sanitizeRichText } from "@/lib/sanitize";

/** Every editor-authored HTML string inside a block tree gets sanitised on save. */
export function sanitizeBlocks(blocks: Block[]): Block[] {
  return blocks.map((block) => {
    switch (block.type) {
      case "richtext":
      case "image_text":
        return { ...block, html: sanitizeRichText(block.html) };
      default:
        return block;
    }
  });
}
