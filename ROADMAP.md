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
- [~] Centralized config via `application.properties` / profiles (`dev`, `prod`)
- [ ] Database connectivity — PostgreSQL datasource (or H2 to start, swap later)
- [ ] Schema management with **Flyway** (versioned migrations instead of `ddl-auto`)
- [ ] Repository/monorepo layout decision (backend at root vs `backend/` + `frontend/`)
- [ ] Health/readiness endpoints (Spring Boot Actuator)

## 2. Backend Core / Domain Model

The entities and persistence described in the README.

- [ ] `User` entity + repository
- [ ] `Scrimmage` entity (sport, city, location, start time, drop-in cost, max players, creator FK)
- [ ] `Attendance` join entity (User ↔ Scrimmage, many-to-many)
- [ ] `Friendship` self-referencing join (User ↔ User, with status)
- [ ] `ChatMessage` entity (Scrimmage → messages)
- [ ] DTOs for every request/response (never serialize entities directly)
- [ ] Mapping layer (entity ↔ DTO) — manual mappers first, MapStruct only if it earns its keep
- [ ] Bean Validation (`@Valid`, `@NotNull`, `@Size`, etc.) on request DTOs

## 3. Authentication & Security

- [ ] Spring Security baseline (lock down endpoints, permit public ones)
- [ ] User registration (`POST /api/auth/register`) with password hashing (BCrypt)
- [ ] Login issuing a **JWT** (`POST /api/auth/login`)
- [ ] JWT filter + `UserDetailsService` to authenticate requests
- [ ] "Current user" resolution (`@AuthenticationPrincipal`) so endpoints act as the logged-in user
- [ ] Authorization rules (e.g. only the creator can edit/cancel a scrimmage)
- [ ] Refresh-token / token-expiry strategy
- [ ] Rate limiting on auth endpoints (production hardening)

## 4. UI / Frontend

React (Vite) + TailwindCSS + React Router. Functional components + hooks.

- [ ] Vite + Tailwind project scaffold, talking to the backend (Phase 0 handshake)
- [ ] API client layer (fetch/axios wrapper, base URL, error handling)
- [ ] Auth UI: register, login, logout; store + attach JWT; protected routes
- [ ] App shell: nav, layout, responsive baseline
- [ ] Scrimmage **list/browse** page (filter by sport + city)
- [ ] Scrimmage **detail** page (location, time, cost, attendees)
- [ ] **Create scrimmage** form (with validation feedback)
- [ ] Join/leave controls with live attendee count
- [ ] User **profile** pages (view + edit)
- [ ] Friends UI (requests, accept, list)
- [ ] Chat UI (see Messaging track)
- [ ] Loading/empty/error states + basic accessibility pass
- [ ] Design polish: consistent components, mobile-first

## 5. Scrimmages (Core Feature)

The heart of the app — the first real end-to-end value.

- [ ] Create scrimmage (auth required, creator = current user)
- [ ] List scrimmages
- [ ] Get scrimmage detail (with attendees)
- [ ] Edit / cancel scrimmage (creator only)
- [ ] Join scrimmage (respect `max_players`, prevent double-join)
- [ ] Leave scrimmage
- [ ] Attendee list + live count
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

- [ ] Send friend request
- [ ] Accept / decline / cancel request
- [ ] Friends list
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

- **Phase 0 — Handshake:** `/api/ping` → React app fetches it → DB connected (Foundation §1). *You are here.*
- **Phase 1 — Domain & migrations:** entities + Flyway schema (§2).
- **Phase 2 — Scrimmages, no auth:** create + list + detail, hardcoded user, minimal UI (§5, §4).
- **Phase 3 — Auth:** real users + JWT, lock down endpoints, login/register UI (§3, §4).
- **Phase 4 — Search & join/leave:** filter by sport+city, attendance with limits (§6, §5, §8).
- **Phase 5 — Social:** friend requests + friends list + profiles (§8, §4).
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
