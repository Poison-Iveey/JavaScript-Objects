import { afterEach, describe, expect, it, vi } from "vitest";
import { dayKey, formatDayKey, greeting, initials } from "./dates.js";
import { isEbookFile, isImageFile, isValidEmail } from "./validators.js";
import { COVER_COUNT, coverIndex } from "./covers.js";
import { pageFor } from "../config/navigation.js";

afterEach(() => vi.useRealTimers());

describe("dates", () => {
  it("builds zero-padded day keys, counting back from today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 3, 12));
    expect(dayKey()).toBe("2026-01-03");
    expect(dayKey(3)).toBe("2025-12-31");
  });

  it("formats day keys as MM/DD/YYYY", () => {
    expect(formatDayKey("2026-11-25")).toBe("11/25/2026");
  });

  it("makes up to two initials", () => {
    expect(initials("yvette christine reader")).toBe("YC");
    expect(initials("")).toBe("?");
    expect(initials(undefined)).toBe("?");
  });

  it("greets by time of day with the first name", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9));
    expect(greeting("Ada Lovelace")).toBe("Good morning, Ada");
    vi.setSystemTime(new Date(2026, 0, 1, 14));
    expect(greeting("")).toBe("Good afternoon, reader");
    vi.setSystemTime(new Date(2026, 0, 1, 20));
    expect(greeting(null)).toBe("Good evening, reader");
  });
});

describe("validators", () => {
  it("accepts only supported image types", () => {
    expect(isImageFile({ type: "image/png" })).toBe(true);
    expect(isImageFile({ type: "image/svg+xml" })).toBe(false);
    expect(isImageFile(null)).toBe(false);
  });

  it("recognises ebooks by extension or MIME type", () => {
    expect(isEbookFile({ name: "Book.EPUB", type: "" })).toBe(true);
    expect(isEbookFile({ name: "book", type: "application/pdf" })).toBe(true);
    expect(isEbookFile({ name: "notes.txt", type: "text/plain" })).toBe(false);
  });

  it("checks email shape", () => {
    expect(isValidEmail("reader@example.com")).toBe(true);
    expect(isValidEmail("reader@example")).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
  });
});

describe("covers", () => {
  it("gives every book a stable palette index in range", () => {
    const id = "6ae01e50-d1bb-4a94-9d70-976c037c8553";
    expect(coverIndex(id)).toBe(coverIndex(id));
    for (const x of [id, 1, "", null, "another-id"]) {
      expect(coverIndex(x)).toBeGreaterThanOrEqual(0);
      expect(coverIndex(x)).toBeLessThan(COVER_COUNT);
    }
  });
});

describe("navigation", () => {
  it("maps routes, including nested ones, to their nav page", () => {
    expect(pageFor("/library").key).toBe("lib");
    expect(pageFor("/messages/u2").key).toBe("msgs");
    expect(pageFor("/readers/abc").title).toBe("Reader");
  });

  it("falls back to the dashboard for unknown routes", () => {
    expect(pageFor("/nope").key).toBe("dash");
    // A prefix match must stop at a path boundary.
    expect(pageFor("/libraryX").key).toBe("dash");
  });
});
