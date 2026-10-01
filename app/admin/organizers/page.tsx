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
import { OrganizerAvatar } from "@/components/fundraisers/media";
import { listFundraisers, listOrganizers } from "@/lib/services/fundraisers";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Organizers",
};

export default async function AdminOrganizersPage() {
  const [organizers, all] = await Promise.all([listOrganizers(), listFundraisers()]);
  const rows = organizers
    .map((user) => {
      const own = all.filter((f) => f.organizerId === user.id);
      return {
        user,
        own,
        raised: own.reduce((s, f) => s + f.raised, 0),
        contributors: own.reduce((s, f) => s + f.contributorCount, 0),
      };
    })
    .sort((a, b) => b.raised - a.raised);

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-extrabold text-noche sm:text-4xl">Organizers</h1>
      <p className="mt-1 text-muted-foreground">
        Supporters raising money through their own pages. Totals are attributed amounts; all funds are held by the committee.
      </p>
      <div className="mt-8 overflow-x-auto rounded-2xl border bg-card">
        <Table>
          <TableHeader className="bg-muted/60">
            <TableRow>
              <TableHead className="pl-5">Organizer</TableHead>
              <TableHead>Fundraisers</TableHead>
              <TableHead className="text-right">Attributed raised</TableHead>
              <TableHead className="text-right">Contributors</TableHead>
              <TableHead className="pr-5">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="tabular">
            {rows.map(({ user, own, raised, contributors }) => (
              <TableRow key={user.id}>
                <TableCell className="pl-5">
                  <div className="flex items-center gap-3">
                    <OrganizerAvatar name={user.name} src={user.avatarUrl} size="sm" />
                    <div className="min-w-0">
                      <p className="font-semibold text-noche">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}{user.location ? ` · ${user.location}` : ""}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <ul className="space-y-0.5">
                    {own.map((f) => (
                      <li key={f.id}>
                        <Link href={`/admin/fundraisers/${f.id}`} className="text-sm text-noche hover:underline">
                          {f.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="text-right font-semibold text-noche">{formatCurrency(raised)}</TableCell>
                <TableCell className="text-right">{formatNumber(contributors)}</TableCell>
                <TableCell className="pr-5 text-muted-foreground">{formatDate(user.joinedOn, { short: true })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
