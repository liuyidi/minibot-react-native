import {
  groupSessionsByDate,
  sortSessionsForDrawer,
} from "@/lib/chat/groupSessionsByDate";
import type { ChatSession } from "@/lib/chat/session/types";

describe("groupSessionsByDate", () => {
  const base: ChatSession = {
    id: "1",
    title: "a",
    createdAt: 0,
    updatedAt: 0,
  };

  test("groups by local day and labels today", () => {
    const now = new Date(2026, 7, 21, 15, 0, 0).getTime();
    const today = new Date(2026, 7, 21, 10, 0, 0).getTime();
    const older = new Date(2026, 7, 9, 12, 0, 0).getTime();
    const groups = groupSessionsByDate(
      [
        { ...base, id: "t", updatedAt: today },
        { ...base, id: "o", updatedAt: older },
      ],
      "zh",
      now
    );
    expect(groups[0]?.label).toBe("今天");
    expect(groups[0]?.sessions.map((s) => s.id)).toEqual(["t"]);
    expect(groups[1]?.label).toBe("2026年08月09日");
  });
});

describe("sortSessionsForDrawer", () => {
  test("splits pinned keys first", () => {
    const sessions: ChatSession[] = [
      {
        id: "a",
        key: "websocket:a",
        title: "a",
        createdAt: 1,
        updatedAt: 10,
      },
      {
        id: "b",
        key: "websocket:b",
        title: "b",
        createdAt: 1,
        updatedAt: 20,
      },
    ];
    const { pinned, unpinned } = sortSessionsForDrawer(
      sessions,
      new Set(["websocket:a"])
    );
    expect(pinned.map((s) => s.id)).toEqual(["a"]);
    expect(unpinned.map((s) => s.id)).toEqual(["b"]);
  });
});
