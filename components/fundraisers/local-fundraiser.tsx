"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import { FundraiserView } from "@/components/fundraisers/fundraiser-view";
import { findLocalFundraiser, readLocalSnapshot } from "@/lib/services/fundraiser-publishing";
import type { User } from "@/lib/types";

const noop = () => () => {};

/**
 * Preview-only: shows a fundraiser that was published in this browser.
 * TODO(backend): remove once published fundraisers are served by the API.
 */
export function LocalFundraiser({ slug, organizer }: { slug: string; organizer: User }) {
  // null on the server and during hydration; the stored string afterwards.
  const snapshot = useSyncExternalStore(noop, readLocalSnapshot, () => null);
  const fundraiser = useMemo(
    () => (snapshot === null ? null : findLocalFundraiser(snapshot, slug)),
    [snapshot, slug],
  );

  if (snapshot === null) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (!fundraiser) {
    return (
      <Container className="flex flex-col items-center py-24 text-center">
        <p className="font-heading text-6xl font-extrabold text-marigold">404</p>
        <h1 className="mt-4 text-3xl font-extrabold text-noche">We couldn&apos;t find that fundraiser</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          It may have ended or the link may be mistyped.
        </p>
        <Button asChild variant="brand" size="xl" className="mt-8">
          <Link href="/fundraisers">Explore fundraisers</Link>
        </Button>
      </Container>
    );
  }

  return <FundraiserView fundraiser={fundraiser} organizer={organizer} recentContributions={[]} />;
}
