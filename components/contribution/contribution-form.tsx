"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2Icon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ContributionAmount } from "@/components/contribution/contribution-amount";
import type { Project } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const ATTESTATIONS = [
  { id: "citizen", label: "I am a U.S. citizen or lawfully admitted permanent resident." },
  { id: "own-funds", label: "This contribution is made from my own funds, not those of another person." },
  { id: "not-contractor", label: "I am not a federal government contractor." },
  { id: "age", label: "I am at least 18 years old." },
] as const;

const FIELDS = [
  { name: "firstName", label: "First name", autoComplete: "given-name", span: 1 },
  { name: "lastName", label: "Last name", autoComplete: "family-name", span: 1 },
  { name: "email", label: "Email", autoComplete: "email", type: "email", span: 2 },
  { name: "street", label: "Street address", autoComplete: "street-address", span: 2 },
  { name: "city", label: "City", autoComplete: "address-level2", span: 1 },
  { name: "state", label: "State", autoComplete: "address-level1", span: 1 },
  { name: "zip", label: "ZIP code", autoComplete: "postal-code", inputMode: "numeric", span: 1 },
  { name: "employer", label: "Employer", autoComplete: "organization", span: 1 },
  { name: "occupation", label: "Occupation", autoComplete: "organization-title", span: 2 },
] as const;

export function ContributionForm({ project }: { project: Project }) {
  const [amount, setAmount] = useState<number | null>(50);
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [attested, setAttested] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const allAttested = ATTESTATIONS.every((a) => attested[a.id]);
  const amountLabel = amount ? formatCurrency(amount) : "$0";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!amount || amount < 1) {
      setError("Enter a contribution amount of at least $1.");
      return;
    }
    if (!allAttested) {
      setError("Confirm each statement under Contributor eligibility to continue.");
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border bg-card p-8 text-center sm:p-12" role="status">
        <CheckCircle2Icon className="mx-auto size-12 text-jade" aria-hidden="true" />
        <h2 className="mt-5 text-3xl font-extrabold text-noche">Thank you for moving this forward</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
          Your {frequency === "monthly" ? "monthly " : ""}contribution of{" "}
          <span className="tabular font-semibold text-noche">{amountLabel}</span> to{" "}
          {project.title} was recorded in this preview. No payment was processed.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="brand" size="xl">
            <Link href={`/projects/${project.slug}#updates`}>Follow project updates</Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link href="/dashboard">Go to your dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="rounded-3xl border bg-card p-6 sm:p-8">
        <ContributionAmount value={amount} onChange={setAmount} />

        <fieldset className="mt-8">
          <legend className="font-heading text-lg font-bold text-noche">Frequency</legend>
          <RadioGroup
            value={frequency}
            onValueChange={(v) => setFrequency(v as "once" | "monthly")}
            className="mt-4 grid grid-cols-2 gap-2.5"
          >
            {[
              { value: "once", label: "One time" },
              { value: "monthly", label: "Monthly" },
            ].map((opt) => (
              <Label
                key={opt.value}
                htmlFor={`freq-${opt.value}`}
                className="flex h-12 cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 text-base font-medium has-data-[state=checked]:border-noche has-data-[state=checked]:bg-sand/60"
              >
                <RadioGroupItem id={`freq-${opt.value}`} value={opt.value} />
                {opt.label}
              </Label>
            ))}
          </RadioGroup>
        </fieldset>
      </section>

      <section className="rounded-3xl border bg-card p-6 sm:p-8">
        <h2 className="font-heading text-lg font-bold text-noche">Your information</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Federal law requires us to collect and report the name, mailing
          address, occupation, and employer of contributors whose contributions
          total more than $200 in a calendar year.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.name} className={f.span === 2 ? "sm:col-span-2" : undefined}>
              <Label htmlFor={f.name} className="text-sm font-medium text-noche">
                {f.label}
              </Label>
              <Input
                id={f.name}
                name={f.name}
                type={"type" in f ? f.type : "text"}
                inputMode={"inputMode" in f ? f.inputMode : undefined}
                autoComplete={f.autoComplete}
                required
                className="mt-1.5 h-11 bg-white"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 sm:p-8">
        <fieldset>
          <legend className="font-heading text-lg font-bold text-noche">Contributor eligibility</legend>
          <p className="mt-1 text-sm text-muted-foreground">By contributing, I confirm that:</p>
          <ul className="mt-4 space-y-3">
            {ATTESTATIONS.map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <Checkbox
                  id={a.id}
                  checked={attested[a.id] ?? false}
                  onCheckedChange={(c) => setAttested((prev) => ({ ...prev, [a.id]: c === true }))}
                  className="mt-0.5"
                />
                <Label htmlFor={a.id} className="text-sm leading-relaxed font-normal text-noche">
                  {a.label}
                </Label>
              </li>
            ))}
          </ul>
        </fieldset>
      </section>

      <section className="rounded-3xl border border-dashed bg-muted/50 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-noche">
          <LockIcon className="size-4" aria-hidden="true" />
          Payment
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Payment processing isn&apos;t connected in this preview. Submitting
          the form records a demo contribution only.
        </p>
      </section>

      {error ? (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}

      <div>
        <Button type="submit" variant="brand" size="xl" className="tabular w-full">
          Contribute {amountLabel}
          {frequency === "monthly" ? " monthly" : ""}
        </Button>
        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
          Contributions to {project.title} support independent expenditures by
          Palante Together PAC and are not tax deductible.
        </p>
      </div>
    </form>
  );
}
