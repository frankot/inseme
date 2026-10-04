import { setFeatured } from "@/app/admin/(shell)/cms/actions";
import type { FeaturedToggle } from "@/components/admin/row-actions";
import type { FeaturedSlot } from "@/lib/cms/featured";

/** The dropdown items for one row: one switch per slot its kind can fill. */
export function featuredToggles(slots: FeaturedSlot[], id: string): FeaturedToggle[] {
  return slots.map((slot) => {
    const on = slot.ids.has(id);
    return {
      label: slot.label,
      on,
      full: !on && slot.ids.size >= slot.max && slot.max > 1,
      onToggle: setFeatured.bind(null, slot.key, id, !on),
    };
  });
}

/** True when the row sits in any slot — for the ★ badge in the lists. */
export function isFeatured(slots: FeaturedSlot[], id: string): boolean {
  return slots.some((slot) => slot.ids.has(id));
}
