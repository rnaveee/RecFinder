# RecFinder Roadmap → Production v1

This roadmap takes RecFinder from its current state to a deployed, production-ready v1. It is organized by **system/track** so each area can be reasoned about independently, with the **build sequence** at the end showing the order.

> **Philosophy:** this is a learning project. Build **vertical slices** — a janky-but-working end-to-end feature beats a polished layer with no UI. Stay roughly in sequence; don't pull future work forward unless it unblocks the current slice.

**Legend:** `[ ]` not started · `[~]` in progress · `[x]` done

**Estimated remaining: ~43 hours** (as of 2026-06-23)

---

## 1. Foundation & Infrastructure ✅

All done. The plumbing every other track sits on.

- [x] First REST endpoint (`GET /api/ping`) returning a DTO
- [x] Global exception handling (`@RestControllerAdvice`) + consistent error response DTO
- [x] CORS configuration (React :5173 → API :8080)
- [x] Centralized config via `application.properties` / profiles (`dev`, `prod`)
- [x] Database connectivity — PostgreSQL 17 datasource (Hikari pool, `ddl-auto=validate`)
- [x] Schema management with **Flyway** (6 versioned migrations)
- [x] Health/readiness endpoints (Spring Boot Actuator — `/actuator/health`)

## 2. Backend Core / Domain Model ✅

All done. Entities and persistence.

- [x] `User` entity + repository (+ `user_sports` via `@ElementCollection`)
- [x] `Scrimmage` entity (`@ManyToOne` creator FK)
- [x] `Attendance` join entity (User ↔ Scrimmage, `UNIQUE` constraint)
- [x] `Friendship` self-referencing join (`@Enumerated(STRING)` status)
- [x] `ChatMessage` entity (scrimmage+sender FKs, indexed)
- [x] DTOs for every request/response (never serialize entities directly)
- [x] Mapping layer (entity ↔ DTO) — manual `@Component` mappers
- [x] Bean Validation (`@Valid`, `@NotNull`, `@Size`) on request DTOs

## 3. Authentication & Security

- [x] Spring Security baseline (lock down endpoints, permit public ones)
- [x] User registration (`POST /api/auth/register`) with BCrypt
- [x] Login issuing a **JWT** (`POST /api/auth/login`)
- [x] JWT filter + `UserDetailsService` to authenticate requests
- [x] "Current user" resolution (`@AuthenticationPrincipal`)
- [x] Authorization rules — `ForbiddenException` + handler, creator-only edit/delete on scrimmages
- [ ] Refresh-token / token-expiry strategy — **~2h**
- [ ] Rate limiting on auth endpoints — **~1h**

## 4. UI / Frontend

React (Vite) + TailwindCSS + React Router. Functional components + hooks.

- [x] Vite + Tailwind project scaffold, talking to the backend
- [x] API client layer — `api.js` wrapper with JWT header injection, all core endpoints wired
- [x] Auth UI — login, register, logout with redirect; `App.jsx` uses AuthContext
- [x] App shell: nav, layout, responsive baseline
- [x] Scrimmage **list/browse** page — fetches from real API with loading/error states, client-side filtering
- [x] Scrimmage **detail** page — fetches scrimmage + attendees, join/leave wired with live refresh
- [x] **Create scrimmage** form — posts to real API, navigates on success
- [x] Join/leave controls with live attendee count
- [x] User **profile** page — reads from AuthContext (edit button + friends count still TODO)
- [x] Friends UI — fetches friends + pending requests, accept/decline wired with optimistic removal
- [~] Chat UI — ChatPanel exists with local state + placeholder; no backend connection (Phase 9)
- [~] Loading/empty/error states — basic states on all wired pages; accessibility pass TODO

## 5. Scrimmages (Core Feature)

- [x] Create scrimmage (`POST /api/scrimmages`)
- [x] List scrimmages (`GET /api/scrimmages`)
- [x] Get scrimmage detail (`GET /api/scrimmages/{id}`)
- [x] Edit scrimmage (`PUT /api/scrimmages/{id}`) — creator-only authorization
- [x] Delete scrimmage (`DELETE /api/scrimmages/{id}`) — creator-only authorization
- [x] Edit/delete UI on detail page (creator only) + edit form page
- [x] Join scrimmage (`POST /api/scrimmages/{id}/attendees`) — respects `max_players` + prevents double-join
- [x] Leave scrimmage (`DELETE /api/scrimmages/{id}/attendees`)
- [x] Attendee list (`GET /api/scrimmages/{id}/attendees`)
- [x] Open-only filter — JPQL subquery excludes past + full scrimmages server-side

## 6. Search & Discovery

- [x] Filter by **sport + city** — backend JPQL + frontend wired with client-side filtering
- [x] "Open only" filter (not full, not in the past) — JPQL subquery, server-side
- [ ] Sorting (soonest start time, cheapest) — **~1h** *(deferred to post-v1 polish)*
- [ ] Pagination — **~2h**

## 7. Messaging System (Chat) — core only

In-event chat per scrimmage, real-time. Stretch goals (typing indicators, moderation, friend-from-chat) deferred to v2.

- [~] `ChatMessage` persistence — entity + migration + repository exist; **no service, no controller, no REST endpoint**
- [ ] `ChatMessage` service + REST history endpoint (`GET /api/scrimmages/{id}/messages`) — **~2h**
- [ ] WebSocket + **STOMP** config (`spring-boot-starter-websocket`) — **~2h**
- [ ] Per-scrimmage topic/room model (`/topic/scrimmage/{id}`) — **~2h**
- [ ] Send message over WS, broadcast to room, persist to DB — **~2h**
- [ ] Auth on the WS handshake (JWT) — **~1h**
- [ ] Frontend chat: connect, subscribe, render history + live messages, autoscroll — **~2h**

## 8. Social System (Friends)

- [x] Send friend request (`POST /api/friendships/{addresseeId}`)
- [x] Accept / decline request (backend + frontend wired)
- [x] Friends list (`GET /api/friendships`) — frontend wired with name resolution
- [x] Pending requests list (`GET /api/friendships/requests`) — new endpoint + frontend wired
- [x] Cancel pending request (`DELETE /api/friendships/{id}/withdraw`) — backend + frontend wired
- [x] Sent requests list (`GET /api/friendships/sent`) — shows outgoing pending requests
- [ ] Friendship status checks reused across UI — **~1h**

## 9. Production Readiness

What makes it deployable and trustworthy.

**Testing (backend only for v1)** — **~10h**
- [ ] Unit tests for service-layer business logic
- [ ] `@WebMvcTest` slice tests per controller
- [ ] Repository/integration tests with **Testcontainers** (real Postgres)

**Quality & DX** — **~3h**
- [ ] CI pipeline (build + test on push) — GitHub Actions
- [ ] Linting/formatting (Spotless/Checkstyle backend; ESLint/Prettier frontend)
- [ ] API documentation (OpenAPI / Swagger UI)

**Security hardening** — **~3h**
- [ ] Secrets via env vars / secret manager (nothing committed)
- [ ] HTTPS everywhere; secure cookie/JWT handling
- [ ] Fix `GlobalExceptionHandler` catch-all leaking `ex.getMessage()` for unexpected exceptions
- [ ] Input validation audit + sane error messages (no stack traces leaking)
- [ ] Fix `AttendanceService` race condition (concurrent joins can bypass `max_players`)

**Deployment** — **~6h**
- [ ] Containerize backend (Docker / Spring Boot OCI image)
- [ ] Managed Postgres provisioned (with backups)
- [ ] Frontend hosting (static build → CDN/host)
- [ ] Environment config for `prod`
- [ ] Custom domain + TLS
- [ ] Smoke test in prod; rollback plan

---

## Build sequence (vertical slices)

Each phase ships something usable end-to-end.

| Phase | What | Status | Est. hours |
|-------|------|--------|----------:|
| 0 | **Handshake** — `/api/ping` → React fetches → DB connected | ✅ | — |
| 1 | **Domain & migrations** — entities + Flyway schema | ✅ | — |
| 2 | **Scrimmages** — create + list + detail backend | ✅ | — |
| 3 | **Auth** — JWT, lock down endpoints, login/register UI | ✅ | — |
| 4 | **Search & join/leave** — sport+city filter, attendance | ✅ backend | — |
| 5 | **Social** — friend requests + friends list | ✅ backend | — |
| 6 | **Frontend integration** — wire ALL pages to real APIs, logout | ✅ | — |
| **7** | **Backend completion** — edit/cancel scrimmage, authorization rules, search improvements, social completion | [~] **← YOU ARE HERE** | **3h remaining** |
| **7.5** | **View other profiles** — `GET /api/users/{id}`, public profile page, link from attendees | [ ] | **2h** |
| **8** | **Auth hardening** — refresh tokens, rate limiting | [ ] | **3h** |
| **9** | **Messaging** — WebSocket/STOMP chat per scrimmage (core only) | [ ] | **11h** |
| **10** | **Testing** — service, controller, repository tests | [ ] | **10h** |
| **11** | **Ship it** — CI, security hardening, Docker, deploy | [ ] | **12h** |

**Buffer for debugging/learning:** ~7h → **Total: ~43h**

---

## Deferred to v2

These are scoped out of v1 to keep the timeline tight. Good interview talking points as "planned next steps."

- **Map & Location** — geocoding, Leaflet map view, near-me, geo-radius search (city-string search is sufficient for v1)
- **Notifications** — in-app notification list, unread badges, email alerts
- **Chat stretch** — typing indicators, presence, message moderation, friend-from-chat quick-add
- **Frontend tests** — Playwright e2e, component tests (backend tests cover the critical logic for v1)
- **Block user** — safety feature, worth scoping for v2
- **Observability** — structured logging, correlation IDs, Sentry error tracking
- **Full-text search** — fuzzy search on location names

---

## Definition of "v1 production ready"

A stranger in your city can:
1. Register and log in securely.
2. Find open pickup sessions by sport + city.
3. Create their own scrimmage and have others find it.
4. Join/leave sessions and see who else is attending.
5. Chat with attendees in real time.

…running on a deployed, HTTPS stack with backend tests, CI, and backups — without you babysitting it.
