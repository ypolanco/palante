/**
 * Contribution submission boundary.
 *
 * All contributions are made to the committee. The fundraiser ID travels in
 * `attribution` purely for progress tracking and analytics.
 *
 * TODO(payments): connect to the committee's political payment processor.
 * The processor should tokenize card details in its own hosted fields; raw
 * card data must never pass through this app.
 */
import { COMMITTEE } from "@/lib/mock-data";
import type { ContributionAttribution } from "@/lib/types";

export interface DonorInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

/**
 * "monthly" asks the processor to set up a recurring charge: the first one
 * today, then the same amount each month until the donor cancels.
 * TODO(payments): the processor owns the schedule and cancellation.
 */
export type ContributionFrequency = "one-time" | "monthly";

export interface ContributionRequest {
  amount: number;
  currency: "USD";
  frequency: ContributionFrequency;
  donor: DonorInfo;
  /** Answers to the configured compliance fields and attestations (see lib/compliance.ts). */
  compliance: {
    configSource: "placeholder" | "approved";
    fields: Record<string, string>;
    attestations: Record<string, boolean>;
  };
  /** What, if anything, to show publicly on the fundraiser page. */
  publicDisplay: {
    anonymous: boolean;
    message?: string;
  };
  /** Token from the payment processor's hosted fields. Not available in the preview. */
  paymentToken: string | null;
  attribution: ContributionAttribution;
}

export interface ContributionReceipt {
  contributionId: string;
  amount: number;
  frequency: ContributionFrequency;
  recipient: string;
  fundraiserId: string;
  /** False in the preview: no payment was processed. */
  processed: boolean;
}

export async function submitContribution(
  request: ContributionRequest,
): Promise<ContributionReceipt> {
  // Simulated latency so loading states are visible in the preview.
  await new Promise((resolve) => setTimeout(resolve, 700));
  return {
    contributionId: `preview-${Date.now().toString(36)}`,
    amount: request.amount,
    frequency: request.frequency,
    recipient: COMMITTEE.name,
    fundraiserId: request.attribution.fundraiserId,
    processed: false,
  };
}
