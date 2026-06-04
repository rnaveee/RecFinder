# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

RecFinder is a web app for finding/creating local drop-in sports (pickup games, open gyms). It is a **learning-focused portfolio project** built incrementally to learn Spring Boot end-to-end.

**The repo is currently a bare Spring Boot skeleton (Roadmap Phase 0).** The only Java code is `RecFinderApplication` (the `@SpringBootApplication` entrypoint) and a `contextLoads` smoke test. None of the domain (entities, controllers, services, repositories, auth, chat, frontend) described in the README exists yet — that README documents the *intended* design, not current code.

## README vs. actual code — known discrepancies

The README is aspirational and drifts from the real project setup. Trust `pom.xml` / actual files over the README for these:

- **Java version:** `pom.xml` targets Java **26** (`<java.version>26</java.version>`); README says 21.
- **Spring Boot:** parent is **4.0.6**; README says "3.x".
- **Dependencies present:** only `spring-boot-starter-webmvc` (+ test). JPA, Spring Security/JWT, WebSocket/STOMP, and the PostgreSQL driver in the README are **not yet added** to `pom.xml`.
- **Base package:** actual code lives in `com.recfinder.recfinder`; README diagrams show `com.recfinder`.
- **No frontend** exists yet (no `frontend/` dir), despite README's React/Vite instructions.

When adding any of the above, treat it as a real dependency/structure change and flag it per the conventions below.

## Commands

Use the Maven wrapper. On this Windows machine use `mvnw.cmd`:

```powershell
.\mvnw.cmd spring-boot:run        # run the app (port 8080)
.\mvnw.cmd test                   # run all tests
.\mvnw.cmd clean package          # build the jar
.\mvnw.cmd test -Dtest=RecFinderApplicationTests#contextLoads   # run a single test method
```

(Use `./mvnw` for the POSIX equivalent via the Bash tool.)

## Working conventions (from the project owner)

This is a **learning project** — the owner is new to Spring Boot. These constraints come from the README's "Notes for AI assistants" section and are binding:

- **Teach, don't just ship.** When introducing a new Spring concept (annotation, bean, JPA feature, security filter), explain the *why* before the *what*. Call out common beginner mistakes rather than silently fixing them.
- **Stay in the current Roadmap phase** (tracked in README). Don't pull in features from later phases unless asked. Prefer working vertical slices over horizontal completeness.
- **Architecture:** standard layered Spring — controller → service → repository → DB.
- **DTOs for all controller request/response bodies.** Never serialize JPA entities directly.
- **Constructor injection only** — no `@Autowired` on fields.
- **One entity per file, one controller per resource.** Repositories end in `Repository`, services in `Service`, controllers in `Controller`.
- **Lombok is allowed** (`@Data`, `@RequiredArgsConstructor`, `@Builder`, etc.).
- **Flag before doing:** new dependencies (say what + why), schema changes after initial design, anything touching auth/security/JWT, anything that meaningfully changes structure or architecture.
- **Avoid:** unrequested features, premature abstraction, enterprise patterns (Hexagonal/DDD/CQRS) for this CRUD learning app, dumping large code blocks without explaining the key parts.