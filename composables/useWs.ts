// Положите или замените в composables/useWs.ts

import { ref, onMounted } from 'vue'

export function useWs() {
  const lastEvent = ref<{ type: string; payload: any } | null>(null)
  let ws: WebSocket | null = null

  function connect() {
    if (process.server) return
    console.log('[WS] connect →')
    const proto = location.protocol === 'https:' ? 'wss' : 'ws'
    ws = new WebSocket(`${proto}://${location.host}/_ws`)
    ws.addEventListener('open', () => console.log('[WS] open'))
    ws.addEventListener('message', ev => {
      console.log('[WS] recv', ev.data)
      try {
        lastEvent.value = JSON.parse(ev.data)
      } catch {
        lastEvent.value = { raw: ev.data }
      }
    })
    ws.addEventListener('close', () => console.log('[WS] close'))
    ws.addEventListener('error', e => console.error('[WS] err', e))
  }

  function send(type: string, payload: any) {
    const msg = JSON.stringify({ type, payload })
    console.log('[WS] send', msg)
    ws?.send(msg)
  }

  onMounted(connect)

  return { lastEvent, connect, send }
}
