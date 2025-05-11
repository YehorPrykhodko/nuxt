export default defineWebSocketHandler({
  open(peer) {
    console.log("[ws] open", peer)
    peers.add(peer)
  },
  message(peer, message) {
    const msg = message.text()
    console.log("[ws] message", peer, msg)
    if (msg.includes("ping")) {
      peer.send("pong")
    }
  },
  close(peer, event) {
    console.log("[ws] close", peer, event)
    peers.delete(peer)
  },
  error(peer, error) {
    console.log("[ws] error", peer, error)
    peers.delete(peer)
  }
})

const peers = new Set()

export function broadcastMessage(message: string) {
  for (const peer of peers) {
    peer.send(message)
  }
}
