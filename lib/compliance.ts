/**
 * Compliance copy and contribution-form configuration.
 *
 * Nothing in this file is legal advice or approved language. Every value is
 * a placeholder to be supplied or confirmed by counsel/compliance. A `null`
 * copy value renders a visible "pending" placeholder (see
 * components/compliance/compliance-copy.tsx) rather than invented text.
 * No contribution limits or eligibility logic live in the frontend.
 */

export type ComplianceSlot =
  /** Shown on every public fundraiser page near the progress card. */
  | "fundraiser-page-notice"
  /** Introduces the compliance step of the contribution flow. */
  | "contribution-compliance-intro"
  /** Shown above the final submit button. */
  | "contribution-legal-notice"
  /** Shown on the confirmation screen (e.g. receipt or tax language). */
  | "contribution-confirmation-notice"
  /** Terms an organizer accepts before publishing a fundraiser. */
  | "organizer-terms";

export const COMPLIANCE_COPY: Record<ComplianceSlot, string | null> = {
  "fundraiser-page-notice": null,
  "contribution-compliance-intro": null,
  "contribution-legal-notice": null,
  "contribution-confirmation-notice": null,
  "organizer-terms": null,
};

/**
 * Product statement (not legal language) describing how peer-to-peer funds
 * flow. Shown wherever someone could think the organizer receives money.
 */
export const FUNDS_FLOW_STATEMENT =
  "Contributions made through this page go directly to Palante Together. The fundraiser organizer does not receive or control contributed funds.";

export interface ComplianceField {
  id: string;
  label: string;
  autoComplete?: string;
  required: boolean;
  helpText?: string;
}

export interface ComplianceAttestation {
  id: string;
  /** Attestation text from counsel. `null` renders a placeholder. */
  text: string | null;
  required: boolean;
}

export interface ContributionComplianceConfig {
  /** "placeholder" until counsel signs off; the UI flags placeholder config. */
  source: "placeholder" | "approved";
  fields: ComplianceField[];
  attestations: ComplianceAttestation[];
}

/**
 * Fields and attestations collected in the "Required information" step.
 * TODO(compliance): replace with counsel-approved configuration, ideally
 * served by the backend so it can change without a deploy.
 */
export const CONTRIBUTION_COMPLIANCE: ContributionComplianceConfig = {
  source: "placeholder",
  fields: [
    { id: "employer", label: "Employer", autoComplete: "organization", required: true },
    { id: "occupation", label: "Occupation", autoComplete: "organization-title", required: true },
  ],
  attestations: [{ id: "attestation-1", text: null, required: true }],
};
