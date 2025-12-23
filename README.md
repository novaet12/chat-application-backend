# Real Time Chat Application Backend

**Tech Stack:** Node.js, Express, Socket.IO, MongoDB, Redis

backend for a real-time chat app with user authentication, friend lists, group chat, media upload, and more.

---

## Author & Contact
- **Email:** nyboss04@gmail.com
- **Phone:** +251901976857

---

## Project Purpose
This project is a demonstration of my programming and backend development skills. It is a personal project to showcase my ability to design and implement a scalable, real-time chat backend eve though i used other peoples code and used ai 🙂.

---

## Features
- User authentication (JWT)
- Friend list management
- Real-time messaging (Socket.IO, Redis pub/sub)
- Read receipts and typing indicators
- Group chat creation and management
- Message search
- Media upload (images, files)

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### User
- `POST /api/user/add-friend` — Add a friend (body: friendId)
- `POST /api/user/remove-friend` — Remove a friend (body: friendId)

### Group
- `POST /api/group/create` — Create a group (body: name, members[])
- `POST /api/group/add-member` — Add member to group (body: groupId, userId)
- `POST /api/group/remove-member` — Remove member from group (body: groupId, userId)
- `GET /api/group/my-groups` — List groups for user

### Message
- `GET /api/message/search?q=...` — Search messages by content
- `POST /api/message/upload` — Upload media (multipart/form-data, field: file, body: recipients[])

---

## WebSocket Events (Socket.IO)

- **Connection:** Authenticate with JWT via `auth.token` or `query.token`
- **send_message** — `{ recipients, content, group, mediaUrl }`
- **receive_message** — (server to client) message object
- **read_message** — `{ messageId }`
- **message_read** — (server to client) `{ messageId, userId }`
- **typing** — `{ to }` (to user or group)
- **join_group** — `{ groupId }`
- **leave_group** — `{ groupId }`

---

## Media Upload
- Send a `POST` request to `/api/message/upload` with `multipart/form-data` (field: `file`).
- Include `recipients` (JSON array or stringified array), optional `group`, and `content`.
- Uploaded files are served at `/uploads/<filename>`.

---

## Deployment (Example: AWS EC2)
1. Clone the repo and install dependencies (`npm install`).
2. Set up `.env` with your MongoDB, Redis, and JWT settings.
3. Open ports 5000 (backend) and 6379 (Redis) as needed.
4. Run with `npm start` or use a process manager (e.g., pm2).
5. (Optional) Use Nginx as a reverse proxy for SSL.

---

