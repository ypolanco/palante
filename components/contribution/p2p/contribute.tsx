"use client";

import { createContext, useContext, useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog as DialogPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";
import {
  ContributionFlow,
  DEFAULT_AMOUNT,
  SUGGESTED_AMOUNTS,
} from "@/components/contribution/p2p/contribution-flow";
import { ProjectProgress } from "@/components/projects/project-progress";
import { ShareButton } from "@/components/share/share-panel";
import type { Fundraiser } from "@/lib/types";
import { cn, formatCurrency, percentFunded } from "@/lib/utils";

interface ContributeContextValue {
  /**
   * Opens the contribution modal. `undefined` preselects the default amount;
   * `null` opens with the custom amount field focused ("Other").
   */
  open: (amount?: number | null) => void;
  /** True in the creation wizard preview, where contributing is disabled. */
  preview: boolean;
}

const ContributeContext = createContext<ContributeContextValue>({ open: () => {}, preview: true });

export function useContribute() {
  return useContext(ContributeContext);
}

export function ContributeProvider({
  fundraiser,
  organizerFirstName,
  preview = false,
  children,
}: {
  fundraiser: Fundraiser;
  organizerFirstName: string;
  preview?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number | null>(DEFAULT_AMOUNT);
  // Remount the flow on each open so it always starts at step one.
  const [session, setSession] = useState(0);
  // Once someone is past the amount step, a stray click on the backdrop
  // shouldn't throw away what they've typed.
  const [inProgress, setInProgress] = useState(false);

  function open(next?: number | null) {
    if (preview) return;
    setAmount(next === undefined ? DEFAULT_AMOUNT : next);
    setSession((s) => s + 1);
    setInProgress(false);
    setIsOpen(true);
  }

  return (
    <ContributeContext.Provider value={{ open, preview }}>
      {children}
      {preview ? null : (
        <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-noche/50 duration-200 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
            <DialogPrimitive.Content
              aria-describedby={undefined}
              onInteractOutside={(e) => {
                if (inProgress) e.preventDefault();
              }}
              className={cn(
                "fixed z-50 flex flex-col overflow-hidden bg-white text-sm text-noche shadow-2xl outline-none",
                // Phones: bottom sheet, thumb-reachable CTA.
                "inset-x-0 bottom-0 max-h-[94dvh] rounded-t-3xl duration-300 data-open:animate-in data-open:slide-in-from-bottom-10 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom-10",
                // Larger screens: centered modal.
                "sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:max-h-[min(90dvh,52rem)] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:duration-200 sm:data-open:fade-in-0 sm:data-open:zoom-in-95 sm:data-open:slide-in-from-bottom-0 sm:data-closed:zoom-out-95 sm:data-closed:slide-out-to-bottom-0",
              )}
            >
              <DialogPrimitive.Title className="sr-only">Contribute to {fundraiser.title}</DialogPrimitive.Title>
              <ContributionFlow
                key={session}
                fundraiser={fundraiser}
                organizerFirstName={organizerFirstName}
                initialAmount={amount}
                onProgressChange={setInProgress}
                onClose={() => setIsOpen(false)}
              />
              <DialogPrimitive.Close asChild>
                <Button variant="ghost" size="icon-sm" className="absolute top-3.5 right-3.5 rounded-full bg-white/80 backdrop-blur">
                  <XIcon />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogPrimitive.Close>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}
    </ContributeContext.Provider>
  );
}

export function ContributeButton({
  amount,
  children = "Contribute",
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick" | "asChild"> & { amount?: number }) {
  const { open, preview } = useContribute();
  return (
    <Button
      type="button"
      variant="brand"
      size="xl"
      aria-disabled={preview || undefined}
      onClick={() => open(amount)}
      {...props}
    >
      {children}
    </Button>
  );
}

const AMOUNT_TILE =
  "h-11 rounded-xl border bg-white text-base font-semibold text-noche transition-colors outline-none hover:border-noche hover:bg-sand/50 focus-visible:ring-3 focus-visible:ring-ring/50";

export function SuggestedAmounts({ className }: { className?: string }) {
  const { open, preview } = useContribute();
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)} role="group" aria-label="Suggested contribution amounts">
      {SUGGESTED_AMOUNTS.map((amount) => (
        <button
          key={amount}
          type="button"
          aria-disabled={preview || undefined}
          onClick={() => open(amount)}
          className={cn("tabular", AMOUNT_TILE)}
        >
          ${amount}
        </button>
      ))}
      <button type="button" aria-disabled={preview || undefined} onClick={() => open(null)} className={AMOUNT_TILE}>
        Other
      </button>
    </div>
  );
}

/** Fixed bottom bar on small screens: progress stays visible and Contribute is one tap away. */
export function MobileContributeBar({ fundraiser }: { fundraiser: Fundraiser }) {
  const pct = percentFunded(fundraiser.raised, fundraiser.goal);
  return (
    <>
      <div className="h-32 lg:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <div className="flex items-baseline justify-between text-sm">
          <span className="tabular font-heading font-bold text-noche">
            {formatCurrency(fundraiser.raised)}{" "}
            <span className="font-sans font-normal text-muted-foreground">of {formatCurrency(fundraiser.goal)}</span>
          </span>
          <span className="tabular font-semibold text-jade">{pct}%</span>
        </div>
        <ProjectProgress raised={fundraiser.raised} goal={fundraiser.goal} label={fundraiser.title} size="sm" className="mt-1.5" />
        <div className="mt-2.5 flex gap-2">
          <ShareButton fundraiser={fundraiser} variant="outline" size="xl" className="px-4" />
          <ContributeButton className="flex-1" />
        </div>
      </div>
    </>
  );
}
