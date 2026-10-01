"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FlagIcon, LoaderCircleIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/fundraisers/fundraiser-card";
import { STATUS_LABELS } from "@/lib/fundraisers/utils";
import { updateFundraiserStatus } from "@/lib/services/fundraiser-publishing";
import type { Fundraiser, FundraiserStatus, User } from "@/lib/types";
import { cn, formatCurrency, formatDate, formatNumber, percentFunded } from "@/lib/utils";

type Row = { fundraiser: Fundraiser; organizer: User | undefined; openReports: number };

const STATUSES = Object.keys(STATUS_LABELS) as FundraiserStatus[];

export function AdminFundraiserTable({ rows }: { rows: Row[] }) {
  const [status, setStatus] = useState<FundraiserStatus | "all">("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (status === "all" || r.fundraiser.status === status) &&
        (!q || [r.fundraiser.title, r.organizer?.name ?? "", r.organizer?.email ?? ""].some((v) => v.toLowerCase().includes(q))),
    );
  }, [rows, status, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by status" className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                status === s ? "border-noche bg-noche text-white" : "bg-white text-noche hover:border-noche/40",
              )}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or organizer"
            aria-label="Search fundraisers"
            className="h-10 bg-white pl-9"
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border bg-card">
        <Table>
          <TableHeader className="bg-muted/60">
            <TableRow>
              <TableHead className="pl-5">Fundraiser</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Raised</TableHead>
              <TableHead className="text-right">Goal</TableHead>
              <TableHead className="text-right">Contributors</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="pr-5 text-right">Reports</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="tabular">
            {visible.map(({ fundraiser: f, organizer, openReports }) => (
              <TableRow key={f.id}>
                <TableCell className="max-w-72 pl-5">
                  <Link href={`/admin/fundraisers/${f.id}`} className="block truncate font-semibold text-noche hover:underline">
                    {f.title}
                  </Link>
                  <span className="block truncate text-xs text-muted-foreground">{organizer?.name}</span>
                </TableCell>
                <TableCell><StatusBadge status={f.status} /></TableCell>
                <TableCell className="text-right font-semibold text-noche">{formatCurrency(f.raised)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(f.goal)}
                  <span className="ml-1 text-xs text-muted-foreground">({percentFunded(f.raised, f.goal)}%)</span>
                </TableCell>
                <TableCell className="text-right">{formatNumber(f.contributorCount)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(f.createdOn, { short: true })}</TableCell>
                <TableCell className="pr-5 text-right">
                  {openReports > 0 ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-destructive">
                      <FlagIcon className="size-3.5" aria-hidden="true" />
                      {openReports} open
                    </span>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {visible.length === 0 ? <p className="p-8 text-center text-muted-foreground">No fundraisers match.</p> : null}
      </div>
    </div>
  );
}

export function StatusControl({ fundraiserId, status }: { fundraiserId: string; status: FundraiserStatus }) {
  const [value, setValue] = useState<FundraiserStatus>(status);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setMessage(null);
    const result = await updateFundraiserStatus(fundraiserId, value);
    setBusy(false);
    setMessage(
      result.saved
        ? `Status changed to ${STATUS_LABELS[value]}.`
        : `Preview only: status would change to ${STATUS_LABELS[value]} once moderation is connected to the backend.`,
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <Select value={value} onValueChange={(v) => setValue(v as FundraiserStatus)}>
          <SelectTrigger aria-label="Fundraiser status" className="h-10! flex-1 bg-white">
            <SelectValue>{STATUS_LABELS[value]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" size="lg" onClick={save} disabled={busy || value === status}>
          {busy ? <LoaderCircleIcon className="animate-spin" aria-hidden="true" /> : null}
          Update
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">{message}</p>
    </div>
  );
}
