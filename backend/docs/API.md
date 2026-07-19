# SkillSwap API Documentation

Base URL: `/api/v1`

## Response Format

### Success
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["field: validation error"],
  "statusCode": 400
}
```

## Authentication

Most endpoints require a Bearer token:

```
Authorization: Bearer <access_token>
```

Refresh tokens are stored in httpOnly cookies or passed in the request body to `/auth/refresh`.

## Key Flows

### 1. Register & Login
```
POST /auth/register  { name, email, password }
POST /auth/login     { email, password }
POST /auth/google    { idToken }
GET  /auth/me        (authenticated)
```

### 2. Skills & Matching
```
POST /skills/user-skills  { skillId, intent, level }
GET  /matches             (authenticated — returns ranked matches)
GET  /marketplace/browse  (browse teachers by skill)
```

### 3. Swap Flow
```
POST /swap-requests           Create request
PATCH /swap-requests/:id/accept
POST /sessions                Schedule session
POST /chat/conversations/:id/messages  (paste Meet link here)
PATCH /sessions/:id/complete
POST /reviews                 Leave review
```

## Socket.IO Events

Connect with `auth: { token: accessToken }`

| Event | Direction | Description |
|-------|-----------|-------------|
| `conversation:join` | Client → Server | Join a chat room |
| `message:send` | Client → Server | Send a message |
| `message:new` | Server → Client | New message received |
| `typing:start/stop` | Both | Typing indicators |
| `message:read` | Client → Server | Mark messages read |
| `presence:update` | Server → Client | Online/offline status |
| `notification:new` | Server → Client | Real-time notification |

## Roles (RBAC)

`guest` → `user` → `verified_user` → `moderator` → `admin` → `super_admin`

Admin endpoints require `moderator` or higher.
