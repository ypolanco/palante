import type { Metadata } from "next";
import { Container } from "@/components/layout/section";
import { AdminFundraiserTable } from "@/components/admin/fundraiser-admin";
import { listFundraisers, listReports, withOrganizers } from "@/lib/services/fundraisers";

export const metadata: Metadata = {
  title: "Fundraisers",
};

export default async function AdminFundraisersPage() {
  const [all, reports] = await Promise.all([listFundraisers(), listReports()]);
  const rows = (await withOrganizers(all)).map((r) => ({
    ...r,
    openReports: reports.filter((rep) => rep.fundraiserId === r.fundraiser.id && rep.status !== "resolved").length,
  }));

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-extrabold text-noche sm:text-4xl">Fundraisers</h1>
      <p className="mt-1 text-muted-foreground">All supporter-created fundraising pages, including drafts.</p>
      <div className="mt-8">
        <AdminFundraiserTable rows={rows} />
      </div>
    </Container>
  );
}
