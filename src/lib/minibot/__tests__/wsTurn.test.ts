import { startWsTurn } from "@/lib/minibot/wsTurn";

function mockWs() {
  const handlers = new Map<string, (ev: unknown) => void>();
  return {
    onChat: (chatId: string, fn: (ev: unknown) => void) => {
      handlers.set(chatId, fn);
      return () => handlers.delete(chatId);
    },
    sendMessage: jest.fn(),
    abort: jest.fn(),
    send: jest.fn(),
    emit(chatId: string, ev: unknown) {
      handlers.get(chatId)?.(ev);
    },
  };
}

describe("startWsTurn", () => {
  test("forwards tool_hint and keeps turn open until turn_end", () => {
    const ws = mockWs();
    const onDelta = jest.fn();
    const onToolProgress = jest.fn();
    const onComplete = jest.fn();

    startWsTurn(ws as never, "c1", "hi", {
      onDelta,
      onToolProgress,
      onComplete,
      onError: jest.fn(),
    });

    ws.emit("c1", {
      event: "message",
      chat_id: "c1",
      kind: "tool_hint",
      text: "Running shell",
    });
    expect(onToolProgress).toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();

    ws.emit("c1", { event: "turn_end", chat_id: "c1" });
    expect(onComplete).toHaveBeenCalled();
  });

  test("forwards approval_required", () => {
    const ws = mockWs();
    const onApprovalRequired = jest.fn();

    startWsTurn(ws as never, "c1", "hi", {
      onDelta: jest.fn(),
      onApprovalRequired,
      onComplete: jest.fn(),
      onError: jest.fn(),
    });

    ws.emit("c1", {
      event: "approval_required",
      chat_id: "c1",
      approval: {
        id: "a1",
        session_id: "c1",
        reason: "exec",
        risk: "high",
        tool_calls: [{ name: "exec" }],
      },
    });

    expect(onApprovalRequired).toHaveBeenCalledWith(
      expect.objectContaining({ id: "a1", reason: "exec" })
    );
  });

  test("does not treat tool_hint text as assistant answer", () => {
    const ws = mockWs();
    const onDelta = jest.fn();

    startWsTurn(ws as never, "c1", "hi", {
      onDelta,
      onComplete: jest.fn(),
      onError: jest.fn(),
    });

    ws.emit("c1", { event: "delta", chat_id: "c1", text: "Hello" });
    ws.emit("c1", {
      event: "message",
      chat_id: "c1",
      kind: "progress",
      text: "tool running",
    });

    const last = onDelta.mock.calls.at(-1);
    expect(last?.[0]).toBe("Hello");
  });
});
