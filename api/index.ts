import { Database } from "bun:sqlite";
import jwt from "jsonwebtoken";

type User = {
  username: string;
  password?: string;
};

type Message = {
  id: number;
  username: string;
  message: string;
  timestamp: Date | string;
};

interface WebSocketData {
  username: string;
  typing?: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const db = new Database("chat.db");

db.query(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  message TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.query(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`).run();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

const server = Bun.serve({
  async fetch(req, server) {

    if (req.method === "OPTIONS") {
      console.log("OPTIONS request received");
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const headers = {
      "Content-Type": "application/json",
      ...corsHeaders
    };

    const url = new URL(req.url);

    if (url.pathname === "/messages") {
      console.log('/messages', req);
      const rows = db.query("SELECT username, message, timestamp FROM messages ORDER BY timestamp DESC LIMIT 50").all();
      return new Response(JSON.stringify(rows), { headers });
    }

    if (url.pathname === "/auth") {
      const { username, password } = await req.json() as User;
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
      return new Response(JSON.stringify({ token }), { headers });
    }

    if (url.pathname === '/ws') {
      const token = url.searchParams.get('token');

      if (!token) {
        return new Response('Token required', { status: 401 });
      }

      try {

        const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
        if (server.upgrade(req, { data: { username: decoded.username } })) {
          return undefined;
        }

        return new Response('WebSocket upgrade failed', { status: 500 });
      } catch (err) {
        return new Response('Invalid token', { status: 401 });
      }
    }

    return new Response("WebSocket upgrade error", { status: 400, headers });
  },
  websocket: {
    open(ws: { data: WebSocketData, subscribe }) {
      const { username } = ws.data;
      ws.subscribe("chatroom");
      server.publish("chatroom", `${username} joined the chat.`);
    },
    message(ws, message: any) {
      const data = JSON.parse(message.toString());
      const { typing, content, username, timestamp } = data;
      try {
        if (typing === true) {
          server.publish("chatroom", JSON.stringify({ username, typing }));
          return;
        }
        console.log(username, 'message', message)
        db.query("INSERT INTO messages (username, message) VALUES (?, ?)").run(username, content);
        server.publish("chatroom", JSON.stringify({ username, message: content, timestamp }));
      } catch (error) {
        console.error("Invalid message format", error);
      }
    },
    close(ws: { data: WebSocketData }) {
      const { username } = ws.data;
      server.publish("chatroom", JSON.stringify({ username, message: "left the chat" }));
    }
  }
});