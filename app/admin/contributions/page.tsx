import type { Metadata } from "next";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Container } from "@/components/layout/section";
import { REFERRAL_LABELS, relativeTime } from "@/lib/fundraisers/utils";
import { listFundraisers, listRecentContributions } from "@/lib/services/fundraisers";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contributions",
};

export default async function AdminContributionsPage() {
  const [contributions, all] = await Promise.all([listRecentContributions(undefined, 60), listFundraisers()]);
  const byId = new Map(all.map((f) => [f.id, f]));

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-extrabold text-noche sm:text-4xl">Contributions</h1>
      <p className="mt-1 max-w-3xl text-muted-foreground">
        Every contribution is received by the committee. The fundraiser and referral source are
        attribution metadata used for progress tracking and analytics.
      </p>
      {/* TODO(backend): paginate, filter by date/fundraiser, and show donor records to authorized staff only. */}
      <div className="mt-8 overflow-x-auto rounded-2xl border bg-card">
        <Table>
          <TableHeader className="bg-muted/60">
            <TableRow>
              <TableHead className="pl-5">When</TableHead>
              <TableHead>Contribution ID</TableHead>
              <TableHead>Attributed fundraiser</TableHead>
              <TableHead>Referral source</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="tabular">
            {contributions.map((c) => {
              const f = byId.get(c.attribution.fundraiserId);
              return (
                <TableRow key={c.id}>
                  <TableCell className="pl-5 text-muted-foreground">{relativeTime(c.createdAt)}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.id}</TableCell>
                  <TableCell>
                    {f ? (
                      <Link href={`/admin/fundraisers/${f.id}`} className="text-noche hover:underline">{f.title}</Link>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>{REFERRAL_LABELS[c.attribution.referralChannel]}</TableCell>
                  <TableCell className="text-muted-foreground">{c.recipient}</TableCell>
                  <TableCell className="capitalize">{c.status}</TableCell>
                  <TableCell className="pr-5 text-right font-semibold text-noche">{formatCurrency(c.amount)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
