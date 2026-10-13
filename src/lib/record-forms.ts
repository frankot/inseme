import type { Article, TeamMember } from "@/db/schema";
import type { ArticleInput, TeamMemberInput } from "@/lib/validations/content";

/**
 * A record's live columns in its admin form's shape (empty strings, not
 * nulls). The edit page fills the form from it, the form compares against it
 * to mark what changed since publication, and the save actions store pending
 * changes in the same shape — so one comparison works everywhere.
 */

type TeamContent = Pick<
  TeamMember,
  "name" | "slug" | "role" | "qualifications" | "licenses" | "shortBio" | "longBio" | "photoId" | "sortOrder"
>;

export function teamFormOf(row: TeamContent): TeamMemberInput {
  return {
    name: row.name,
    slug: row.slug,
    role: row.role ?? "",
    qualifications: row.qualifications ?? "",
    licenses: row.licenses.map((license) => ({ name: license.name, number: license.number })),
    shortBio: row.shortBio ?? "",
    longBio: row.longBio ?? "",
    photoId: row.photoId,
    sortOrder: row.sortOrder,
  };
}

type ArticleContent = Pick<
  Article,
  | "title"
  | "slug"
  | "excerpt"
  | "body"
  | "authorReviewer"
  | "reviewerId"
  | "coverImageId"
  | "metaTitle"
  | "metaDescription"
>;

export function articleFormOf(row: ArticleContent): ArticleInput {
  return {
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    body: row.body,
    authorReviewer: row.authorReviewer ?? "",
    reviewerId: row.reviewerId,
    coverImageId: row.coverImageId,
    metaTitle: row.metaTitle ?? "",
    metaDescription: row.metaDescription ?? "",
  };
}
