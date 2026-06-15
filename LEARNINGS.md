# RecFinder — Spring Boot Learning Notes
### Phase 0 → Phase 3

---

## The Big Picture

Spring Boot is a framework for building web servers in Java. When someone sends an HTTP request to your app, Spring Boot handles routing it to the right code, running your logic, and sending back a response.

The architecture we follow is layered — each layer has one job:

```
HTTP Request
     ↓
Controller       ← receives the request, validates input, sends response
     ↓
Service          ← business logic (the rules of your app)
     ↓
Repository       ← talks to the database
     ↓
Database
```

Nothing skips a layer. The controller never talks to the repository. The repository never has business logic. This separation makes the code easier to test, read, and change.

---

## Phase 0 — Project Skeleton

### What Spring Boot actually does

Before Spring Boot, wiring a Java web server was hundreds of lines of XML config. Spring Boot's key idea is **auto-configuration** — it looks at what's on your classpath and configures things automatically. Add a database driver → it creates a connection pool. Add a web dependency → it starts Tomcat.

### @SpringBootApplication

```java
@SpringBootApplication
public class RecFinderApplication {
    public static void main(String[] args) {
        SpringApplication.run(RecFinderApplication.class, args);
    }
}
```

This one annotation is actually three annotations in one:
- `@Configuration` — this class can define beans
- `@EnableAutoConfiguration` — let Spring Boot configure things automatically
- `@ComponentScan` — scan this package for classes to manage (`@Service`, `@Controller`, etc.)

### Maven & pom.xml

Maven is the build tool. `pom.xml` is its config file. The key things in it:

- **parent** — inherits sensible defaults from Spring Boot (dependency versions, plugin config)
- **dependencies** — libraries your app needs. Each one gets downloaded and added to your classpath
- **plugins** — tools that run during the build (compiler, Spring Boot runner)

### application.properties & profiles

`application.properties` is where you configure the app (DB URL, ports, logging). You don't hardcode these in Java.

Profiles let you have different configs for different environments:
- `application.properties` — shared settings
- `application-dev.properties` — overrides for local development
- `application-prod.properties` — overrides for production

`spring.profiles.active=dev` in the base file means dev settings are loaded by default. In production you override this with an environment variable.

### Spring Beans

A **bean** is just an object that Spring creates and manages for you. Instead of calling `new UserService()` yourself, you annotate the class with `@Service` (or `@Component`, `@Repository`, `@Controller`) and Spring creates one instance and makes it available everywhere.

This is called the **IoC container** (Inversion of Control) — you don't control object creation, Spring does.

---

## Phase 1 — Domain Modeling

### JPA & Entities

JPA (Java Persistence API) is the standard for mapping Java objects to database tables. Hibernate is the implementation Spring uses.

An `@Entity` class maps to a database table. Each field maps to a column.

```java
@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;           // maps to the primary key, auto-incremented by the DB

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;  // field name != column name, so we map it explicitly
}
```

Key annotations:
- `@Entity` — this class is a DB table
- `@Table(name = "...")` — specify the table name (defaults to class name if omitted)
- `@Id` — this field is the primary key
- `@GeneratedValue` — the DB generates this value (auto-increment)
- `@Column` — customize the column (name, nullability, uniqueness)

### Relationships

```java
// Many attendances belong to one scrimmage
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "scrimmage_id")
private Scrimmage scrimmage;
```

- `@ManyToOne` — many rows on this side relate to one row on the other
- `@OneToMany` — one row here relates to many rows on the other side
- `FetchType.LAZY` — don't load the related object from the DB until you actually access it (default and preferred)
- `@JoinColumn` — the foreign key column name

### Lombok

Lombok generates boilerplate code at compile time via annotations so you don't have to write it.

```java
@Getter          // generates getX() for every field
@Setter          // generates setX() for every field
@NoArgsConstructor  // generates public User() {}
@RequiredArgsConstructor  // generates constructor for all final fields
@Builder         // generates a builder pattern
@Data            // shorthand for @Getter + @Setter + @ToString + @EqualsAndHashCode
```

Without Lombok you'd write hundreds of lines of getters/setters by hand.

### Flyway — Database Migrations

Flyway manages your database schema changes through versioned SQL files. On startup, it runs any migrations that haven't been applied yet, in order.

Files live in `src/main/resources/db/migration/` and must follow the naming pattern:
```
V1__create_users_table.sql
V2__create_scrimmages_table.sql
V6__add_auth_fields_to_users.sql
```

**Why this matters:** if you just let Hibernate create/alter your tables (`ddl-auto=create`), you lose control of your schema in production. Migrations give you an auditable history of every change and let you safely evolve the schema without destroying data.

We use `ddl-auto=validate` — Hibernate checks that your `@Entity` classes match the existing tables, and crashes loudly if they drift apart. Flyway owns schema changes. Hibernate just validates.

### Repositories

Spring Data JPA generates the SQL for you. You declare an interface, it provides the implementation.

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);  // Spring generates: SELECT * FROM users WHERE email = ?
}
```

`JpaRepository<User, Long>` gives you `findById()`, `findAll()`, `save()`, `delete()`, and more for free. For custom queries, you just name the method following the convention — Spring figures out the SQL.

---

## Phase 2 — REST API

### DTOs — Never Expose Entities

A **DTO** (Data Transfer Object) is a simple class that represents what goes in/out of your API. You never serialize a JPA entity directly for two reasons:

1. **Bidirectional relationships cause infinite JSON loops** — User has scrimmages, Scrimmage has a User, which has scrimmages...
2. **The API contract should be independent of the DB schema** — your table structure might change, but your API response shouldn't

```java
// Entity (internal — never leave the service layer)
User { id, name, email, passwordHash, sports, ... }

// Response DTO (what the client sees)
UserResponse { id, name, email }   // no password hash, no lazy-loaded collections
```

We use Java `record`s for DTOs. Records are immutable data carriers — just fields and a constructor, no boilerplate needed.

```java
public record CreateScrimmageRequest(
    @NotBlank String sport,
    @NotBlank String city,
    @NotNull @Future Instant startTime,
    @NotNull @Min(2) Integer maxPlayers
) {}
```

### Bean Validation

Annotate your DTO fields with constraints. Add `@Valid` in the controller. Spring rejects invalid input with a 400 before it ever reaches your service.

```java
@NotBlank        // not null, not empty string
@NotNull         // not null (works on non-strings too)
@Size(min=8)     // string length
@Min(2)          // number minimum
@Email           // valid email format
@Future          // date must be in the future
@PositiveOrZero  // number >= 0
```

### Controllers

```java
@RestController                    // marks this as a REST controller — returns JSON, not HTML
@RequestMapping("/api/scrimmages") // base path for all methods in this class
public class ScrimmageController {

    private final ScrimmageService scrimmageService;

    public ScrimmageController(ScrimmageService scrimmageService) {
        this.scrimmageService = scrimmageService;  // constructor injection
    }

    @PostMapping                   // handles POST /api/scrimmages
    public ResponseEntity<ScrimmageResponse> create(
            @Valid @RequestBody CreateScrimmageRequest request) {
        ScrimmageResponse created = scrimmageService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")           // handles GET /api/scrimmages/{id}
    public ScrimmageResponse findById(@PathVariable Long id) {
        return scrimmageService.findById(id);
    }
}
```

- `@RestController` — combines `@Controller` + `@ResponseBody`. Every method returns data serialized as JSON.
- `@RequestBody` — deserialize the JSON request body into a Java object
- `@PathVariable` — extract a value from the URL path (`/scrimmages/42` → `id = 42`)
- `@Valid` — run Bean Validation on the annotated object before the method executes
- `ResponseEntity<T>` — lets you control the HTTP status code. Bare return type defaults to 200.

### Services & @Transactional

The service layer holds business logic. It's where rules live: "you can't join a scrimmage that's full," "you can't join the same scrimmage twice."

```java
@Service
public class AttendanceService {

    @Transactional
    public AttendanceResponse join(Long scrimmageId, JoinScrimmageRequest request) {
        // multiple DB operations — if any fail, all are rolled back
        Scrimmage scrimmage = scrimmageRepository.findById(scrimmageId)...
        User user = userRepository.findById(request.userId())...

        if (attendanceRepository.existsByScrimmageIdAndUserId(...)) {
            throw new ConflictException("Already joined");
        }
        // save attendance
    }

    @Transactional(readOnly = true)   // optimization for reads — no rollback overhead
    public List<AttendanceResponse> listAttendees(Long scrimmageId) { ... }
}
```

`@Transactional` wraps the method in a database transaction. If anything throws an exception, every DB change in that method is rolled back. `readOnly = true` is an optimization hint for read-only operations.

### Constructor Injection

Three ways to inject dependencies. We only use constructor injection.

```java
// BAD — field injection
@Autowired
private UserRepository userRepository;  // can't be final, hard to test

// GOOD — constructor injection
private final UserRepository userRepository;  // final = can never be reassigned

public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
}
```

Why constructor injection:
- Fields can be `final` — immutable after construction
- Class is testable without starting Spring (just call `new UserService(mockRepo)`)
- If a class needs 8 dependencies, that's visible — it's a code smell that the class does too much

Spring automatically wires a single-constructor class — no `@Autowired` needed.

### Exception Handling

`@RestControllerAdvice` is a global exception handler. Instead of try/catch in every controller, you define handlers once and Spring applies them everywhere.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(NotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(404).body(new ApiError(404, ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(...) {
        return ResponseEntity.status(401).body(...);  // wrong password → 401
    }
}
```

Common HTTP status codes and when to use them:
- `200 OK` — successful GET
- `201 Created` — successful POST that created something
- `204 No Content` — successful DELETE (nothing to return)
- `400 Bad Request` — client sent invalid input
- `401 Unauthorized` — not logged in
- `403 Forbidden` — logged in but not allowed
- `404 Not Found` — resource doesn't exist
- `409 Conflict` — request conflicts with current state (already joined, game full)
- `500 Internal Server Error` — something broke on the server

---

## Phase 3 — JWT Authentication

### How Spring Security Works

Spring Security is a **filter chain**. Every HTTP request passes through a series of filters before reaching your controller. The most important one we wrote is `JwtAuthFilter`.

```
HTTP Request
     ↓
JwtAuthFilter        ← reads the token, validates it, sets "who is this user"
     ↓
SecurityConfig rules ← is this endpoint public? is the user allowed?
     ↓
Controller
```

Without Spring Security, all endpoints are wide open. The moment you add it to your classpath, everything is locked by default. `SecurityConfig` is where you declare the exceptions.

### Passwords — BCrypt

Never store passwords as plaintext. BCrypt is a hashing algorithm designed specifically for passwords.

```
"password123"  →  BCrypt  →  "$2a$10$N9qo8uLOickgx2ZMRZoM..."
```

- The hash is one-way — you can't reverse it to get the original password
- BCrypt is deliberately slow — makes brute-force attacks expensive
- Every hash is unique (salted) — same password hashes differently each time

On login, Spring calls `BCrypt.matches(rawPassword, storedHash)` — it hashes the input and compares. You never decrypt.

### JWT — JSON Web Token

A JWT is a signed token that proves identity without a server-side session.

```
Header.Payload.Signature

eyJhbGci...  .  eyJzdWIi...  .  Imao4TH...
(algorithm)     (data)           (signature)
```

The **payload** contains: who the user is (`sub: email`), when the token was issued, when it expires. The **signature** is generated with your secret key — no one can forge a valid token without it.

The flow:
1. User logs in with correct password
2. Server creates a JWT signed with its secret key, returns it
3. Client stores the token and sends it in every request: `Authorization: Bearer <token>`
4. Server validates the signature and expiry on every request
5. No session stored on the server — the token IS the credential (stateless)

### UserDetails — The Bridge

Spring Security doesn't know your `User` entity. It works with a `UserDetails` interface. `AppUserDetails` is the adapter that bridges the two.

```java
public class AppUserDetails implements UserDetails {
    private final User user;   // your entity, wrapped

    public AppUserDetails(User user) { this.user = user; }

    @Override public String getUsername() { return user.getEmail(); }
    @Override public String getPassword() { return user.getPasswordHash(); }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }
    // 4 boolean methods default to true in Spring Security 6
}
```

Your entity → your adapter → Spring's interface. This pattern (adapter) appears constantly in software.

### UserDetailsService

Spring calls this when it needs to authenticate someone. You implement one method:

```java
@Service
public class AppUserDetailsService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user: " + email));
        return new AppUserDetails(user);
    }
}
```

### The JwtAuthFilter

Runs on every request. Reads the `Authorization` header, validates the token, and tells Spring who this user is.

```java
@Override
protected void doFilterInternal(HttpServletRequest request, ...) {
    String authHeader = request.getHeader("Authorization");

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);  // no token — pass through (SecurityConfig decides)
        return;
    }

    String token = authHeader.substring(7);  // strip "Bearer "

    if (jwtUtil.isValid(token)) {
        String email = jwtUtil.extractEmail(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        // tell Spring "this request is authenticated as this user"
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())
        );
    }

    filterChain.doFilter(request, response);  // continue to next filter/controller
}
```

### SecurityConfig — Declaring the Rules

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(AbstractHttpConfigurer::disable)        // CSRF protection is for browser sessions — we're stateless
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  // no sessions
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()              // register/login — public
            .requestMatchers(HttpMethod.GET, "/api/scrimmages/**").permitAll()  // browsing — public
            .anyRequest().authenticated()                            // everything else — needs JWT
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)  // add our filter
        .build();
}
```

### Reading Stack Traces

Spring errors are deeply nested — the top of the trace is always the symptom, not the cause. Always scroll to the very bottom.

```
Unable to start web server               ← symptom (useless)
  Unable to start embedded Tomcat        ← still symptom
    Error creating bean 'jwtAuthFilter'  ← getting closer
      Error creating bean 'userRepository' ← closer
        Cannot connect to database       ← ROOT CAUSE
```

Once you find the root cause, that's the one you fix. Everything above it is just dominos falling.

---

## API Reference

| Method | Endpoint | Auth | What it does |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account, returns JWT |
| POST | `/api/auth/login` | No | Verify credentials, returns JWT |
| POST | `/api/scrimmages` | Yes | Create a scrimmage |
| GET | `/api/scrimmages` | No | List all scrimmages |
| GET | `/api/scrimmages/{id}` | No | Get one scrimmage |
| POST | `/api/scrimmages/{id}/attendees` | Yes | Join a scrimmage |
| GET | `/api/scrimmages/{id}/attendees` | No | List attendees |
| DELETE | `/api/scrimmages/{id}/attendees/{userId}` | Yes | Leave a scrimmage |
| GET | `/api/users` | Yes | List all users |

---

## What's Next — Phase 4

Search: filter scrimmages by sport and city. Small lift — just a custom repository method and a query parameter on the GET endpoint.
