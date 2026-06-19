# RecFinder Roadmap → Production v1

This roadmap takes RecFinder from its current state (a bare Spring Boot skeleton) to a deployed, production-ready v1. It is organized by **system/track** so each area can be reasoned about independently, with a suggested **build sequence** at the end that weaves the tracks into shippable vertical slices.

> **Philosophy** (carried over from the README): this is a learning project. Build **vertical slices** — a janky-but-working end-to-end feature beats a polished layer with no UI. Stay roughly in sequence; don't pull future work forward unless it unblocks the current slice.

**Legend:** `[ ]` not started · `[~]` in progress · `[x]` done

---

## 0. Current state (Start)

- [x] Spring Boot 4.0.6 + Java 26 skeleton builds and boots
- [x] `contextLoads` smoke test passes
- [x] README documents intended design, data model, and conventions
- [ ] Everything below

---

## 1. Foundation & Infrastructure

The plumbing every other track sits on.

- [x] First REST endpoint (`GET /api/ping`) returning a DTO — proves the request lifecycle
- [x] Global exception handling (`@RestControllerAdvice`) + consistent error response DTO
- [x] CORS configuration (so the React dev server on :5173 can call the API on :8080)
- [x] Centralized config via `application.properties` / profiles (`dev`, `prod`)
- [x] Database connectivity — PostgreSQL 17 datasource (Hikari pool, `ddl-auto=validate`)
- [x] Schema management with **Flyway** (needs `spring-boot-flyway` autoconfig module in Boot 4; first `V1__*.sql` arrives with the first entity)
- [x] Repository/monorepo layout decision — **flat** (backend at repo root); restructure to `backend/` + `frontend/` when React is added
- [x] Health/readiness endpoints (Spring Boot Actuator — `/actuator/health` reports `db: UP`)

## 2. Backend Core / Domain Model

The entities and persistence described in the README.

- [x] `User` entity + repository (+ `user_sports` collection table via `@ElementCollection`, `V1__create_users_table.sql`)
- [x] `Scrimmage` entity (sport, city, location, start time, drop-in cost, max players, creator FK — first `@ManyToOne`, `V2__create_scrimmages_table.sql`)
- [x] `Attendance` join entity (User ↔ Scrimmage, two `@ManyToOne` + `UNIQUE(user_id, scrimmage_id)`, `V3__create_attendances_table.sql`)
- [x] `Friendship` self-referencing join (User ↔ User, `requester`/`addressee` + `@Enumerated(STRING)` status, `V4__create_friendships_table.sql`)
- [x] `ChatMessage` entity (Scrimmage → messages; `scrimmage`+`sender` FKs, indexed `(scrimmage_id, sent_at)`, `V5__create_chat_messages_table.sql`)
- [x] DTOs for every request/response (never serialize entities directly) — `User` slice: `CreateUserRequest` / `UserResponse`
- [x] Mapping layer (entity ↔ DTO) — manual `UserMapper` (`@Component`); materializes lazy `sports` inside the tx to dodge `LazyInitializationException`
- [x] Bean Validation (`@Valid`, `@NotNull`, `@Size`, etc.) on request DTOs — `@Valid` wired in `UserController`; validation failures → 400 via `GlobalExceptionHandler`

## 3. Authentication & Security

- [x] Spring Security baseline (lock down endpoints, permit public ones)
- [x] User registration (`POST /api/auth/register`) with password hashing (BCrypt)
- [x] Login issuing a **JWT** (`POST /api/auth/login`)
- [x] JWT filter + `UserDetailsService` to authenticate requests
- [x] "Current user" resolution (`@AuthenticationPrincipal`) so endpoints act as the logged-in user — `GET /api/users/me`, scrimmage + attendance endpoints use principal
- [ ] Authorization rules (e.g. only the creator can edit/cancel a scrimmage)
- [ ] Refresh-token / token-expiry strategy
- [ ] Rate limiting on auth endpoints (production hardening)

## 4. UI / Frontend

React (Vite) + TailwindCSS + React Router. Functional components + hooks.

- [x] Vite + Tailwind project scaffold, talking to the backend (Phase 0 handshake)
- [ ] API client layer (fetch/axios wrapper, base URL, error handling)
- [ ] Auth UI: register, login, logout; store + attach JWT; protected routes
- [x] App shell: nav, layout, responsive baseline
- [x] Scrimmage **list/browse** page (filter by sport + city)
- [x] Scrimmage **detail** page (location, time, cost, attendees)
- [x] **Create scrimmage** form (with validation feedback)
- [ ] Join/leave controls with live attendee count
- [x] User **profile** pages (view + edit)
- [x] Friends UI (requests, accept, list)
- [ ] Chat UI (see Messaging track)
- [ ] Loading/empty/error states + basic accessibility pass
- [ ] Design polish: consistent components, mobile-first

## 5. Scrimmages (Core Feature)

The heart of the app — the first real end-to-end value.

- [x] Create scrimmage (`POST /api/scrimmages`) — creator resolved from `@AuthenticationPrincipal`
- [x] List scrimmages (`GET /api/scrimmages`)
- [x] Get scrimmage detail (`GET /api/scrimmages/{id}`, 404 if missing)
- [ ] Edit / cancel scrimmage (creator only)
- [x] Join scrimmage (`POST /api/scrimmages/{id}/attendees`) — respects `max_players` (409) + prevents double-join (409); user from JWT principal
- [x] Leave scrimmage (`DELETE /api/scrimmages/{id}/attendees`, 204; 404 if not joined) — user from JWT principal
- [x] Attendee list (`GET /api/scrimmages/{id}/attendees`) — count available; live UI count is Phase 4 frontend
- [ ] Past vs upcoming filtering

## 6. Search & Discovery

- [ ] Filter open sessions by **sport + city** (string match for v1)
- [ ] "Open only" filter (not full, not in the past)
- [ ] Sorting (soonest start time, nearest, cheapest)
- [ ] Pagination
- [ ] (Stretch) Full-text / fuzzy search on location names

## 7. Messaging System (Chat)

In-event chat per scrimmage, real-time.

- [ ] `ChatMessage` persistence + REST history endpoint (`GET /api/scrimmages/{id}/messages`)
- [ ] WebSocket + **STOMP** config (`spring-boot-starter-websocket`)
- [ ] Per-scrimmage topic/room model (`/topic/scrimmage/{id}`)
- [ ] Send message over WS, broadcast to room, persist to DB
- [ ] Auth on the WS handshake (JWT) so only attendees can post/read
- [ ] Frontend chat: connect, subscribe, render history + live messages, autoscroll
- [ ] "Friend from chat" — quick-add a user you meet in a room
- [ ] Presence / typing indicators (stretch)
- [ ] Message moderation basics: length limits, profanity filter (stretch)

## 8. Social System (Friends)

- [x] Send friend request (`POST /api/friendships/{addresseeId}`) — prevents self-request + duplicate
- [x] Accept / decline request (`PUT /api/friendships/{id}/accept`, `PUT /api/friendships/{id}/decline`) — only addressee can accept/decline, must be PENDING
- [x] Friends list (`GET /api/friendships`) — returns all ACCEPTED friendships
- [ ] Cancel pending request (requester withdraws)
- [ ] Friendship status checks reused across UI (profile, chat, attendee list)
- [ ] Block user (stretch, but worth scoping for safety)

## 9. Map & Location System

README scopes v1 as **city-string matching**, with geo as the upgrade path. This track makes location first-class.

- [ ] Decide location model: free-text vs structured (place name + address + lat/lng)
- [ ] Geocoding on scrimmage create (address → lat/lng via a maps API)
- [ ] Store coordinates on `Scrimmage`
- [ ] **Map view** of scrimmages (Leaflet/MapLibre + OpenStreetMap, or Google Maps)
- [ ] Pins → scrimmage detail; cluster when dense
- [ ] "Near me" using browser geolocation
- [ ] Geo-radius search (lat/lng + distance) replacing/augmenting city-string filter
- [ ] Map/list toggle on the browse page
- [ ] API key management + usage limits for the maps provider (cost control)

## 10. Notifications (Lightweight for v1)

Push is out of scope per README; keep this minimal.

- [ ] In-app notification list (new friend request, someone joined your scrimmage, new chat)
- [ ] Unread badge/count
- [ ] (Stretch) Email notifications for key events
- [ ] (Out of scope v1) Web/mobile push

## 11. Production Readiness

What makes it deployable and trustworthy, not just feature-complete.

**Testing**
- [ ] Unit tests for service-layer business logic
- [ ] `@WebMvcTest` slice tests per controller
- [ ] Repository/integration tests with **Testcontainers** (real Postgres)
- [ ] Frontend component tests + a couple of end-to-end happy paths (Playwright)

**Quality & DX**
- [ ] CI pipeline (build + test on push) — GitHub Actions
- [ ] Linting/formatting (Spotless/Checkstyle backend; ESLint/Prettier frontend)
- [ ] API documentation (OpenAPI / Swagger UI)

**Observability**
- [ ] Structured logging + correlation IDs
- [ ] Actuator metrics; error tracking (Sentry or similar)

**Security hardening**
- [ ] Secrets via env vars / secret manager (nothing committed)
- [ ] HTTPS everywhere; secure cookie/JWT handling
- [ ] Input validation + sane error messages (no stack traces leaking)
- [ ] Dependency vulnerability scanning

**Deployment**
- [ ] Containerize backend (Docker / Spring Boot OCI image)
- [ ] Managed Postgres provisioned (with backups)
- [ ] Frontend hosting (static build → CDN/host)
- [ ] Environment config for `prod`
- [ ] Custom domain + TLS
- [ ] Smoke test in prod; rollback plan

---

## Suggested build sequence (vertical slices)

The tracks above are the *what*; this is the *order*. Each phase ships something usable end-to-end.

- **Phase 0 — Handshake:** `/api/ping` → React app fetches it → DB connected (Foundation §1). ✅
- **Phase 1 — Domain & migrations:** entities + Flyway schema (§2). ✅
- **Phase 2 — Scrimmages, no auth:** create + list + detail, hardcoded user, minimal UI (§5, §4). ✅ (backend; no UI yet)
- **Phase 3 — Auth:** real users + JWT, lock down endpoints, login/register UI (§3, §4). ✅ (backend; no UI yet — authorization rules remaining)
- **Phase 4 — Search & join/leave:** filter by sport+city, attendance with limits (§6, §5, §8). [~] (basic sport+city search done; pagination/sorting/open-only TODO)
- **Phase 5 — Social:** friend requests + friends list + profiles (§8, §4). [~] (backend done; no UI yet — cancel request TODO)
- **Phase 6 — Messaging:** WebSocket chat per scrimmage + friend-from-chat (§7).
- **Phase 7 — Map:** geocoding, coordinates, map view, near-me / radius search (§9).
- **Phase 8 — Notifications:** in-app notifications + unread counts (§10).
- **Phase 9 — Production:** tests, CI, observability, hardening, deploy (§11).

---

## Definition of "v1 production ready"

A stranger in your city can:
1. Register and log in securely.
2. Find open pickup sessions near them (by sport + city, on a map).
3. Create their own scrimmage and have others find it.
4. Join/leave sessions and see who else is attending.
5. Chat with attendees in real time and add them as friends.

…running on a deployed, HTTPS, monitored stack with automated tests and backups — without you babysitting it.
