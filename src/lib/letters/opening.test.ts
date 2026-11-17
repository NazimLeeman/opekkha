import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeOpening, isLetterOpenable } from "./opening.ts";

describe("computeOpening", () => {
  it("marks immediate letters available now", () => {
    const now = new Date("2026-03-26T12:00:00.000Z");
    const result = computeOpening({ openingRule: "immediate" }, now);
    assert.equal(result.status, "available");
    assert.equal(result.opensAt, now.toISOString());
  });

  it("persists interval target from send time", () => {
    const now = new Date("2026-03-26T12:00:00.000Z");
    const result = computeOpening(
      { openingRule: "after_interval", intervalDays: 7 },
      now,
    );
    assert.equal(result.status, "scheduled");
    assert.equal(result.opensAt, "2026-04-02T12:00:00.000Z");
  });

  it("rejects past datetime opens", () => {
    assert.throws(() =>
      computeOpening(
        {
          openingRule: "at_datetime",
          opensAtLocal: "2020-01-01T00:00:00.000Z",
        },
        new Date("2026-03-26T12:00:00.000Z"),
      ),
    );
  });
});

describe("isLetterOpenable", () => {
  it("keeps scheduled letters locked before opens_at", () => {
    assert.equal(
      isLetterOpenable({
        status: "scheduled",
        opensAt: "2026-04-01T00:00:00.000Z",
        now: new Date("2026-03-26T00:00:00.000Z"),
      }),
      false,
    );
  });

  it("allows scheduled letters after opens_at", () => {
    assert.equal(
      isLetterOpenable({
        status: "scheduled",
        opensAt: "2026-03-01T00:00:00.000Z",
        now: new Date("2026-03-26T00:00:00.000Z"),
      }),
      true,
    );
  });

  it("never opens revoked letters", () => {
    assert.equal(
      isLetterOpenable({
        status: "revoked",
        opensAt: "2020-01-01T00:00:00.000Z",
      }),
      false,
    );
  });
});
