import { WebSocketServer } from "ws";

/**
 * Attaches WebSocket server to an existing HTTP server
 * @param {http.Server} server
 */
export default function attachWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
      console.log("Received:", message.toString());

      // Broadcast to all clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(message.toString());
        }
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  console.log("✅ WebSocket server attached");
}
