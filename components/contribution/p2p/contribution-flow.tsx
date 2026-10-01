"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowLeftIcon, CircleCheckIcon, HeartIcon, LoaderCircleIcon, LockIcon, PlusIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ComplianceCopy,
  CompliancePlaceholder,
  FundsDisclosure,
} from "@/components/compliance/compliance-copy";
import { FundraiserCover } from "@/components/fundraisers/media";
import { ProjectProgress } from "@/components/projects/project-progress";
import { SharePanel } from "@/components/share/share-panel";
import { CONTRIBUTION_COMPLIANCE } from "@/lib/compliance";
import { COMMITTEE } from "@/lib/mock-data";
import {
  submitContribution,
  type ContributionFrequency,
  type ContributionReceipt,
  type DonorInfo,
} from "@/lib/services/contributions";
import { referralChannelFrom } from "@/lib/share";
import type { Fundraiser } from "@/lib/types";
import { cn, formatCurrency, formatNumber, percentFunded } from "@/lib/utils";

export const SUGGESTED_AMOUNTS = [10, 25, 50, 100, 250];
/** Preselected when someone taps the generic Contribute button. */
export const DEFAULT_AMOUNT = 50;

// Three steps, not four: every extra screen in a checkout costs completions.
// Compliance fields ride along with the donor details, and attestations sit
// right above the final button where they read as part of submitting.
const STEPS = [
  { key: "amount", label: "Amount" },
  { key: "details", label: "Your details" },
  { key: "review", label: "Review & pay" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

const DONOR_FIELDS: Array<{
  name: keyof DonorInfo;
  label: string;
  autoComplete: string;
  type?: string;
  inputMode?: "numeric" | "tel";
  wide?: boolean;
  optional?: boolean;
}> = [
  { name: "firstName", label: "First name", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", autoComplete: "family-name" },
  { name: "email", label: "Email", autoComplete: "email", type: "email", wide: true },
  { name: "street", label: "Street address", autoComplete: "street-address", wide: true },
  { name: "city", label: "City", autoComplete: "address-level2", wide: true },
  { name: "state", label: "State", autoComplete: "address-level1" },
  { name: "zip", label: "ZIP code", autoComplete: "postal-code", inputMode: "numeric" },
  { name: "phone", label: "Phone", autoComplete: "tel", type: "tel", inputMode: "tel", wide: true, optional: true },
];

const EMPTY_DONOR: DonorInfo = {
  firstName: "", lastName: "", email: "", phone: "", street: "", city: "", state: "", zip: "",
};

const FIELD = "mt-1.5 h-11 bg-white text-base";

/** "$50" or "$50/mo". */
function formatAmount(amount: number, frequency: ContributionFrequency) {
  return `${formatCurrency(amount)}${frequency === "monthly" ? "/mo" : ""}`;
}

const FREQUENCIES: Array<{ value: ContributionFrequency; label: string }> = [
  { value: "one-time", label: "One-time" },
  { value: "monthly", label: "Monthly" },
];

function FrequencyToggle({
  value,
  onChange,
}: {
  value: ContributionFrequency;
  onChange: (value: ContributionFrequency) => void;
}) {
  return (
    <div role="radiogroup" aria-label="How often" className="grid grid-cols-2 gap-1 rounded-2xl bg-sand p-1">
      {FREQUENCIES.map((f) => {
        const selected = value === f.value;
        return (
          <button
            key={f.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(f.value)}
            className={cn(
              "flex h-11 items-center justify-center gap-1.5 rounded-xl text-base font-semibold transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              selected ? "bg-white text-noche shadow-sm" : "text-noche/70 hover:text-noche",
            )}
          >
            {f.value === "monthly" ? (
              <HeartIcon className={cn("size-4", selected ? "fill-bougainvillea text-bougainvillea" : "")} aria-hidden="true" />
            ) : null}
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

function AmountPicker({
  value,
  onChange,
  focusCustom,
  monthly,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  focusCustom: boolean;
  monthly: boolean;
}) {
  const customId = useId();
  const customRef = useRef<HTMLInputElement>(null);
  const isPreset = value !== null && SUGGESTED_AMOUNTS.includes(value);
  const [customText, setCustomText] = useState(!isPreset && value !== null ? String(value) : "");

  useEffect(() => {
    if (focusCustom) customRef.current?.focus();
  }, [focusCustom]);

  const tile = (selected: boolean) =>
    cn(
      "tabular relative h-14 rounded-2xl border-2 text-lg font-bold transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]",
      selected ? "border-noche bg-noche text-white shadow-md" : "border-border bg-white text-noche hover:border-noche/40",
    );

  return (
    <fieldset>
      <legend className="sr-only">Choose an amount</legend>
      <div className="grid grid-cols-3 gap-2.5">
        {SUGGESTED_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            aria-pressed={value === amount}
            onClick={() => {
              setCustomText("");
              onChange(amount);
            }}
            className={tile(value === amount)}
          >
            {amount === DEFAULT_AMOUNT ? (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-marigold px-2 py-0.5 font-sans text-[0.65rem] font-bold tracking-wide whitespace-nowrap text-noche uppercase">
                Suggested
              </span>
            ) : null}
            ${amount.toLocaleString("en-US")}
            {monthly ? <span className="text-sm font-semibold opacity-70">/mo</span> : null}
          </button>
        ))}
        <div className="relative">
          <label htmlFor={customId} className="sr-only">Other amount in dollars</label>
          <span
            className={cn(
              "pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-lg font-bold",
              customText ? "text-white" : "text-muted-foreground",
            )}
            aria-hidden="true"
          >
            $
          </span>
          <input
            id={customId}
            ref={customRef}
            inputMode="decimal"
            placeholder="Other"
            value={customText}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9.]/g, "");
              setCustomText(cleaned);
              const parsed = Number.parseFloat(cleaned);
              onChange(cleaned === "" || Number.isNaN(parsed) ? null : parsed);
            }}
            className={cn(
              tile(customText !== ""),
              "w-full pr-3 pl-8 text-left placeholder:font-semibold placeholder:text-noche/70 active:scale-100",
            )}
          />
        </div>
      </div>
    </fieldset>
  );
}

export function ContributionFlow({
  fundraiser,
  organizerFirstName,
  initialAmount,
  onProgressChange,
  onClose,
}: {
  fundraiser: Fundraiser;
  organizerFirstName: string;
  /** `null` opens with the custom amount field focused. */
  initialAmount: number | null;
  /** True once the donor is past the amount step and hasn't finished. */
  onProgressChange?: (inProgress: boolean) => void;
  onClose: () => void;
}) {
  const formId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState<StepKey>("amount");
  const [amount, setAmount] = useState<number | null>(initialAmount);
  const [frequency, setFrequency] = useState<ContributionFrequency>("one-time");
  const monthly = frequency === "monthly";
  const [donor, setDonor] = useState<DonorInfo>(EMPTY_DONOR);
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [attestations, setAttestations] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ContributionReceipt | null>(null);
  const mounted = useRef(false);

  const index = STEPS.findIndex((s) => s.key === step);
  const fundraiserLabel = `${organizerFirstName}'s fundraiser`;
  const projectedPct = percentFunded(fundraiser.raised + (amount ?? 0), fundraiser.goal);
  const crossesGoal = fundraiser.raised < fundraiser.goal && fundraiser.raised + (amount ?? 0) >= fundraiser.goal;

  useEffect(() => {
    onProgressChange?.(step !== "amount" && !receipt);
  }, [step, receipt, onProgressChange]);

  useEffect(() => {
    // On first open, leave focus where the amount picker put it.
    if (!mounted.current) {
      mounted.current = true;
      if (initialAmount === null) return;
    }
    headingRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, receipt]);

  function goTo(next: StepKey) {
    setError(null);
    setStep(next);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (step === "amount") {
      if (!amount || amount < 1) {
        setError("Choose or enter an amount of at least $1.");
        return;
      }
      setStep("details");
      return;
    }
    if (step === "details") {
      setStep("review");
      return;
    }

    const missing = CONTRIBUTION_COMPLIANCE.attestations.some((a) => a.required && !attestations[a.id]);
    if (missing) {
      setError("Please confirm the statement above to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitContribution({
        amount: amount ?? 0,
        currency: "USD",
        frequency,
        donor,
        compliance: { configSource: CONTRIBUTION_COMPLIANCE.source, fields, attestations },
        publicDisplay: { anonymous, message: message.trim() || undefined },
        paymentToken: null,
        attribution: {
          fundraiserId: fundraiser.id,
          referralChannel: referralChannelFrom(window.location.search),
          landingPath: window.location.pathname,
        },
      });
      setReceipt(result);
    } catch {
      setError("Something went wrong and your contribution wasn't completed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (receipt) {
    const newRaised = fundraiser.raised + receipt.amount;
    return (
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))]" role="status">
        <CircleCheckIcon className="size-12 text-jade" aria-hidden="true" />
        <h2 ref={headingRef} tabIndex={-1} className="mt-5 text-3xl leading-tight font-extrabold text-noche outline-none">
          Thank you{donor.firstName ? `, ${donor.firstName}` : ""}!
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {receipt.frequency === "monthly"
            ? `Your ${formatCurrency(receipt.amount)} monthly contribution is set up, and your first one already moved ${fundraiserLabel} closer to its goal.`
            : `Your ${formatCurrency(receipt.amount)} helped ${fundraiserLabel} move closer to its goal.`}
        </p>

        <div className="mt-6 rounded-2xl border bg-sand/50 p-5">
          <p className="tabular font-heading text-2xl font-bold text-noche">
            {formatCurrency(newRaised)}{" "}
            <span className="font-sans text-base font-medium text-muted-foreground">
              of {formatCurrency(fundraiser.goal)}
            </span>
          </p>
          <ProjectProgress raised={newRaised} goal={fundraiser.goal} label={fundraiser.title} size="lg" animate className="mt-3" />
          <p className="tabular mt-2 text-sm font-semibold text-jade">
            {percentFunded(newRaised, fundraiser.goal)}% of the goal
          </p>
        </div>

        <h3 className="mt-8 font-heading text-xl font-bold text-noche">Double your impact: share it</h3>
        <p className="mt-1 text-muted-foreground">
          Fundraisers grow when people share them. Ask a friend to join you.
        </p>
        <SharePanel fundraiser={fundraiser} className="mt-5" />

        <div className="mt-8 space-y-3">
          <ComplianceCopy slot="contribution-confirmation-notice" />
          {!receipt.processed ? (
            <p className="text-xs text-muted-foreground">
              Preview: this contribution was not processed and no payment was taken.
            </p>
          ) : null}
        </div>
        <Button variant="outline" size="xl" className="mt-6 w-full" onClick={onClose}>
          Back to fundraiser
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="border-b px-5 pt-5 pb-4 sm:px-6">
        <div className="flex items-center gap-3 pr-10">
          {index > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="-ml-1.5 shrink-0 rounded-full"
              onClick={() => goTo(STEPS[index - 1].key)}
              aria-label="Previous step"
            >
              <ArrowLeftIcon />
            </Button>
          ) : (
            <FundraiserCover src={fundraiser.coverImage} alt="" sizes="48px" className="size-12 shrink-0 rounded-xl" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">You&apos;re supporting</p>
            <p className="truncate font-heading text-base leading-tight font-bold text-noche">{fundraiser.title}</p>
          </div>
        </div>
        <ol className="mt-4 grid grid-cols-3 gap-1.5" aria-label={`Step ${index + 1} of ${STEPS.length}: ${STEPS[index].label}`}>
          {STEPS.map((s, i) => (
            <li key={s.key} aria-hidden="true">
              <span className={cn("block h-1 rounded-full transition-colors", i <= index ? "bg-jade" : "bg-sand")} />
              <span className={cn("mt-1.5 block text-[0.7rem] font-medium", i === index ? "text-noche" : "text-muted-foreground")}>
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <form id={formId} onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6" noValidate={step !== "details"}>
        {step === "amount" ? (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold text-noche outline-none">
              Choose your contribution
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <UsersIcon className="size-4 shrink-0 text-jade" aria-hidden="true" />
              {fundraiser.contributorCount > 0
                ? `Join ${formatNumber(fundraiser.contributorCount)} ${fundraiser.contributorCount === 1 ? "person who has" : "people who have"} already given.`
                : "Be the first to give and get things moving."}
            </p>

            <div className="mt-6">
              <FrequencyToggle value={frequency} onChange={setFrequency} />
            </div>
            <div className="mt-5">
              <AmountPicker value={amount} onChange={setAmount} focusCustom={initialAmount === null} monthly={monthly} />
            </div>

            <div className="mt-6 rounded-2xl bg-sand/60 p-4">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="tabular font-medium text-noche">
                  {formatCurrency(fundraiser.raised)}{" "}
                  <span className="font-normal text-muted-foreground">of {formatCurrency(fundraiser.goal)}</span>
                </span>
                <span className="tabular font-semibold text-jade">{percentFunded(fundraiser.raised, fundraiser.goal)}%</span>
              </div>
              <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-jade/35 transition-[width] duration-500"
                  style={{ width: `${Math.min(projectedPct, 100)}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-jade"
                  style={{ width: `${Math.min(percentFunded(fundraiser.raised, fundraiser.goal), 100)}%` }}
                />
              </div>
              <p className="mt-2.5 text-sm text-noche" aria-live="polite">
                {amount && amount >= 1 ? (
                  crossesGoal ? (
                    <>Your {monthly ? "first " : ""}<strong className="tabular">{formatCurrency(amount)}</strong> would push {fundraiserLabel} past its goal!</>
                  ) : (
                    <>Your {monthly ? "first " : ""}<strong className="tabular">{formatCurrency(amount)}</strong> brings {fundraiserLabel} to <strong className="tabular text-jade">{projectedPct}%</strong> of its goal.</>
                  )
                ) : (
                  <>Pick an amount to see your impact.</>
                )}
              </p>
            </div>

            <FundsDisclosure className="mt-4 text-xs" />
          </div>
        ) : null}

        {step === "details" ? (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold text-noche outline-none">
              Your details
            </h2>
            <ComplianceCopy slot="contribution-compliance-intro" className="mt-3" />
            <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4">
              {DONOR_FIELDS.map((f) => (
                <div key={f.name} className={f.wide ? "col-span-2" : undefined}>
                  <Label htmlFor={`donor-${f.name}`} className="text-sm font-medium text-noche">
                    {f.label}
                    {f.optional ? <span className="font-normal text-muted-foreground"> (optional)</span> : null}
                  </Label>
                  <Input
                    id={`donor-${f.name}`}
                    name={f.name}
                    type={f.type ?? "text"}
                    inputMode={f.inputMode}
                    autoComplete={f.autoComplete}
                    required={!f.optional}
                    value={donor[f.name] ?? ""}
                    onChange={(e) => setDonor((d) => ({ ...d, [f.name]: e.target.value }))}
                    className={FIELD}
                  />
                </div>
              ))}
              {CONTRIBUTION_COMPLIANCE.fields.map((f) => (
                <div key={f.id} className="col-span-2 sm:col-span-1">
                  <Label htmlFor={`compliance-${f.id}`} className="text-sm font-medium text-noche">
                    {f.label}
                  </Label>
                  <Input
                    id={`compliance-${f.id}`}
                    autoComplete={f.autoComplete}
                    required={f.required}
                    value={fields[f.id] ?? ""}
                    onChange={(e) => setFields((prev) => ({ ...prev, [f.id]: e.target.value }))}
                    className={FIELD}
                  />
                  {f.helpText ? <p className="mt-1 text-xs text-muted-foreground">{f.helpText}</p> : null}
                </div>
              ))}
            </div>

            {showMessage ? (
              <fieldset className="mt-6 rounded-2xl bg-sand/60 p-4">
                <legend className="sr-only">On the fundraiser page</legend>
                <Label htmlFor="support-message" className="text-sm font-medium text-noche">
                  Message for {organizerFirstName} <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="support-message"
                  autoFocus
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  maxLength={280}
                  placeholder="Proud to support this!"
                  className="mt-1.5 bg-white text-base"
                />
                <div className="mt-3 flex items-center gap-2.5">
                  <Checkbox id="anonymous" checked={anonymous} onCheckedChange={(c) => setAnonymous(c === true)} />
                  <Label htmlFor="anonymous" className="text-sm font-normal text-noche">
                    Don&apos;t show my name on the fundraiser page
                  </Label>
                </div>
              </fieldset>
            ) : (
              <button
                type="button"
                onClick={() => setShowMessage(true)}
                className="mt-6 inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-jade outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <PlusIcon className="size-4" aria-hidden="true" />
                Add a message for {organizerFirstName}
              </button>
            )}
          </div>
        ) : null}

        {step === "review" ? (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold text-noche outline-none">
              Review and contribute
            </h2>
            <dl className="mt-5 divide-y rounded-2xl border bg-card text-sm">
              <div className="flex items-center justify-between gap-4 p-4">
                <dt className="text-muted-foreground">Contribution</dt>
                <dd className="flex items-center gap-3">
                  <span className="tabular font-heading text-lg font-bold text-noche">{formatAmount(amount ?? 0, frequency)}</span>
                  <button type="button" onClick={() => goTo("amount")} className="text-sm font-semibold text-jade hover:underline">
                    Edit
                  </button>
                </dd>
              </div>
              <div className="flex justify-between gap-4 p-4">
                <dt className="text-muted-foreground">Frequency</dt>
                <dd className="text-right font-medium text-noche">
                  {monthly ? (
                    <>
                      Monthly
                      <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                        First charge today, then each month
                      </span>
                    </>
                  ) : (
                    "One-time"
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <dt className="text-muted-foreground">From</dt>
                <dd className="flex min-w-0 items-center gap-3">
                  <span className="truncate font-medium text-noche">
                    {[donor.firstName, donor.lastName].filter(Boolean).join(" ")}
                  </span>
                  <button type="button" onClick={() => goTo("details")} className="text-sm font-semibold text-jade hover:underline">
                    Edit
                  </button>
                </dd>
              </div>
              <div className="flex justify-between gap-4 p-4">
                <dt className="text-muted-foreground">Paid to</dt>
                <dd className="text-right font-medium text-noche">{COMMITTEE.name}</dd>
              </div>
            </dl>

            <div className="mt-5 rounded-2xl border border-dashed bg-muted/50 p-5">
              <p className="flex items-center gap-2 font-medium text-noche">
                <LockIcon className="size-4" aria-hidden="true" />
                Secure payment
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                The payment processor&apos;s secure card fields will appear here.
                Payment processing isn&apos;t connected in this preview.
              </p>
            </div>

            {CONTRIBUTION_COMPLIANCE.attestations.length > 0 ? (
              <fieldset className="mt-5">
                <legend className="sr-only">Please confirm</legend>
                <ul className="space-y-3">
                  {CONTRIBUTION_COMPLIANCE.attestations.map((a) => (
                    <li key={a.id} className="flex items-start gap-3">
                      <Checkbox
                        id={a.id}
                        checked={attestations[a.id] ?? false}
                        onCheckedChange={(c) => setAttestations((prev) => ({ ...prev, [a.id]: c === true }))}
                        className="mt-1"
                      />
                      <Label htmlFor={a.id} className="flex-1 text-sm leading-relaxed font-normal text-noche">
                        {a.text ?? <CompliancePlaceholder label="attestation text" className="w-full" />}
                      </Label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            ) : null}
            <ComplianceCopy slot="contribution-legal-notice" className="mt-4" />
          </div>
        ) : null}
      </form>

      <div className="border-t bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        {error ? (
          <p role="alert" className="mb-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm font-medium text-destructive">
            {error}
          </p>
        ) : null}
        <Button type="submit" form={formId} variant="brand" size="xl" className="tabular w-full" disabled={submitting}>
          {submitting ? <LoaderCircleIcon className="animate-spin" aria-hidden="true" /> : null}
          {step === "review" && !submitting ? <LockIcon aria-hidden="true" /> : null}
          {step === "review"
            ? submitting
              ? "Processing…"
              : `Contribute ${formatCurrency(amount ?? 0)}${monthly ? " monthly" : ""}`
            : `Continue${amount && amount >= 1 ? ` with ${formatAmount(amount, frequency)}` : ""}`}
        </Button>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <LockIcon className="size-3" aria-hidden="true" />
          Secure checkout · Funds go to {COMMITTEE.name}
        </p>
      </div>
    </>
  );
}
