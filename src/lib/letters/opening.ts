import type { OpeningRule } from "@/types/database";

export type OpeningInput = {
  openingRule: OpeningRule;
  opensAtLocal?: string | null;
  intervalDays?: number | null;
  timezone?: string;
};

export type OpeningComputation = {
  openingRule: OpeningRule;
  opensAt: string | null;
  status: "draft" | "scheduled" | "available";
};

/**
 * Persist target timestamp at send time. Do not recalculate on every page load.
 */
export function computeOpening(input: OpeningInput, now = new Date()): OpeningComputation {
  const timezone = input.timezone || "Asia/Dhaka";

  if (input.openingRule === "immediate" || input.openingRule === "recipient_confirmation") {
    return {
      openingRule: input.openingRule,
      opensAt: now.toISOString(),
      status: "available",
    };
  }

  if (input.openingRule === "after_interval") {
    const days = input.intervalDays ?? 0;
    if (!Number.isFinite(days) || days <= 0) {
      throw new Error("Interval must be a positive number of days");
    }
    const opens = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return {
      openingRule: "after_interval",
      opensAt: opens.toISOString(),
      status: "scheduled",
    };
  }

  // at_datetime — expect ISO-like local datetime from the form; interpret in sender TZ label for display,
  // store as absolute UTC via Date parse of the provided value (browser sends offset or we treat as local wall time).
  if (!input.opensAtLocal) {
    throw new Error("Opening date/time is required");
  }

  const opens = new Date(input.opensAtLocal);
  if (Number.isNaN(opens.getTime())) {
    throw new Error("Invalid opening date/time");
  }
  if (opens.getTime() <= now.getTime()) {
    throw new Error("Opening time must be in the future");
  }

  void timezone;

  return {
    openingRule: "at_datetime",
    opensAt: opens.toISOString(),
    status: "scheduled",
  };
}

export function isLetterOpenable(args: {
  status: string;
  opensAt: string | null;
  now?: Date;
}): boolean {
  if (args.status === "revoked" || args.status === "expired" || args.status === "draft") {
    return false;
  }
  if (args.status === "available" || args.status === "opened") {
    if (!args.opensAt) return true;
    return new Date(args.opensAt).getTime() <= (args.now ?? new Date()).getTime();
  }
  if (args.status === "scheduled" && args.opensAt) {
    return new Date(args.opensAt).getTime() <= (args.now ?? new Date()).getTime();
  }
  return false;
}

/** Envelope payload only — never include body. */
export type EnvelopeView = {
  letterId: string;
  title: string;
  prompt: string | null;
  senderLabel: string | null;
  opensAt: string | null;
  status: string;
  openable: boolean;
  timezone: string;
};
