"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ImagePlusIcon,
  LoaderCircleIcon,
  PartyPopperIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ComplianceCopy, FundsDisclosure } from "@/components/compliance/compliance-copy";
import { FundraiserView } from "@/components/fundraisers/fundraiser-view";
import { FundraiserCover, OrganizerAvatar } from "@/components/fundraisers/media";
import { RichText } from "@/components/rich-text/rich-text";
import { RichTextEditor } from "@/components/rich-text/rich-text-editor";
import { SharePanel } from "@/components/share/share-panel";
import { DEFAULT_SHARE_MESSAGE, MOCK_TODAY, fundraiserPath } from "@/lib/fundraisers/utils";
import {
  DEFAULT_COVER,
  draftToFundraiser,
  publishFundraiser,
  updateFundraiser,
  type FundraiserInput,
} from "@/lib/services/fundraiser-publishing";
import type { Fundraiser, User } from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const STEPS = [
  { key: "basics", label: "Basics" },
  { key: "story", label: "Your story" },
  { key: "personalize", label: "Personalize" },
  { key: "preview", label: "Preview" },
  { key: "publish", label: "Publish" },
] as const;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MIN_STORY_LENGTH = 40;
const TOMORROW = new Date(Date.parse(MOCK_TODAY) + 86_400_000).toISOString().slice(0, 10);

const STORY_PROMPT = `Why does this matter to you? Who are you raising with?

- What you hope your community can do together
- Why now
- How people can help besides contributing`;

export const EMPTY_INPUT: FundraiserInput = {
  title: "",
  goal: 0,
  endsOn: null,
  story: "",
  coverImage: null,
  coverImageAlt: "",
  profileImage: null,
  shareMessage: DEFAULT_SHARE_MESSAGE,
};

function ImageField({
  label,
  hint,
  value,
  onChange,
  shape,
  fallback,
}: {
  label: string;
  hint: string;
  value: string | null;
  onChange: (value: string | null) => void;
  shape: "cover" | "avatar";
  fallback: ReactNode;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file (JPG, PNG, WebP, or GIF).");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("That image is larger than 5 MB. Try a smaller one.");
      return;
    }
    // TODO(backend): upload to storage and keep the returned URL instead of a data URL.
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => setError("We couldn't read that file. Try another image.");
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <Label htmlFor={inputId} className="text-base font-semibold text-noche">
        {label}
      </Label>
      <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p>
      <div className={cn("mt-3 flex gap-4", shape === "cover" ? "flex-col" : "items-center")}>
        {value ? (
          shape === "cover" ? (
            <FundraiserCover src={value} alt="" sizes="640px" className="aspect-[16/10] w-full rounded-2xl" />
          ) : (
            <OrganizerAvatar name="" src={value} size="xl" />
          )
        ) : (
          fallback
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="lg" onClick={() => inputRef.current?.click()}>
            <ImagePlusIcon aria-hidden="true" />
            {value ? "Replace image" : "Upload image"}
          </Button>
          {value ? (
            <Button type="button" variant="ghost" size="lg" onClick={() => onChange(null)}>
              <Trash2Icon aria-hidden="true" />
              Remove
            </Button>
          ) : null}
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Stepper({
  current,
  furthest,
  onSelect,
}: {
  current: number;
  furthest: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Fundraiser setup steps">
      <ol className="flex gap-1.5 sm:gap-2">
        {STEPS.map((s, i) => {
          const done = i < current;
          const reachable = i <= furthest;
          return (
            <li key={s.key} className="flex-1">
              <button
                type="button"
                disabled={!reachable}
                aria-current={i === current ? "step" : undefined}
                onClick={() => onSelect(i)}
                className="group w-full text-left outline-none disabled:cursor-not-allowed"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-colors group-focus-visible:ring-3 group-focus-visible:ring-ring/50",
                    i <= current ? "bg-jade" : "bg-sand",
                  )}
                />
                <span
                  className={cn(
                    "mt-2 hidden items-center gap-1 text-xs font-medium sm:flex",
                    i === current ? "text-noche" : "text-muted-foreground",
                  )}
                >
                  {done ? <CheckIcon className="size-3 text-jade" aria-hidden="true" /> : null}
                  {s.label}
                </span>
                <span className="sr-only sm:hidden">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-sm text-muted-foreground sm:hidden">
        Step {current + 1} of {STEPS.length} · <span className="font-medium text-noche">{STEPS[current].label}</span>
      </p>
    </nav>
  );
}

export function FundraiserWizard({
  organizer,
  reservedSlugs = [],
  mode = "create",
  fundraiserId,
  initial = EMPTY_INPUT,
}: {
  organizer: User;
  /** Slugs already in use, so new fundraisers get a unique link. */
  reservedSlugs?: string[];
  mode?: "create" | "edit";
  fundraiserId?: string;
  initial?: FundraiserInput;
}) {
  const formId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [input, setInput] = useState<FundraiserInput>(initial);
  const [stepIndex, setStepIndex] = useState(0);
  const [furthest, setFurthest] = useState(mode === "edit" ? STEPS.length - 1 : 0);
  const [acknowledged, setAcknowledged] = useState(mode === "edit");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [published, setPublished] = useState<{ fundraiser: Fundraiser; savedLocally: boolean } | null>(null);
  const [editSaved, setEditSaved] = useState<boolean | null>(null);
  const [hasNavigated, setHasNavigated] = useState(false);

  const step = STEPS[stepIndex].key;
  const isLast = stepIndex === STEPS.length - 1;
  const set = <K extends keyof FundraiserInput>(key: K, value: FundraiserInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    // Move focus to the new step's heading, but not on first render.
    if (hasNavigated) headingRef.current?.focus();
  }, [stepIndex, published, editSaved, hasNavigated]);

  function goTo(index: number) {
    setError(null);
    setHasNavigated(true);
    setStepIndex(index);
    setFurthest((f) => Math.max(f, index));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validate(): string | null {
    if (step === "basics") {
      if (!input.title.trim()) return "Give your fundraiser a title.";
      if (!input.goal || input.goal < 1) return "Set a fundraising goal.";
    }
    if (step === "story" && input.story.trim().length < MIN_STORY_LENGTH) {
      return `Tell people a little more (at least ${MIN_STORY_LENGTH} characters).`;
    }
    if (step === "publish" && !acknowledged) {
      return "Please confirm you understand how contributions work.";
    }
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    if (!isLast) {
      goTo(stepIndex + 1);
      return;
    }

    setBusy(true);
    setError(null);
    setHasNavigated(true);
    try {
      if (mode === "edit" && fundraiserId) {
        const result = await updateFundraiser(fundraiserId, input);
        setEditSaved(result.saved);
      } else {
        setPublished(await publishFundraiser(input, organizer, reservedSlugs));
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (published) {
    const { fundraiser, savedLocally } = published;
    return (
      <div className="mx-auto max-w-2xl" role="status">
        <div className="overflow-hidden rounded-3xl border bg-card">
          <FundraiserCover src={fundraiser.coverImage} alt={fundraiser.coverImageAlt} sizes="672px" className="aspect-[16/7]" />
          <div className="p-6 sm:p-10">
            <PartyPopperIcon className="size-10 text-marigold-deep" aria-hidden="true" />
            <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-4xl font-extrabold text-noche outline-none sm:text-5xl">
              Your fundraiser is live!
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              <span className="font-semibold text-noche">{fundraiser.title}</span> is ready for
              contributions. The first few shares matter most: start with the people
              closest to you.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="brand" size="xl">
                <Link href={fundraiserPath(fundraiser.slug)}>
                  View Fundraiser
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="/dashboard">Go to your dashboard</Link>
              </Button>
            </div>

            <h2 className="mt-10 text-2xl font-bold text-noche">Share it now</h2>
            <SharePanel fundraiser={fundraiser} editableMessage className="mt-4" />

            <p className="mt-8 text-xs text-muted-foreground">
              Preview: this fundraiser is saved only in this browser
              {savedLocally ? "" : " (the image was too large to store, so the default cover is used)"}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (editSaved !== null) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border bg-card p-8 text-center" role="status">
        <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold text-noche outline-none">
          {editSaved ? "Changes saved" : "Changes not saved in preview"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {editSaved
            ? "Your fundraiser page has been updated."
            : "Sample fundraisers are read-only until fundraisers are connected to the backend."}
        </p>
        <Button asChild variant="default" size="xl" className="mt-6">
          <Link href="/dashboard/fundraisers">Back to my fundraisers</Link>
        </Button>
      </div>
    );
  }

  const preview = draftToFundraiser(input, organizer);

  return (
    <div>
      <div className={cn("mx-auto", step === "preview" ? "max-w-7xl" : "max-w-2xl")}>
        <Stepper current={stepIndex} furthest={furthest} onSelect={goTo} />
      </div>

      <form id={formId} onSubmit={handleSubmit} className="mt-8" noValidate>
        {step === "basics" ? (
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold text-noche outline-none">
              {mode === "edit" ? "Edit the basics" : "Let's start with the basics"}
            </h2>
            <div>
              <Label htmlFor="title" className="text-base font-semibold text-noche">Fundraiser title</Label>
              <Input
                id="title"
                value={input.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder={`${organizer.firstName}'s Community for Change`}
                maxLength={80}
                required
                className="mt-2 h-12 bg-white text-base"
              />
              <p className="mt-1 text-sm text-muted-foreground">Short and personal works best.</p>
            </div>
            <div>
              <Label htmlFor="goal" className="text-base font-semibold text-noche">Fundraising goal</Label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="goal"
                  inputMode="numeric"
                  value={input.goal ? input.goal.toLocaleString("en-US") : ""}
                  onChange={(e) => set("goal", Number(e.target.value.replace(/\D/g, "")) || 0)}
                  placeholder="5,000"
                  required
                  className="tabular h-12 bg-white pl-7 text-base"
                />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a goal your community can reach. You can raise more than your goal.
              </p>
            </div>
            <div>
              <Label htmlFor="endsOn" className="text-base font-semibold text-noche">
                End date <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="endsOn"
                type="date"
                min={TOMORROW}
                value={input.endsOn ?? ""}
                onChange={(e) => set("endsOn", e.target.value || null)}
                className="mt-2 h-12 w-full bg-white text-base sm:w-60"
              />
              <p className="mt-1 text-sm text-muted-foreground">Leave blank to keep your fundraiser open.</p>
            </div>
          </div>
        ) : null}

        {step === "story" ? (
          <div className="mx-auto max-w-2xl">
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold text-noche outline-none">
              Why are you fundraising?
            </h2>
            <p className="mt-2 text-muted-foreground">
              People give because of you. Share what this means to you, in your own words.
            </p>
            <Label htmlFor="story" className="sr-only">Your story</Label>
            <RichTextEditor
              id="story"
              value={input.story}
              onChange={(v) => set("story", v)}
              placeholder={STORY_PROMPT}
              className="mt-5"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Use **bold**, *italic*, and lines starting with &ldquo;- &rdquo; for lists.
            </p>
            {input.story.trim() ? (
              <div className="mt-8 rounded-2xl bg-sand/60 p-5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">How it will look</p>
                <RichText source={input.story} className="mt-3 text-base" />
              </div>
            ) : null}
          </div>
        ) : null}

        {step === "personalize" ? (
          <div className="mx-auto max-w-2xl space-y-10">
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold text-noche outline-none">
              Make it yours
            </h2>
            <ImageField
              label="Fundraiser image"
              hint="A photo of you, your community, or what you care about. Landscape photos look best."
              value={input.coverImage}
              onChange={(v) => set("coverImage", v)}
              shape="cover"
              fallback={
                <div className="relative">
                  <FundraiserCover src={DEFAULT_COVER} alt="" sizes="640px" className="aspect-[16/10] w-full rounded-2xl opacity-60" />
                  <p className="absolute inset-x-0 bottom-3 text-center text-sm font-medium text-noche">
                    Default image (used if you skip this)
                  </p>
                </div>
              }
            />
            {input.coverImage ? (
              <div>
                <Label htmlFor="coverAlt" className="text-sm font-medium text-noche">
                  Describe your image <span className="font-normal text-muted-foreground">(for people using screen readers)</span>
                </Label>
                <Input
                  id="coverAlt"
                  value={input.coverImageAlt}
                  onChange={(e) => set("coverImageAlt", e.target.value)}
                  placeholder="Neighbors at our block party"
                  className="mt-1.5 h-11 bg-white text-base"
                />
              </div>
            ) : null}
            <ImageField
              label="Your profile photo (optional)"
              hint="Helps friends recognize you."
              value={input.profileImage}
              onChange={(v) => set("profileImage", v)}
              shape="avatar"
              fallback={<OrganizerAvatar name={organizer.name} size="xl" />}
            />
          </div>
        ) : null}

        {step === "preview" ? (
          <div>
            <div className="mx-auto max-w-7xl">
              <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold text-noche outline-none">
                Here&apos;s your page
              </h2>
              <p className="mt-2 text-muted-foreground">
                This is exactly what supporters will see. Go back to change anything.
              </p>
            </div>
            <div className="mx-auto mt-6 max-w-7xl overflow-hidden rounded-3xl border bg-white shadow-[0_24px_60px_-32px_rgba(24,33,59,0.35)]">
              <div className="flex items-center gap-2 border-b bg-muted/60 px-4 py-2.5">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-border" />
                  <span className="size-2.5 rounded-full bg-border" />
                  <span className="size-2.5 rounded-full bg-border" />
                </span>
                <span className="truncate rounded-md bg-white px-3 py-1 text-xs text-muted-foreground">
                  {fundraiserPath(preview.slug)}
                </span>
              </div>
              <div inert className="pointer-events-none select-none">
                <FundraiserView fundraiser={preview} organizer={organizer} recentContributions={[]} preview />
              </div>
            </div>
          </div>
        ) : null}

        {step === "publish" ? (
          <div className="mx-auto max-w-2xl">
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold text-noche outline-none">
              {mode === "edit" ? "Save your changes" : "Ready to go live?"}
            </h2>
            <dl className="mt-6 divide-y rounded-2xl border bg-card">
              <div className="flex items-center gap-4 p-4">
                <FundraiserCover src={preview.coverImage} alt="" sizes="96px" className="aspect-[3/2] w-24 shrink-0 rounded-lg" />
                <div className="min-w-0">
                  <dt className="sr-only">Title</dt>
                  <dd className="truncate font-heading text-lg font-bold text-noche">{preview.title}</dd>
                  <dd className="text-sm text-muted-foreground">by {organizer.name}</dd>
                </div>
              </div>
              <div className="flex justify-between gap-4 p-4 text-sm">
                <dt className="text-muted-foreground">Goal</dt>
                <dd className="tabular font-semibold text-noche">{formatCurrency(input.goal)}</dd>
              </div>
              <div className="flex justify-between gap-4 p-4 text-sm">
                <dt className="text-muted-foreground">Ends</dt>
                <dd className="font-semibold text-noche">{input.endsOn ? formatDate(input.endsOn) : "No end date"}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <Label htmlFor="shareMessage" className="text-base font-semibold text-noche">Your share message</Label>
              <p className="mt-0.5 text-sm text-muted-foreground">Prefilled when you share by text, email, or X. You can change it anytime.</p>
              <Textarea
                id="shareMessage"
                value={input.shareMessage}
                onChange={(e) => set("shareMessage", e.target.value)}
                rows={3}
                className="mt-2 bg-white text-base"
              />
            </div>

            <div className="mt-8 space-y-4 rounded-2xl bg-sand/60 p-5">
              <FundsDisclosure tone="plain" />
              <ComplianceCopy slot="organizer-terms" />
              <div className="flex items-start gap-3">
                <Checkbox id="acknowledge" checked={acknowledged} onCheckedChange={(c) => setAcknowledged(c === true)} className="mt-0.5" />
                <Label htmlFor="acknowledge" className="text-sm leading-relaxed font-normal text-noche">
                  I understand that contributions made through my page go directly to
                  Palante Together, and that I will not receive or control any funds.
                </Label>
              </div>
            </div>
          </div>
        ) : null}
      </form>

      <div className="sticky bottom-0 z-30 mt-10 border-t bg-white/95 py-4 backdrop-blur-md">
        <div className={cn("mx-auto", step === "preview" ? "max-w-7xl" : "max-w-2xl")}>
          {error ? (
            <p role="alert" className="mb-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex gap-3">
            {stepIndex > 0 ? (
              <Button type="button" variant="outline" size="xl" onClick={() => goTo(stepIndex - 1)}>
                <ArrowLeftIcon aria-hidden="true" />
                <span className="max-sm:sr-only">Back</span>
              </Button>
            ) : null}
            <Button type="submit" form={formId} variant={isLast ? "brand" : "default"} size="xl" className="flex-1 sm:ml-auto sm:flex-none sm:px-10" disabled={busy}>
              {busy ? <LoaderCircleIcon className="animate-spin" aria-hidden="true" /> : null}
              {isLast
                ? mode === "edit"
                  ? "Save changes"
                  : "Publish fundraiser"
                : step === "preview"
                  ? "Looks good"
                  : "Continue"}
              {!isLast && !busy ? <ArrowRightIcon data-icon="inline-end" aria-hidden="true" /> : null}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
