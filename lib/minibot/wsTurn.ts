import type { InboundEvent, MinibotWsClient } from "@minibot/client";

export type WsTurnHandlers = {
  onDelta: (content: string, reasoningContent: string) => void;
  onComplete: () => void;
  onError: (message: string) => void;
};

/**
 * Subscribe to one chat, send a user message, accumulate stream until turn_end.
 */
export function startWsTurn(
  ws: MinibotWsClient,
  chatId: string,
  content: string,
  handlers: WsTurnHandlers
): { abort: () => void; dispose: () => void } {
  let answer = "";
  let reasoning = "";
  let finished = false;
  let aborted = false;
  let unsub: (() => void) | null = null;

  const dispose = () => {
    unsub?.();
    unsub = null;
  };

  const finish = (fn: () => void) => {
    if (finished) return;
    finished = true;
    dispose();
    fn();
  };

  const onEvent = (ev: InboundEvent) => {
    if (finished) return;

    if (ev.event === "delta" && typeof ev.text === "string") {
      answer += ev.text;
      handlers.onDelta(answer, reasoning);
      return;
    }

    if (ev.event === "stream_end") {
      if (typeof ev.text === "string") {
        answer = ev.text;
        handlers.onDelta(answer, reasoning);
      }
      return;
    }

    if (ev.event === "reasoning_delta" && typeof ev.text === "string") {
      reasoning += ev.text;
      handlers.onDelta(answer, reasoning);
      return;
    }

    if (ev.event === "message") {
      const kind = typeof ev.kind === "string" ? ev.kind : undefined;
      if (!kind && typeof ev.text === "string" && ev.text) {
        answer = ev.text;
        handlers.onDelta(answer, reasoning);
      }
      return;
    }

    if (ev.event === "turn_end") {
      finish(() => handlers.onComplete());
      return;
    }

    if (ev.event === "error") {
      const detail =
        typeof ev.detail === "string" && ev.detail
          ? ev.detail
          : typeof ev.reason === "string" && ev.reason
            ? ev.reason
            : "minibot 错误";
      if (detail === "aborted" || aborted) {
        finish(() => handlers.onComplete());
        return;
      }
      finish(() => handlers.onError(detail));
    }
  };

  unsub = ws.onChat(chatId, onEvent);
  ws.sendMessage(chatId, content);

  return {
    abort: () => {
      aborted = true;
      try {
        ws.abort(chatId);
      } catch {
        // ignore
      }
    },
    dispose,
  };
}
