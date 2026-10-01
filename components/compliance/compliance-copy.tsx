import { FileWarningIcon, ShieldCheckIcon } from "lucide-react";
import {
  COMPLIANCE_COPY,
  FUNDS_FLOW_STATEMENT,
  type ComplianceSlot,
} from "@/lib/compliance";
import { cn } from "@/lib/utils";

/** Visible stand-in for language counsel hasn't supplied yet. */
export function CompliancePlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex gap-2 rounded-xl border border-dashed border-marigold-deep/40 bg-marigold/5 px-3 py-2.5 text-xs leading-relaxed text-marigold-deep",
        className,
      )}
    >
      <FileWarningIcon className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      <span>
        <span className="font-semibold">Pending counsel review:</span> {label}
      </span>
    </p>
  );
}

const SLOT_LABELS: Record<ComplianceSlot, string> = {
  "fundraiser-page-notice": "fundraiser page disclaimer",
  "contribution-compliance-intro": "explanation of why this information is requested",
  "contribution-legal-notice": "contribution legal notice",
  "contribution-confirmation-notice": "confirmation and receipt language",
  "organizer-terms": "organizer terms and responsibilities",
};

/**
 * Renders counsel-supplied copy for a slot, or a clearly marked placeholder.
 * Never fills the gap with invented legal language.
 */
export function ComplianceCopy({
  slot,
  className,
}: {
  slot: ComplianceSlot;
  className?: string;
}) {
  const text = COMPLIANCE_COPY[slot];
  if (!text) return <CompliancePlaceholder label={SLOT_LABELS[slot]} className={className} />;
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>{text}</p>
  );
}

/** "Funds go to Palante Together, not the organizer." Used wherever money is mentioned. */
export function FundsDisclosure({
  className,
  tone = "soft",
}: {
  className?: string;
  tone?: "soft" | "plain";
}) {
  return (
    <p
      className={cn(
        "flex gap-2 text-sm leading-relaxed text-noche",
        tone === "soft" && "rounded-xl bg-jade-soft p-3",
        className,
      )}
    >
      <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-jade" aria-hidden="true" />
      <span>{FUNDS_FLOW_STATEMENT}</span>
    </p>
  );
}
