"use client";

import { useId, useState, useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import { CheckIcon, CopyIcon, MailIcon, MessageSquareTextIcon, Share2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { buildShareUrl, shareTargets, trackShareEvent } from "@/lib/share";
import type { Fundraiser, ShareChannel } from "@/lib/types";
import { cn } from "@/lib/utils";

const noop = () => () => {};

/** window.location.origin on the client, "" during prerender. */
export function useOrigin() {
  return useSyncExternalStore(noop, () => window.location.origin, () => "");
}

function FacebookGlyph(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9.1 23.7v-8H6.6V12h2.5v-1.6c0-4.1 1.8-6 5.9-6 .8 0 2.1.2 2.6.3v3.3h-1.4c-1.6 0-2.3.6-2.3 2.1V12h3.6l-.6 3.7h-3V24C19.4 23.2 24 18.2 24 12 24 5.4 18.6 0 12 0S0 5.4 0 12c0 5.6 3.9 10.4 9.1 11.7Z" />
    </svg>
  );
}

function XGlyph(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 1.2h3.7l-8 9.1L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9Zm-1.3 19.4h2L6.5 3.2H4.3Z" />
    </svg>
  );
}

function ChannelButton({
  href,
  onClick,
  icon,
  label,
  className,
}: {
  href: string;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  className: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex flex-col items-center gap-2 rounded-xl p-2 text-xs font-medium text-noche outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className={cn("flex size-12 items-center justify-center rounded-full transition-transform group-hover:-translate-y-0.5", className)}>
        {icon}
      </span>
      {label}
    </a>
  );
}

export function SharePanel({
  fundraiser,
  editableMessage = false,
  className,
}: {
  fundraiser: Pick<Fundraiser, "id" | "slug" | "title" | "shareMessage">;
  /** Organizers can tailor the message before sharing. */
  editableMessage?: boolean;
  className?: string;
}) {
  const origin = useOrigin();
  const messageId = useId();
  const linkId = useId();
  const [message, setMessage] = useState(fundraiser.shareMessage);
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(noop, () => typeof navigator.share === "function", () => false);

  const link = buildShareUrl(origin, fundraiser.slug);
  const targets = shareTargets({ origin, slug: fundraiser.slug, message, title: fundraiser.title });
  const track = (channel: ShareChannel) => () => void trackShareEvent(fundraiser.id, channel);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      void trackShareEvent(fundraiser.id, "copy_link");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); select the text instead.
      (document.getElementById(linkId) as HTMLInputElement | null)?.select();
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: fundraiser.title, text: message, url: buildShareUrl(origin, fundraiser.slug, "native") });
      void trackShareEvent(fundraiser.id, "native");
    } catch {
      // User dismissed the share sheet.
    }
  }

  return (
    <div className={cn("space-y-5", className)}>
      {editableMessage ? (
        <div>
          <Label htmlFor={messageId} className="text-sm font-medium text-noche">
            Your share message
          </Label>
          <Textarea
            id={messageId}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="mt-1.5 bg-white text-base"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Used for X, email, and text messages. Facebook shows your page preview.
          </p>
        </div>
      ) : (
        <blockquote className="rounded-xl bg-sand/70 p-4 text-sm leading-relaxed text-noche">
          &ldquo;{message}&rdquo;
        </blockquote>
      )}

      <div className="grid grid-cols-4 gap-1">
        <ChannelButton href={targets.facebook} onClick={track("facebook")} label="Facebook" className="bg-[#1877f2] text-white" icon={<FacebookGlyph className="size-5" />} />
        <ChannelButton href={targets.x} onClick={track("x")} label="X" className="bg-noche text-white" icon={<XGlyph className="size-4.5" />} />
        <ChannelButton href={targets.email} onClick={track("email")} label="Email" className="bg-jade text-white" icon={<MailIcon className="size-5" aria-hidden="true" />} />
        <ChannelButton href={targets.sms} onClick={track("sms")} label="Text" className="bg-marigold text-noche" icon={<MessageSquareTextIcon className="size-5" aria-hidden="true" />} />
      </div>

      <div>
        <Label htmlFor={linkId} className="text-sm font-medium text-noche">
          Fundraiser link
        </Label>
        <div className="mt-1.5 flex gap-2">
          <Input id={linkId} readOnly value={link} onFocus={(e) => e.currentTarget.select()} className="h-11 min-w-0 bg-white" />
          <Button type="button" variant={copied ? "secondary" : "default"} size="xl" className="h-11 shrink-0 px-4" onClick={copy}>
            {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
        <p className="sr-only" aria-live="polite">{copied ? "Link copied to clipboard" : ""}</p>
      </div>

      {canNativeShare ? (
        <Button type="button" variant="outline" size="xl" className="w-full" onClick={nativeShare}>
          <Share2Icon aria-hidden="true" />
          More sharing options
        </Button>
      ) : null}
    </div>
  );
}

/** A button that opens the share panel in a sheet. */
export function ShareButton({
  fundraiser,
  editableMessage,
  children,
  ...buttonProps
}: Omit<ComponentProps<typeof Button>, "asChild"> & {
  fundraiser: Pick<Fundraiser, "id" | "slug" | "title" | "shareMessage">;
  editableMessage?: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" {...buttonProps}>
          {children ?? (
            <>
              <Share2Icon aria-hidden="true" />
              Share
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="font-heading text-2xl font-bold text-noche">Share this fundraiser</SheetTitle>
          <SheetDescription>
            Every share helps {fundraiser.title} reach more people.
          </SheetDescription>
        </SheetHeader>
        <SharePanel fundraiser={fundraiser} editableMessage={editableMessage} className="px-6" />
      </SheetContent>
    </Sheet>
  );
}
