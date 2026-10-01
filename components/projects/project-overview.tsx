import {
  BookOpenIcon,
  MailIcon,
  MapIcon,
  MegaphoneIcon,
  PhoneIcon,
  SearchIcon,
  UsersIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react";
import type { Project, StrategyIcon } from "@/lib/types";

const ICONS: Record<StrategyIcon, LucideIcon> = {
  megaphone: MegaphoneIcon,
  users: UsersIcon,
  book: BookOpenIcon,
  video: VideoIcon,
  mail: MailIcon,
  search: SearchIcon,
  map: MapIcon,
  phone: PhoneIcon,
};

function Prose({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-noche">{title}</h2>
      <div className="mt-3 max-w-[68ch] space-y-4 text-[1.05rem] leading-relaxed text-noche/85">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}

export function ProjectOverview({ project }: { project: Project }) {
  return (
    <div className="space-y-12">
      <Prose title="The Project" paragraphs={project.overview} />
      <Prose title="Why This Matters" paragraphs={project.whyItMatters} />

      <section>
        <h2 className="text-2xl font-bold text-noche">Strategy</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {project.strategy.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <li key={s.title} className="rounded-2xl border bg-card p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-jade-soft text-jade">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-noche">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="rounded-2xl border-l-4 border-marigold bg-sand p-5 text-sm leading-relaxed text-noche">
        <p className="font-semibold">Independent expenditure</p>
        <p className="mt-1 text-noche/80">
          This project is funded and run independently. It is not authorized by,
          and does not coordinate with, any candidate, campaign, or political
          party.
        </p>
      </aside>
    </div>
  );
}
