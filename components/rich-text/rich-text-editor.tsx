"use client";

import { useRef, type ComponentProps } from "react";
import { BoldIcon, ItalicIcon, ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Textarea with a small formatting toolbar for the format RichText renders
 * (**bold**, *italic*, "- " bullets). Keeps stories portable plain text.
 */
export function RichTextEditor({
  value,
  onChange,
  className,
  ...props
}: Omit<ComponentProps<typeof Textarea>, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function apply(edit: (before: string, selected: string, after: string) => [string, number, number]) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const [next, selStart, selEnd] = edit(value.slice(0, start), value.slice(start, end), value.slice(end));
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selStart, selEnd);
    });
  }

  const wrap = (marker: string, placeholder: string) =>
    apply((before, selected, after) => {
      const text = selected || placeholder;
      return [
        `${before}${marker}${text}${marker}${after}`,
        before.length + marker.length,
        before.length + marker.length + text.length,
      ];
    });

  const bullet = () =>
    apply((before, selected, after) => {
      const lines = (selected || "List item").split("\n").map((l) => (l.startsWith("- ") ? l : `- ${l}`));
      // Lists need a blank line before them to render as their own block.
      const lead = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
      const block = lead + lines.join("\n");
      return [`${before}${block}${after}`, before.length + lead.length, before.length + block.length];
    });

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-white focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50", className)}>
      <div role="toolbar" aria-label="Formatting" className="flex gap-1 border-b bg-muted/50 px-2 py-1.5">
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Bold" onClick={() => wrap("**", "bold text")}>
          <BoldIcon />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Italic" onClick={() => wrap("*", "italic text")}>
          <ItalicIcon />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Bulleted list" onClick={bullet}>
          <ListIcon />
        </Button>
      </div>
      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-64 rounded-none border-0 bg-transparent text-base leading-relaxed shadow-none focus-visible:ring-0"
        {...props}
      />
    </div>
  );
}
