# RecFinder

> Find and create local open sports near you.

RecFinder is a web app that helps people discover and organize local drop-in sports — open gyms, pickup runs, scrimmages — in their city. Users can browse open sessions filtered by sport and location, create their own events, chat with attendees, and build a social network of regular pickup partners.

## Status

🚧 **Early development.** This is a portfolio project being built incrementally to learn Spring Boot end-to-end. See the [Roadmap](#roadmap) for progress.

## Why this project exists

Two goals, in priority order:

1. **Learning.** Build a real, full-stack application from scratch to learn Spring Boot deeply (REST APIs, JPA, Spring Security, WebSockets) alongside React/Tailwind on the frontend. Demonstrate solid system design choices in a portfolio.
2. **Actual use.** Eventually deploy it for use in my local city and any other community that wants better visibility into local pickup sports.

## Tech stack

**Frontend**
- React (Vite)
- TailwindCSS
- React Router
- Fetch or Axios for API calls (TBD)

**Backend**
- Java 26
- Spring Boot 4.0.x
- Spring Data JPA
- Spring Security with JWT auth
- Spring WebSocket / STOMP (for chat)
- PostgreSQL

**Tooling**
- IntelliJ IDEA (backend)
- VS Code (frontend)
- Maven for builds

## Features

### Core features

- **User profiles** with name, age, favorite sport, bio, and social media handles
- **Create scrimmages** labeled with city + sport, including location (gym/court), start time, drop-in cost, and max player count
- **Search** for open sessions by sport and city — results show place, time, cost, and current attendees
- **Join/leave** scrimmages with live attendee counts and lists
- **Friend system** — send/accept friend requests, see your friends
- **In-event chat** — message other attendees inside a scrimmage's chat room
- **Friend from chat** — quick-add other users you meet in chat

### Out of scope (for now)

- Payment processing (drop-in costs are display-only, paid in person)
- Sport leagues / team registration
- Push notifications
- Geo-radius search (city-string match for v1; lat/lng radius later)

## Data model

Core entities and their relationships:

- **User** — `id`, `name`, `age`, `favorite_sport`, `bio`, `social_handles`, `city`
- **Scrimmage** — `id`, `sport`, `city`, `location`, `start_time`, `dropin_cost`, `max_players`, `created_by` (FK → User)
- **Attendance** — join entity (`user_id`, `scrimmage_id`) representing "user X is attending scrimmage Y"
- **Friendship** — self-referencing join on User (`user_id`, `friend_id`, `status`)
- **ChatMessage** — `id`, `scrimmage_id` (FK), `user_id` (FK), `content`, `timestamp`

Key relationships:

- User → Scrimmage: one-to-many (a user creates many scrimmages)
- User ↔ Scrimmage: many-to-many via Attendance
- User ↔ User: many-to-many via Friendship (self-referencing)
- Scrimmage → ChatMessage: one-to-many

## Architecture

Standard Spring Boot layered architecture:

```
Controller (REST endpoints, request/response shaping)
    ↓
Service (business logic, transaction boundaries)
    ↓
Repository (Spring Data JPA, database access)
    ↓
PostgreSQL
```

DTOs are used for all controller request/response bodies — entities are never serialized directly. This avoids JSON serialization issues with bidirectional relationships and keeps the API contract independent of the database schema.

## Project structure (backend)

```
src/main/java/com/recfinder/recfinder/
├── controller/        # REST controllers
├── service/           # Business logic
├── repository/        # JPA repositories
├── entity/            # JPA entities
├── dto/               # Request/response DTOs
├── config/            # Spring config (security, CORS, etc.)
├── security/          # JWT filter, UserDetailsService
└── exception/         # Custom exceptions + @ControllerAdvice
```

## Getting started

### Prerequisites

- JDK 26
- PostgreSQL 15+
- Node.js 20+
- Maven 3.9+ (or use the included Maven wrapper `./mvnw`)

### Backend setup

```bash
# Create the database
createdb recfinder

# Set DB credentials in src/main/resources/application.properties
# Then run:
cd backend
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`.

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Roadmap

Built in phases — each phase ships a vertical slice end-to-end.

- [ ] **Phase 0** — Project skeleton (Spring Boot + React + Postgres talking to each other)
- [ ] **Phase 1** — Domain modeling (entities + schema)
- [ ] **Phase 2** — Create + list scrimmages (no auth, hardcoded user)
- [ ] **Phase 3** — Real users + JWT authentication
- [ ] **Phase 4** — Search (sport + city, filter to open listings)
- [ ] **Phase 5** — Social features (friendships, attendee join/leave)
- [ ] **Phase 6** — Chat (WebSockets) + deployment

---

## Notes for AI assistants helping with this project

If you're an AI coding assistant (Claude Code, etc.) helping build RecFinder, please respect the following:

### Learning context

- I'm new to Spring Boot. I currently know basic annotations (`@GetMapping`, `@RestController`, `@RequestMapping`) and have working knowledge of REST APIs and PostgreSQL.
- **The goal of this project is to learn, not just ship features.** When I ask "how do I do X," prefer explanations that build my understanding over drop-in solutions.
- When introducing a new Spring concept (annotations, beans, JPA features, security filters), briefly explain the *why* before showing the *what*.
- If I'm about to use a pattern that's a common beginner mistake (exposing entities, field injection, eager fetching by default, etc.), call it out rather than silently doing the right thing.

### Build order

- **Stick to the current phase.** Don't pull features in from future phases unless I ask.
- Prefer working vertical slices over horizontal completeness. A janky-but-working end-to-end feature beats a polished controller with no UI.
- The current phase is tracked in the Roadmap above.

### Conventions

- **Architecture:** Standard Spring layered architecture: controller → service → repository.
- **DTOs:** Use DTOs for all controller request/response bodies. Never expose entities directly.
- **Injection:** Constructor injection only. No `@Autowired` on fields.
- **File organization:** One entity per file. One controller per resource.
- **Lombok:** Allowed (`@Data`, `@RequiredArgsConstructor`, `@Builder`, etc.).
- **Frontend:** Functional components + hooks. Tailwind classes inline (no separate CSS files unless necessary).
- **Naming:** Standard Spring/Java conventions. Repositories end in `Repository`, services in `Service`, controllers in `Controller`.

### Things to flag before doing

- Adding new dependencies — tell me what and why first.
- Schema changes after the initial design is set — call them out so I can think about migrations.
- Anything touching auth, security, or JWT — explain implications.
- Anything that would meaningfully change project structure or architecture.

### Things to avoid

- Don't add features I didn't ask for.
- Don't over-engineer. No premature abstraction, no unnecessary design patterns.
- Don't suggest enterprise patterns (Hexagonal Architecture, DDD, CQRS) for a learning-focused CRUD app.
- Don't paste massive blocks of code without explaining the key parts.

## License

TBD
