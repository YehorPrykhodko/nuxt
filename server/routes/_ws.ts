// server/routes/_ws.ts
// Code généré par une IA – serveur WebSocket pour forum temps réel

import { defineWebSocketHandler } from 'h3'

// Ensemble des clients connectés
const clients = new Set<WebSocket>()

export default defineWebSocketHandler({
  open(ws) {
    console.log('[ws] ouvert')
    clients.add(ws)
  },
  message(ws, message) {
    console.log('[ws] reçu :', message)
    // On attend un JSON { type: 'newSujet'|'newMessage', payload: {...} }
    try {
      const msg = JSON.parse(message.toString())
      // On broadcast à tous les clients
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg))
        }
      }
    } catch (e) {
      console.error('[ws] JSON invalide', e)
    }
  },
  close(ws) {
    console.log('[ws] fermé')
    clients.delete(ws)
  },
  error(ws, err) {
    console.error('[ws] erreur', err)
    clients.delete(ws)
  }
})
