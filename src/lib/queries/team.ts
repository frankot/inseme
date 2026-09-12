import "server-only";

import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { teamMembers, type Media, type TeamMember } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";
import type { MediaSummary } from "@/lib/media-types";

/**
 * Read side of `team_members` for the public site. The admin panel queries the
 * table directly because it needs drafts; everything here is published-only and
 * ordered the way `/admin/team` promises — by the "Kolejność" field, then name.
 */

/** What `<TeamCard>` needs: no `longBio`, so lists don't carry every biography. */
export type TeamCardData = {
  id: string;
  slug: string;
  name: string;
  role: string | null;
  qualifications: string | null;
  shortBio: string | null;
  photo: MediaSummary | null;
};

/** The detail page adds the sanitised rich-text biography. */
export type TeamMemberDetail = TeamCardData & { longBio: string | null };

const publishedOnly = eq(teamMembers.status, "published");
const byOrder = [asc(teamMembers.sortOrder), asc(teamMembers.name)] as const;

type Row = TeamMember & { photo: Media | null };

function toCard(row: Row): TeamCardData {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    qualifications: row.qualifications,
    shortBio: row.shortBio,
    photo: row.photo ? toMediaSummary(row.photo) : null,
  };
}

/** Everyone published, for /zespol. */
export async function getPublishedTeam(): Promise<TeamCardData[]> {
  const rows = await db.query.teamMembers.findMany({
    where: publishedOnly,
    orderBy: [...byOrder],
    with: { photo: true },
  });
  return rows.map(toCard);
}

/**
 * The homepage teaser. "Featured" is simply the top of the manual ordering —
 * editors already control it with the Kolejność field, so there is no second
 * flag to keep in sync.
 */
export async function getFeaturedTeam(limit = 3): Promise<TeamCardData[]> {
  const rows = await db.query.teamMembers.findMany({
    where: publishedOnly,
    orderBy: [...byOrder],
    limit,
    with: { photo: true },
  });
  return rows.map(toCard);
}

/** One person, or null when the slug is unknown or the row is still a draft. */
export async function getTeamMemberBySlug(
  slug: string,
): Promise<TeamMemberDetail | null> {
  const row = await db.query.teamMembers.findFirst({
    where: and(publishedOnly, eq(teamMembers.slug, slug)),
    with: { photo: true },
  });
  return row ? { ...toCard(row), longBio: row.longBio } : null;
}

/** Slugs alone, for `generateStaticParams`. */
export async function getTeamSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: teamMembers.slug })
    .from(teamMembers)
    .where(publishedOnly)
    .orderBy(...byOrder);
  return rows.map((row) => row.slug);
}
