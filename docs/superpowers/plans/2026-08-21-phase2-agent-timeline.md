# Phase 2 — Agent timeline MVP (tools + HITL) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On a real Gateway turn, show tool/progress breadcrumbs and let the user approve/reject HITL pauses — without yet replacing GiftedChat with a full custom timeline.

**Architecture:** Extend `startWsTurn` to surface `tool_hint` / `progress` / `approval_required` (keep streaming open until `turn_end`). Chat screen renders a compact Tools card under the assistant bubble and an Approval card that sends `approval_response` via `client.ws.send`. Optionally widen `@minibot/client` types in the sibling package for typed HITL. Defer full `normalizeActivityTimeline` port and GiftedChat replacement to a follow-up.

**Tech Stack:** Expo RN, GiftedChat (kept), `@minibot/client`, Jest, `@minibot/ui` for approval buttons if handy.

## Global Constraints

- Edit in place under `src/` (no `src-next/`).
- Chat path is minibot-only (no DeepSeek fallback).
- Keep `isStreaming` true until `turn_end` (not `stream_end`) so tools after answer text still look active.
- Prefer thin UI: collapsing Tools card + Approval card; do not port webui `AgentActivityCluster` wholesale in this plan.
- Models/runtime from Gateway (`/api/settings*`) is Task 5; do not reintroduce local DeepSeek model lists.
- Commits: conventional prefixes; ask before push.

---

### Task 1: Extend `wsTurn` for tools + HITL events

**Files:**
- Modify: `src/lib/minibot/wsTurn.ts`
- Create: `src/lib/minibot/__tests__/wsTurn.test.ts`
- Reference: `../minibot/webui/src/lib/types/protocol.ts` (`PendingApproval`, `approval_required`)

**Interfaces:**
- Consumes: `MinibotWsClient.onChat`, inbound frames (loose `[key: string]: unknown` OK)
- Produces:

```ts
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
```

- [ ] **Step 1: Write the failing test**

```ts
// @vitest-environment node  -- or jest; match repo (jest-expo)
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
  ws.emit("c1", { event: "message", chat_id: "c1", kind: "tool_hint", text: "Running shell" });
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/liuyidi/github/minibot-react-native && npm test -- --watchAll=false src/lib/minibot/__tests__/wsTurn.test.ts`

Expected: FAIL (handlers / event branches missing)

- [ ] **Step 3: Write minimal implementation**

In `wsTurn.ts`:

- Accumulate `toolLines: ToolProgressLine[]`.
- On `message` with `kind === "tool_hint" | "progress"`: push a line from `text` and optional `tool_events`; call `onToolProgress([...toolLines])`. Do **not** overwrite answer text.
- On `event === "approval_required"`: read `ev.approval` (cast safely); call `onApprovalRequired`.
- On `reasoning_end`: no-op (optional).
- Keep existing delta / reasoning_delta / turn_end / error / abort behavior.
- Ignore unknown `kind` on `message` when text would clobber answer (only apply plain assistant `message` when `!kind`).

- [ ] **Step 4: Run test to verify it passes**

Run: same command as Step 2  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/minibot/wsTurn.ts src/lib/minibot/__tests__/wsTurn.test.ts
git commit -m "feat(chat): extend wsTurn for tool progress and HITL events"
```

---

### Task 2: Wire tool progress into Chat UI

**Files:**
- Create: `src/components/chat/ToolProgressCard.tsx`
- Modify: `src/types/chat.ts` (add optional `toolLines?: ToolProgressLine[]` on `AppChatMessage`)
- Modify: `src/components/chat/ChatBubble.tsx` (render Tools section when `toolLines?.length`)
- Modify: `src/app/(tabs)/index.tsx` (`startMinibotReply` → `onToolProgress` updates streaming message)

**Interfaces:**
- Consumes: `ToolProgressLine` from `wsTurn`
- Produces: assistant bubble shows collapsed “Tools” list with name/text/phase

- [ ] **Step 1: Add `toolLines` to `AppChatMessage` and update streaming message helper**

```ts
// types/chat.ts
toolLines?: import("@/lib/minibot/wsTurn").ToolProgressLine[];
```

In `index.tsx` `updateStreamingMessage`, accept `toolLines` and merge onto the bot message.

- [ ] **Step 2: Implement `ToolProgressCard`**

Compact card: title from i18n `chat.toolsProgress`, list rows `{name ?? text} · {phase}`. Use theme tokens; no DeepSeek styling.

- [ ] **Step 3: Render inside `ChatBubble` above/below reasoning**

If `currentMessage.toolLines?.length`, show `<ToolProgressCard lines={...} />`.

- [ ] **Step 4: Pass `onToolProgress` from `startWsTurn` in `startMinibotReply`**

```ts
onToolProgress: (lines) => {
  updateStreamingMessage(botMessageId, { toolLines: lines, isPending: false });
},
```

- [ ] **Step 5: Manual smoke (device/sim)**

Trigger a tool-using turn on `bot.liuyidi.me` (or local gateway). Expect Tools card to update before final answer.

- [ ] **Step 6: Commit**

```bash
git commit -m "feat(chat): show tool progress under assistant bubble"
```

---

### Task 3: HITL Approval card + respond

**Files:**
- Create: `src/components/chat/ApprovalCard.tsx`
- Modify: `src/app/(tabs)/index.tsx`
- Modify: `src/lib/i18n/messages.ts` (zh/en keys under `chat.approval*`)
- Optional: use `@minibot/ui` `Button`

**Interfaces:**
- Consumes: `PendingApproval` from Task 1; `client.ws.send`
- Produces: user can approve/reject; clears pending UI on decision or `turn_end`

- [ ] **Step 1: Add i18n keys**

```ts
approvalTitle: string; // "需要确认"
approvalApprove: string; // "批准"
approvalReject: string; // "拒绝"
approvalReason: string; // "原因：{reason}"
```

- [ ] **Step 2: Build `ApprovalCard`**

Props: `approval: PendingApproval`, `onApprove`, `onReject`, `disabled?`.  
Show `reason`, `risk`, tool names. Two buttons.

- [ ] **Step 3: State in Chat screen**

```ts
const [pendingApproval, setPendingApproval] = useState<PendingApproval | null>(null);
```

In `startWsTurn` handlers:

```ts
onApprovalRequired: (a) => setPendingApproval(a),
onComplete: () => { setPendingApproval(null); /* existing */ },
```

Render card above composer when `pendingApproval` set.

- [ ] **Step 4: Send decision**

```ts
client.ws.send({
  type: "approval_response",
  approval_id: pendingApproval.id,
  decision: "approve" | "reject",
});
setPendingApproval(null); // optimistic; turn continues until turn_end
```

- [ ] **Step 5: Smoke HITL on gateway with a gated tool**

Expected: card appears; approve resumes; reject ends or errors cleanly.

- [ ] **Step 6: Commit**

```bash
git commit -m "feat(chat): HITL approval card over websocket"
```

---

### Task 4 (optional package): Type HITL on `@minibot/client`

**Files (sibling repo `minibot`):**
- Modify: `packages/minibot-client/src/types.ts` — add `PendingApproval`, `approval_required` inbound, `approval_response` outbound
- Modify: `packages/minibot-client/src/ws.ts` — optional helper `respondToApproval(id, decision)`
- Bump package version; RN already uses `file:../minibot/packages/minibot-client`

- [ ] **Step 1: Add types + helper + unit test in minibot-client**
- [ ] **Step 2: Point RN calls at `ws.respondToApproval` if added**
- [ ] **Step 3: Commit in minibot repo separately**

Defer if file: link + loose `send` is enough for RN MVP.

---

### Task 5: Gateway models in Me/settings (light)

**Files:**
- Create: `src/lib/minibot/settingsApi.ts` — `GET /api/settings` or existing client method if present
- Modify: `src/app/(tabs)/me.tsx` or new `src/app/settings/models.tsx` — read-only active model label from gateway (not DeepSeek ids)
- Spec acceptance: “Model list matches Gateway / WebUI source” — start with **display active model + list presets**; CRUD can wait for Phase 3

- [ ] **Step 1: Probe which REST shape `@minibot/client` / gateway expose** (`SessionsApi` / settings)
- [ ] **Step 2: Show active model on Me connection line or settings row (no local DeepSeek enums)**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(settings): show gateway model from /api/settings"
```

---

### Task 6: Docs + TODO

**Files:**
- Modify: `docs/TODO.md` — mark Phase 2 MVP (tools+HITL) in progress / done
- Modify: `docs/superpowers/specs/2026-08-21-mobile-rebuild-design.md` — note GiftedChat kept; full timeline chrome deferred

- [ ] **Step 1: Update status bullets**
- [ ] **Step 2: Commit**

```bash
git commit -m "docs: record Phase 2 agent MVP status"
```

---

## Deferred (not this plan)

- Replace GiftedChat with custom Agent Timeline / `normalizeActivityTimeline` port
- `file_edit` diff rows, `agent_trace`, `goal_state` chrome
- Hydrate pending approvals on session open (`GET /api/approvals`)
- Login Android/iOS layout polish (separate deferred plan)
- Knowledge / Discover tab revival

## Spec coverage

| Spec acceptance | Task |
|-----------------|------|
| Tool-using turn shows progress | Task 1–2 |
| Can be approved/rejected | Task 3 (+4) |
| Model list matches Gateway | Task 5 (read-only first) |
| Prefer `@minibot/ui` for chrome | Task 3 buttons |
| Full Agent Timeline replace | Deferred |

## Execution handoff

Plan saved to `docs/superpowers/plans/2026-08-21-phase2-agent-timeline.md`.

**Recommended:** implement Task 1 → 2 → 3 in order in this session; Task 4–5 if time; Task 6 with each commit or at the end.
