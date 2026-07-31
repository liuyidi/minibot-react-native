/**
 * WebKit-backed WebSocket for iOS Expo Go.
 *
 * React Native's iOS WebSocket uses SocketRocket (NSStream/SecureTransport).
 * On recent iOS builds that stack aborts the TLS handshake immediately after
 * ClientHello (OSStatus -9806) even when Safari/WebKit WSS to the same host works.
 * This shim runs the real WebSocket inside a hidden WebView (WebKit).
 */

type BridgeInbound =
  | { type: "ready" }
  | { type: "open"; id: number }
  | { type: "message"; id: number; data: string }
  | { type: "error"; id: number; message?: string }
  | { type: "close"; id: number; code: number; reason: string };

type BridgeOutbound =
  | { type: "connect"; id: number; url: string }
  | { type: "send"; id: number; data: string }
  | { type: "close"; id: number; code?: number; reason?: string };

type CommandHandler = (cmd: BridgeOutbound) => void;
type ReadyHandler = () => void;

const sockets = new Map<number, WebViewWebSocket>();
let nextId = 1;
let commandHandler: CommandHandler | null = null;
let bridgeReady = false;
const readyWaiters: ReadyHandler[] = [];
const pendingCommands: BridgeOutbound[] = [];

export function setWebViewCommandHandler(handler: CommandHandler | null): void {
  commandHandler = handler;
  if (handler && bridgeReady) {
    flushPending();
  }
}

export function markWebViewBridgeReady(): void {
  bridgeReady = true;
  flushPending();
  while (readyWaiters.length) {
    readyWaiters.shift()?.();
  }
}

export function markWebViewBridgeUnavailable(): void {
  bridgeReady = false;
  commandHandler = null;
}

export function handleWebViewBridgeMessage(raw: string): void {
  let msg: BridgeInbound;
  try {
    msg = JSON.parse(raw) as BridgeInbound;
  } catch {
    return;
  }
  if (msg.type === "ready") {
    markWebViewBridgeReady();
    return;
  }
  const sock = sockets.get(msg.id);
  if (!sock) return;
  sock._handleBridge(msg);
}

function enqueue(cmd: BridgeOutbound): void {
  if (commandHandler && bridgeReady) {
    commandHandler(cmd);
    return;
  }
  pendingCommands.push(cmd);
}

function flushPending(): void {
  if (!commandHandler) return;
  while (pendingCommands.length) {
    commandHandler(pendingCommands.shift()!);
  }
}

function waitUntilReady(timeoutMs = 8000): Promise<void> {
  if (bridgeReady && commandHandler) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("WebView WebSocket bridge not ready"));
    }, timeoutMs);
    readyWaiters.push(() => {
      clearTimeout(timer);
      resolve();
    });
  });
}

export const WEBVIEW_WS_BRIDGE_HTML = `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      (function () {
        var sockets = {};
        function post(msg) {
          try {
            window.ReactNativeWebView.postMessage(JSON.stringify(msg));
          } catch (e) {}
        }
        function connect(id, url) {
          try {
            var ws = new WebSocket(url);
            sockets[id] = ws;
            ws.onopen = function () { post({ type: "open", id: id }); };
            ws.onmessage = function (ev) {
              post({ type: "message", id: id, data: String(ev.data) });
            };
            ws.onerror = function () {
              post({ type: "error", id: id, message: "webview websocket error" });
            };
            ws.onclose = function (ev) {
              post({
                type: "close",
                id: id,
                code: ev && typeof ev.code === "number" ? ev.code : 1006,
                reason: (ev && ev.reason) || ""
              });
              delete sockets[id];
            };
          } catch (err) {
            post({
              type: "error",
              id: id,
              message: err && err.message ? err.message : "connect failed"
            });
            post({ type: "close", id: id, code: 1006, reason: "connect failed" });
          }
        }
        function send(id, data) {
          var ws = sockets[id];
          if (ws && ws.readyState === 1) ws.send(data);
        }
        function closeSocket(id, code, reason) {
          var ws = sockets[id];
          if (!ws) return;
          try { ws.close(code || 1000, reason || ""); } catch (e) {}
        }
        function handle(raw) {
          var msg;
          try { msg = typeof raw === "string" ? JSON.parse(raw) : raw; } catch (e) { return; }
          if (!msg || !msg.type) return;
          if (msg.type === "connect") connect(msg.id, msg.url);
          else if (msg.type === "send") send(msg.id, msg.data);
          else if (msg.type === "close") closeSocket(msg.id, msg.code, msg.reason);
        }
        document.addEventListener("message", function (event) {
          handle(event.data);
        });
        window.addEventListener("message", function (event) {
          handle(event.data);
        });
        // Called from React Native via injectJavaScript.
        window.__minibotHandle = handle;
        post({ type: "ready" });
      })();
    </script>
  </body>
</html>`;

type Handler = ((ev: unknown) => void) | null;

/**
 * Minimal WebSocket stand-in used by @minibot/client socketFactory.
 */
export class WebViewWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;

  readyState = WebViewWebSocket.CONNECTING;
  url: string;
  protocol = "";
  extensions = "";
  binaryType: "blob" | "arraybuffer" = "arraybuffer";
  bufferedAmount = 0;

  onopen: Handler = null;
  onmessage: Handler = null;
  onerror: Handler = null;
  onclose: Handler = null;

  private id: number;
  private listeners = new Map<string, Set<(ev: unknown) => void>>();

  constructor(url: string) {
    this.url = url;
    this.id = nextId++;
    sockets.set(this.id, this);
    void this.start();
  }

  private async start(): Promise<void> {
    try {
      await waitUntilReady();
      enqueue({ type: "connect", id: this.id, url: this.url });
    } catch (error) {
      this.readyState = WebViewWebSocket.CLOSED;
      const message =
        error instanceof Error ? error.message : "WebView bridge unavailable";
      this.onerror?.({ message });
      this.dispatch("error", { message });
      this.onclose?.({ code: 1006, reason: message });
      this.dispatch("close", { code: 1006, reason: message });
      sockets.delete(this.id);
    }
  }

  send(data: string): void {
    if (this.readyState !== WebViewWebSocket.OPEN) {
      throw new Error("INVALID_STATE_ERR");
    }
    enqueue({ type: "send", id: this.id, data: String(data) });
  }

  close(code = 1000, reason = ""): void {
    if (
      this.readyState === WebViewWebSocket.CLOSING ||
      this.readyState === WebViewWebSocket.CLOSED
    ) {
      return;
    }
    this.readyState = WebViewWebSocket.CLOSING;
    enqueue({ type: "close", id: this.id, code, reason });
  }

  addEventListener(type: string, listener: (ev: unknown) => void): void {
    let set = this.listeners.get(type);
    if (!set) {
      set = new Set();
      this.listeners.set(type, set);
    }
    set.add(listener);
  }

  removeEventListener(type: string, listener: (ev: unknown) => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event: { type: string }): boolean {
    this.dispatch(event.type, event);
    return true;
  }

  _handleBridge(msg: BridgeInbound): void {
    if (msg.type === "open") {
      this.readyState = WebViewWebSocket.OPEN;
      this.onopen?.({});
      this.dispatch("open", {});
      return;
    }
    if (msg.type === "message") {
      const ev = { data: msg.data };
      this.onmessage?.(ev);
      this.dispatch("message", ev);
      return;
    }
    if (msg.type === "error") {
      const ev = { message: msg.message || "error" };
      this.onerror?.(ev);
      this.dispatch("error", ev);
      return;
    }
    if (msg.type === "close") {
      this.readyState = WebViewWebSocket.CLOSED;
      const ev = { code: msg.code, reason: msg.reason || "" };
      this.onclose?.(ev);
      this.dispatch("close", ev);
      sockets.delete(this.id);
    }
  }

  private dispatch(type: string, ev: unknown): void {
    const set = this.listeners.get(type);
    if (!set) return;
    for (const listener of set) listener(ev);
  }
}

export function createIosWebSocket(url: string): WebSocket {
  return new WebViewWebSocket(url) as unknown as WebSocket;
}
