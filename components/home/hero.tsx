import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import { ProjectProgress } from "@/components/projects/project-progress";
import type { Project } from "@/lib/types";
import { cn, formatCurrency, formatNumber, percentFunded } from "@/lib/utils";

function HeroCard({
  project,
  className,
  delay,
}: {
  project: Project;
  className?: string;
  delay: string;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "block w-[17.5rem] rounded-2xl border bg-white p-3 shadow-[0_24px_60px_-24px_rgba(24,33,59,0.35)] transition-transform hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-sand">
        <Image
          src={project.image}
          alt=""
          fill
          sizes="280px"
          className="object-cover"
          priority
        />
      </div>
      <div className="px-1 pt-3 pb-1">
        <p className="line-clamp-1 text-sm font-semibold text-noche">{project.title}</p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="tabular font-heading text-lg font-bold text-noche">
            {formatCurrency(project.raised)}
          </span>
          <span className="tabular text-xs font-semibold text-jade">
            {percentFunded(project.raised, project.goal)}% funded
          </span>
        </div>
        <div
          style={{ "--d": delay } as React.CSSProperties}
          className="mt-2 [&_.animate-fill]:[animation-delay:var(--d)]"
        >
          <ProjectProgress
            raised={project.raised}
            goal={project.goal}
            label={project.title}
            animate
          />
        </div>
        <p className="tabular mt-2 text-xs text-muted-foreground">
          {formatNumber(project.contributors)} contributors
        </p>
      </div>
    </Link>
  );
}

export function Hero({ projects }: { projects: [Project, Project, Project] }) {
  const [a, b, c] = projects;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Forward-motion stripes: the brand's single decorative gesture. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 hidden h-full w-[60rem] lg:block"
        viewBox="0 0 960 720"
        preserveAspectRatio="xMinYMid slice"
      >
        <path d="M120 0 480 360 120 720h180l360-360L300 0z" fill="var(--sand)" />
        <path d="M420 0 780 360 420 720h120l360-360L540 0z" fill="var(--jade-soft)" />
      </svg>

      <Container className="relative grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm font-medium text-noche">
            <span className="size-2 rounded-full bg-marigold" aria-hidden="true" />
            People-powered political action
          </p>
          <h1
            id="hero-title"
            className="mt-6 text-5xl leading-[0.95] font-extrabold tracking-[-0.045em] text-noche sm:text-6xl lg:text-7xl"
          >
            Move forward.
            <br />
            Together.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Palante Together gives people a transparent way to fund independent
            political initiatives, follow how money is spent, and see the impact
            of the projects they support.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="xl">
              <Link href="/explore">
                Explore Projects
                <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white">
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
          <p className="mt-8 inline-flex items-start gap-2 text-sm font-medium text-noche/80">
            <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-jade" aria-hidden="true" />
            Independent expenditures. Transparent funding. Public accountability.
          </p>
        </div>

        <div
          className="relative mx-auto h-[19rem] w-full max-w-[30rem] sm:h-[28rem]"
          aria-label="Projects currently raising funds"
          role="group"
        >
          <HeroCard
            project={b}
            delay="0.35s"
            className="absolute top-1/2 left-1/2 -translate-x-[78%] -translate-y-[58%] -rotate-[7deg] opacity-95 max-sm:hidden"
          />
          <HeroCard
            project={c}
            delay="0.7s"
            className="absolute top-1/2 left-1/2 -translate-x-[22%] -translate-y-[44%] rotate-[6deg] opacity-95 max-sm:hidden"
          />
          <HeroCard
            project={a}
            delay="0s"
            className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-[40%]"
          />
        </div>
      </Container>
    </section>
  );
}
