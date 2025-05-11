import { ref } from "vue";

export function useWs() {
  const lastEvent = ref<{ type: string; payload: any } | null>(null);
  let ws: WebSocket | null = null;
  let connected = false;

  function connect() {
    if (connected || process.server) return;
    connected = true;

    const proto = location.protocol === "https:" ? "wss" : "ws";
    ws = new WebSocket(`${proto}://${location.host}/_ws`);
    ws.addEventListener("open", () => console.log("WS open"));
    ws.addEventListener("message", (ev) => {
      try {
        lastEvent.value = JSON.parse(ev.data);
      } catch {
        lastEvent.value = { raw: ev.data };
      }
    });
    ws.addEventListener("close", () => console.log("WS close"));
    ws.addEventListener("error", (e) => console.error("WS err", e));
  }

  function send(type: string, payload: any) {
    const msg = JSON.stringify({ type, payload });
    ws?.send(msg);
  }

  return { lastEvent, connect, send };
}
