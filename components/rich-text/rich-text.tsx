import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight rich text used for fundraiser stories:
 *   blank line  → new paragraph
 *   "- " lines  → bulleted list
 *   **bold**, *italic*
 * Rendered as React elements (never raw HTML), so user content can't inject markup.
 */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index));
    out.push(
      match[1] !== undefined ? (
        <strong key={match.index} className="font-semibold text-noche">{match[1]}</strong>
      ) : (
        <em key={match.index}>{match[2]}</em>
      ),
    );
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function withBreaks(text: string) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {inline(line)}
    </Fragment>
  ));
}

export function RichText({ source, className }: { source: string; className?: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return (
    <div className={cn("space-y-4 text-lg leading-relaxed text-noche/85", className)}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-6 marker:text-jade">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.trim().slice(2))}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{withBreaks(block)}</p>;
      })}
    </div>
  );
}
