# RecFinder

Find and join local pickup sports — open gyms, scrimmages, and drop-in games near you.

## Features

- Browse and search open games by sport and city
- Create and manage your own games
- Join/leave games with live attendee counts
- Real-time in-game chat (WebSocket/STOMP)
- Friend system — send, accept, and remove friends
- User profiles with sports, bio, and social links

## Tech Stack

**Backend** — Java 26, Spring Boot 4, Spring Security (JWT), Spring WebSocket/STOMP, Spring Data JPA, PostgreSQL, Flyway

**Frontend** — React (Vite), Tailwind CSS, React Router, STOMP.js

## Getting Started

### Prerequisites

- JDK 26
- PostgreSQL 15+
- Node.js 20+

### Backend

```bash
# Create the database
createdb recfinder

# Set environment variables (see below), then run:
./mvnw spring-boot:run
```

Runs on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `JWT_SECRET` | Secret key for signing JWTs (min 32 chars) |
| `JWT_EXPIRATION_MS` | Token lifetime in milliseconds |

## Project Structure

```
src/main/java/com/recfinder/recfinder/
├── controller/     REST + WebSocket controllers
├── service/        Business logic
├── repository/     Spring Data JPA repositories
├── entity/         JPA entities
├── dto/            Request/response DTOs
├── mapper/         Entity ↔ DTO mapping
├── config/         Security, CORS, WebSocket config
├── security/       JWT filter, UserDetailsService, WebSocket auth
└── exception/      Custom exceptions + GlobalExceptionHandler

frontend/src/
├── pages/          Route-level components
├── components/     Shared components (Navbar, ChatPanel, ScrimmageCard)
├── context/        AuthContext
└── api.js          All backend API calls
```

## API Overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/users/me` | Current user profile |
| PUT | `/api/users/me` | Update profile |
| GET | `/api/scrimmages` | List/search games |
| POST | `/api/scrimmages` | Create a game |
| GET | `/api/scrimmages/{id}` | Game detail |
| PUT | `/api/scrimmages/{id}` | Edit game |
| DELETE | `/api/scrimmages/{id}` | Delete game |
| POST | `/api/scrimmages/{id}/attendees` | Join game |
| DELETE | `/api/scrimmages/{id}/attendees` | Leave game |
| GET | `/api/scrimmages/{id}/attendees` | List attendees |
| GET | `/api/scrimmages/{id}/messages` | Chat history |
| POST | `/api/friendships/{userId}` | Send friend request |
| PUT | `/api/friendships/{id}/accept` | Accept request |
| PUT | `/api/friendships/{id}/decline` | Decline request |
| DELETE | `/api/friendships/{id}/withdraw` | Withdraw sent request |
| DELETE | `/api/friendships/{id}/remove` | Remove friend |
| GET | `/api/friendships` | List friends |
| GET | `/api/friendships/requests` | Incoming requests |
| GET | `/api/friendships/sent` | Sent requests |

**WebSocket:** Connect to `/ws` (SockJS), send to `/app/chat/{scrimmageId}`, subscribe to `/topic/scrimmages/{scrimmageId}`. Pass JWT in the STOMP `Authorization` connect header.
