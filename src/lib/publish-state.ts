/**
 * The status columns a save writes. A record is a draft (hidden) or published;
 * the admin form's two buttons pick which. Re-saving a published record keeps
 * its original publication date, so a typo fix doesn't move an article to the
 * top of the list.
 */
export function publishState(publish: boolean, previousPublishedAt?: Date | null) {
  return publish
    ? { status: "published" as const, publishedAt: previousPublishedAt ?? new Date() }
    : { status: "draft" as const };
}
