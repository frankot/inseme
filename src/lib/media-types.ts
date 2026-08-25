/** The media fields the admin UI actually needs — shared by pickers and lists. */
export type MediaSummary = {
  id: string;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  mimeType: string;
  size: number;
  uploadedAt: string;
};
