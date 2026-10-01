import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="tabular font-heading text-6xl font-extrabold text-marigold">404</p>
      <h1 className="mt-4 text-3xl font-extrabold text-noche">This page doesn&apos;t exist</h1>
      <p className="mt-3 text-muted-foreground">
        The project may have ended or the link may be mistyped.
      </p>
      <Button asChild variant="brand" size="xl" className="mt-8">
        <Link href="/explore">Explore Projects</Link>
      </Button>
    </Container>
  );
}
