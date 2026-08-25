"use client";

import Link from "@tiptap/extension-link";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Output is HTML, sanitised server-side on save (`src/lib/sanitize.ts`).
 * The toolbar is deliberately narrow — headings start at H2 because H1 belongs
 * to the page title on the public site.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    // Tiptap can't render on the server without a hydration mismatch.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
      }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: cn(
          "prose-sm min-h-40 max-w-none px-3 py-2 outline-none",
          "[&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold",
          "[&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold",
          "[&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
          "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
          "[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
          "[&_a]:text-primary [&_a]:underline",
        ),
        "aria-label": placeholder ?? "Treść",
      },
    },
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Keep in sync when the form resets or a different record loads.
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";
    if (current !== next && !(current === "<p></p>" && next === "")) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="min-h-40 rounded-lg border bg-muted/30" aria-hidden />;
  }

  return (
    <div className="rounded-lg border focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  function toggleLink() {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const href = window.prompt("Adres URL (https://… , mailto:… lub tel:…)");
    if (!href) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  const buttons = [
    { key: "bold", icon: Bold, label: "Pogrubienie", run: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { key: "italic", icon: Italic, label: "Kursywa", run: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { key: "h2", icon: Heading2, label: "Nagłówek 2", run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { key: "h3", icon: Heading3, label: "Nagłówek 3", run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    { key: "ul", icon: List, label: "Lista punktowana", run: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { key: "ol", icon: ListOrdered, label: "Lista numerowana", run: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { key: "quote", icon: Quote, label: "Cytat", run: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b px-1 py-1">
      {buttons.map(({ key, icon: Icon, label, run, active }) => (
        <Button
          key={key}
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          aria-pressed={active}
          className={cn(active && "bg-muted text-foreground")}
          onClick={run}
        >
          <Icon className="size-4" aria-hidden />
        </Button>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={editor.isActive("link") ? "Usuń odnośnik" : "Wstaw odnośnik"}
        aria-pressed={editor.isActive("link")}
        className={cn(editor.isActive("link") && "bg-muted text-foreground")}
        onClick={toggleLink}
      >
        {editor.isActive("link") ? (
          <Link2Off className="size-4" aria-hidden />
        ) : (
          <Link2 className="size-4" aria-hidden />
        )}
      </Button>
    </div>
  );
}
