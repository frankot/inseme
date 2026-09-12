"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { ContactPathId } from "@/content/home";

type ContactPathValue = {
  path: ContactPathId;
  setPath: (path: ContactPathId) => void;
};

const ContactPathContext = createContext<ContactPathValue | null>(null);

/**
 * Which of the two paths — "for me" or "for someone close" — the visitor picked.
 *
 * The choice is made on the hero cards and read further down the page by
 * section 03, so it lives above both rather than in either. It is deliberately
 * not in the URL: a shared link should open the page the way everyone else
 * sees it, and switching paths shouldn't add history entries.
 */
export function ContactPathProvider({
  children,
  initial = "self",
}: {
  children: ReactNode;
  initial?: ContactPathId;
}) {
  const [path, setPath] = useState<ContactPathId>(initial);
  return (
    <ContactPathContext value={{ path, setPath }}>{children}</ContactPathContext>
  );
}

/** Falls back to local state, so either consumer also works on its own. */
export function useContactPath(initial: ContactPathId = "self"): ContactPathValue {
  const shared = useContext(ContactPathContext);
  const [path, setPath] = useState<ContactPathId>(initial);
  return shared ?? { path, setPath };
}
