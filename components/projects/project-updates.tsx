import { FlagIcon, MegaphoneIcon, ReceiptIcon } from "lucide-react";
import type { ProjectUpdate } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const KIND = {
  milestone: { icon: FlagIcon, label: "Milestone" },
  spending: { icon: ReceiptIcon, label: "Spending" },
  general: { icon: MegaphoneIcon, label: "Update" },
} as const;

export function ProjectUpdates({ updates }: { updates: ProjectUpdate[] }) {
  if (updates.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
        No updates yet. Organizers post here whenever they hit a milestone or report spending.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-noche">Updates</h2>
      <ol className="relative mt-6 space-y-8 border-l-2 border-sand pl-8">
        {updates.map((u) => {
          const { icon: Icon, label } = KIND[u.kind];
          return (
            <li key={u.id} className="relative">
              <span className="absolute top-0 -left-[2.65rem] flex size-8 items-center justify-center rounded-full border-2 border-white bg-jade text-white">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <p className="text-sm text-muted-foreground">
                <time dateTime={u.date}>{formatDate(u.date)}</time>
                <span className="ml-2 rounded-full bg-sand px-2 py-0.5 text-xs font-medium text-noche">
                  {label}
                </span>
              </p>
              <h3 className="mt-1.5 text-lg font-bold text-noche">{u.title}</h3>
              <p className="mt-1 max-w-[68ch] leading-relaxed text-noche/80">{u.body}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
