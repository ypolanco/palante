import { EyeIcon, TrendingUpIcon, UsersRoundIcon } from "lucide-react";
import { Container } from "@/components/layout/section";

const VALUES = [
  {
    title: "Community",
    body: "Political participation powered by people.",
    icon: UsersRoundIcon,
  },
  {
    title: "Transparency",
    body: "Know where funding goes.",
    icon: EyeIcon,
  },
  {
    title: "Momentum",
    body: "Turn individual contributions into collective impact.",
    icon: TrendingUpIcon,
  },
];

export function CommunityMessage() {
  return (
    <section aria-labelledby="community-title" className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <h2
            id="community-title"
            className="text-4xl leading-[1.02] font-extrabold tracking-[-0.035em] text-noche sm:text-5xl"
          >
            Progress happens when people move together.
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Political participation shouldn&apos;t feel distant or inaccessible.
            </p>
            <p>
              Palante Together helps people collectively support independent
              initiatives and understand how political money is being used.
            </p>
          </div>
        </div>

        <ul className="grid gap-4 self-center">
          {VALUES.map(({ title, body, icon: Icon }) => (
            <li key={title} className="flex gap-4 rounded-2xl bg-sand p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-jade">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-noche">{title}</h3>
                <p className="mt-0.5 text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
