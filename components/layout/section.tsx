import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  description,
  action,
  id,
  className,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <h2 id={id} className="text-3xl font-bold text-noche sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="border-b bg-sand/60">
      <Container className="py-14 sm:py-20">
        <h1 className="max-w-3xl text-4xl font-extrabold text-noche sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        {children}
      </Container>
    </div>
  );
}
