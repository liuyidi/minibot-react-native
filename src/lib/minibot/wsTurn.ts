import type { InboundEvent, MinibotWsClient } from "@minibot/client";

export type ToolProgressLine = {
  id: string;
  text: string;
  phase?: "start" | "end" | "error" | string;
  name?: string;
};

export type PendingApproval = {
  id: string;
  session_id: string;
  reason: string;
  risk: string;
  tool_calls?: Array<{ name?: string; arguments?: unknown }>;
  expires_at_ms?: number;
  status?: string;
};

export type WsTurnHandlers = {
  onDelta: (content: string, reasoningContent: string) => void;
  onToolProgress?: (lines: ToolProgressLine[]) => void;
  onApprovalRequired?: (approval: PendingApproval) => void;
  onComplete: () => void;
  onError: (message: string) => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseApproval(raw: unknown): PendingApproval | null {
  if (!isRecord(raw)) return null;
  const id = typeof raw.id === "string" ? raw.id : null;
  if (!id) return null;
  return {
    id,
    session_id: typeof raw.session_id === "string" ? raw.session_id : "",
    reason: typeof raw.reason === "string" ? raw.reason : "",
    risk: typeof raw.risk === "string" ? raw.risk : "",
    tool_calls: Array.isArray(raw.tool_calls)
      ? (raw.tool_calls as PendingApproval["tool_calls"])
      : undefined,
    expires_at_ms:
      typeof raw.expires_at_ms === "number" ? raw.expires_at_ms : undefined,
    status: typeof raw.status === "string" ? raw.status : undefined,
  };
}

/**
 * Subscribe to one chat, send a user message, accumulate stream until turn_end.
 * Keeps the turn open through tool_hint / progress / HITL until turn_end.
 */
export function startWsTurn(
  ws: MinibotWsClient,
  chatId: string,
  content: string,
  handlers: WsTurnHandlers
): { abort: () => void; dispose: () => void } {
  let answer = "";
  let reasoning = "";
  const toolLines: ToolProgressLine[] = [];
  let finished = false;
  let aborted = false;
  let unsub: (() => void) | null = null;
  let toolSeq = 0;

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

  const pushToolLine = (partial: Omit<ToolProgressLine, "id"> & { id?: string }) => {
    toolLines.push({
      id: partial.id ?? `tool_${++toolSeq}`,
      text: partial.text,
      phase: partial.phase,
      name: partial.name,
    });
    handlers.onToolProgress?.([...toolLines]);
  };

  const onEvent = (ev: InboundEvent | Record<string, unknown>) => {
    if (finished) return;

    const eventName = typeof ev.event === "string" ? ev.event : "";

    if (eventName === "delta" && typeof (ev as { text?: unknown }).text === "string") {
      answer += (ev as { text: string }).text;
      handlers.onDelta(answer, reasoning);
      return;
    }

    if (eventName === "stream_end") {
      const text = (ev as { text?: unknown }).text;
      if (typeof text === "string") {
        answer = text;
        handlers.onDelta(answer, reasoning);
      }
      return;
    }

    if (
      eventName === "reasoning_delta" &&
      typeof (ev as { text?: unknown }).text === "string"
    ) {
      reasoning += (ev as { text: string }).text;
      handlers.onDelta(answer, reasoning);
      return;
    }

    if (eventName === "reasoning_end") {
      return;
    }

    if (eventName === "approval_required") {
      const approval = parseApproval((ev as { approval?: unknown }).approval);
      if (approval) {
        handlers.onApprovalRequired?.(approval);
      }
      return;
    }

    if (eventName === "message") {
      const kind = typeof (ev as { kind?: unknown }).kind === "string"
        ? (ev as { kind: string }).kind
        : undefined;
      const text =
        typeof (ev as { text?: unknown }).text === "string"
          ? (ev as { text: string }).text
          : "";

      if (kind === "tool_hint" || kind === "progress") {
        const toolEvents = (ev as { tool_events?: unknown }).tool_events;
        if (Array.isArray(toolEvents) && toolEvents.length > 0) {
          for (const item of toolEvents) {
            if (!isRecord(item)) continue;
            pushToolLine({
              text:
                typeof item.message === "string"
                  ? item.message
                  : typeof item.name === "string"
                    ? item.name
                    : text || "tool",
              phase: typeof item.phase === "string" ? item.phase : undefined,
              name: typeof item.name === "string" ? item.name : undefined,
            });
          }
        } else if (text) {
          pushToolLine({ text, phase: kind === "progress" ? "start" : undefined });
        }
        return;
      }

      if (!kind && text) {
        answer = text;
        handlers.onDelta(answer, reasoning);
      }
      return;
    }

    if (eventName === "turn_end") {
      finish(() => handlers.onComplete());
      return;
    }

    if (eventName === "error") {
      const detail =
        typeof (ev as { detail?: unknown }).detail === "string" &&
        (ev as { detail: string }).detail
          ? (ev as { detail: string }).detail
          : typeof (ev as { reason?: unknown }).reason === "string" &&
              (ev as { reason: string }).reason
            ? (ev as { reason: string }).reason
            : "minibot 错误";
      if (detail === "aborted" || aborted) {
        finish(() => handlers.onComplete());
        return;
      }
      finish(() => handlers.onError(detail));
    }
  };

  unsub = ws.onChat(chatId, onEvent as (ev: InboundEvent) => void);
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
