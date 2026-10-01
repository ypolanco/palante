"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const PRESET_AMOUNTS = [25, 50, 100, 250, 500, 1000];

export function ContributionAmount({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const customId = useId();
  const isPreset = value !== null && PRESET_AMOUNTS.includes(value);

  return (
    <fieldset>
      <legend className="font-heading text-lg font-bold text-noche">Choose an amount</legend>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            aria-pressed={value === amount}
            onClick={() => onChange(amount)}
            className={cn(
              "tabular h-12 rounded-xl border text-base font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              value === amount
                ? "border-noche bg-noche text-white"
                : "bg-white text-noche hover:border-noche/40",
            )}
          >
            ${amount.toLocaleString("en-US")}
          </button>
        ))}
      </div>
      <div className="mt-3">
        <Label htmlFor={customId} className="text-sm text-muted-foreground">
          Or enter another amount
        </Label>
        <div className="relative mt-1.5">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id={customId}
            inputMode="decimal"
            placeholder="0"
            value={!isPreset && value !== null ? String(value) : ""}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9.]/g, "");
              const parsed = Number.parseFloat(cleaned);
              onChange(cleaned === "" || Number.isNaN(parsed) ? null : parsed);
            }}
            className="tabular h-12 bg-white pl-7 text-base"
          />
        </div>
      </div>
    </fieldset>
  );
}
