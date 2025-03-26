# Bun Chat Application with SQLite

This project demonstrates a simple chat application built with Bun. It uses:

- **WebSockets** for real-time chat functionality.
- **SQLite** for persistent message storage.
- **JWT authentication** to secure the endpoints.

## Features

- **WebSocket Server (`/ws`):**

  - Allows users to connect, send messages, and receive real-time updates.
  - Each incoming message is validated with JWT and broadcast to all connected clients.
  - Messages are stored in an SQLite database.

- **REST API (`/api/messages`):**
  - Allows authenticated users to retrieve previous chat messages.
  - Returns messages sorted by their insertion order.

## Setup & Installation

1. **Install Bun:**  
   Ensure you have Bun installed. Visit [bun.sh](https://bun.sh/) for installation instructions.

2. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/bun-chat-app.git
   cd bun-chat-app
   ```
