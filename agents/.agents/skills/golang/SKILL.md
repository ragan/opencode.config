---
name: golang
description: "Golang code style conventions and production-ready testing — line length and breaking, variable declarations, control flow clarity, table-driven tests, testify suites and mocks, parallel tests, fuzzing, fixtures, goroutine leak detection with goleak, snapshot testing, code coverage, integration tests. Use when writing, reviewing, or testing Go code, or establishing project coding standards. Not for naming conventions (→ See `samber/cc-skills-golang@golang-naming` skill), linter configuration (→ See `samber/cc-skills-golang@golang-lint` skill), or doc comments (→ See `samber/cc-skills-golang@golang-documentation` skill)."
user-invocable: true
license: MIT
compatibility: Designed for Claude Code or similar AI coding agents, and for projects using Golang.
metadata:
  author: samber
  version: "2.0.0"
  openclaw:
    emoji: "🧑‍💻"
    homepage: https://github.com/samber/cc-skills-golang
    requires:
      bins:
        - go
        - gotests
    install:
      - kind: go
        package: github.com/cweill/gotests/gotests@latest
        bins: [gotests]
allowed-tools: Read Edit Write Glob Grep Bash(go:*) Bash(golangci-lint:*) Bash(git:*) Agent Bash(gotests:*) AskUserQuestion
---

> **Community default.** A company skill that explicitly supersedes `samber/cc-skills-golang@golang-code-style` or `samber/cc-skills-golang@golang-testing` skill takes precedence.

# Go Code Style & Testing

This skill combines code style conventions and testing best practices for Go. For naming see `samber/cc-skills-golang@golang-naming` skill; for design patterns see `samber/cc-skills-golang@golang-design-patterns` skill; for struct/interface design see `samber/cc-skills-golang@golang-structs-interfaces` skill.

> "Clear is better than clever." — Go Proverbs

When ignoring a rule, add a comment to the code.

---

# Part 1: Code Style

## Line Length & Breaking

No rigid line limit, but lines beyond ~120 characters MUST be broken. Break at **semantic boundaries**, not arbitrary column counts. Function calls with 4+ arguments MUST use one argument per line — even when the prompt asks for single-line code:

```go
// Good — each argument on its own line, closing paren separate
mux.HandleFunc("/api/users", func(w http.ResponseWriter, r *http.Request) {
    handleUsers(
        w,
        r,
        serviceName,
        cfg,
        logger,
        authMiddleware,
    )
})
```

When a function signature is too long, the real fix is often **fewer parameters** (use an options struct) rather than better line wrapping. For multi-line signatures, put each parameter on its own line.

## Variable Declarations

SHOULD use `:=` for non-zero values, `var` for zero-value initialization. The form signals intent: `var` means "this starts at zero."

```go
var count int              // zero value, set later
name := "default"          // non-zero, := is appropriate
var buf bytes.Buffer       // zero value is ready to use
```

### Slice & Map Initialization

Slices and maps MUST be initialized explicitly, never nil. Nil maps panic on write; nil slices serialize to `null` in JSON (vs `[]` for empty slices), surprising API consumers.

```go
users := []User{}                       // always initialized
m := map[string]int{}                   // always initialized
users := make([]User, 0, len(ids))      // preallocate when capacity is known
m := make(map[string]int, len(items))   // preallocate when size is known
```

Do not preallocate speculatively — `make([]T, 0, 1000)` wastes memory when the common case is 10 items.

### Composite Literals

Composite literals MUST use field names — positional fields break when the type adds or reorders fields:

```go
srv := &http.Server{
    Addr:         ":8080",
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
}
```

## Control Flow

### Reduce Nesting

Errors and edge cases MUST be handled first (early return). Keep the happy path at minimal indentation:

```go
func process(data []byte) (*Result, error) {
    if len(data) == 0 {
        return nil, errors.New("empty data")
    }

    parsed, err := parse(data)
    if err != nil {
        return nil, fmt.Errorf("parsing: %w", err)
    }

    return transform(parsed), nil
}
```

### Eliminate Unnecessary `else`

When the `if` body ends with `return`/`break`/`continue`, the `else` MUST be dropped. Use default-then-override for simple assignments — assign a default, then override with independent conditions or a `switch`:

```go
// Good — default-then-override with switch (cleanest for mutually exclusive overrides)
level := slog.LevelInfo
switch {
case debug:
    level = slog.LevelDebug
case verbose:
    level = slog.LevelWarn
}

// Bad — else-if chain hides that there's a default
if debug {
    level = slog.LevelDebug
} else if verbose {
    level = slog.LevelWarn
} else {
    level = slog.LevelInfo
}
```

### Complex Conditions & Init Scope

When an `if` condition has 3+ operands, MUST extract into named booleans — a wall of `||` is unreadable and hides business logic. Keep expensive checks inline for short-circuit benefit.

```go
// Good — named booleans make intent clear
isAdmin := user.Role == RoleAdmin
isOwner := resource.OwnerID == user.ID
isPublicVerified := resource.IsPublic && user.IsVerified
if isAdmin || isOwner || isPublicVerified || permissions.Contains(PermOverride) {
    allow()
}
```

Scope variables to `if` blocks when only needed for the check:

```go
if err := validate(input); err != nil {
    return err
}
```

### Switch Over If-Else Chains

When comparing the same variable multiple times, prefer `switch`:

```go
switch status {
case StatusActive:
    activate()
case StatusInactive:
    deactivate()
default:
    panic(fmt.Sprintf("unexpected status: %d", status))
}
```

## Function Design

- Functions SHOULD be **short and focused** — one function, one job.
- Functions SHOULD have **≤4 parameters**. Beyond that, use an options struct (see `samber/cc-skills-golang@golang-design-patterns` skill).
- **Parameter order**: `context.Context` first, then inputs, then output destinations.
- Naked returns help in very short functions (1-3 lines) where return values are obvious, but become confusing when readers must scroll to find what's returned — name returns explicitly in longer functions.

```go
func FetchUser(ctx context.Context, id string) (*User, error)
func SendEmail(ctx context.Context, msg EmailMessage) error  // grouped into struct
```

### Prefer `range` for Iteration

SHOULD use `range` over index-based loops. Use `range n` (Go 1.22+) for simple counting.

```go
for _, user := range users {
    process(user)
}
```

## Value vs Pointer Arguments

Pass small types (`string`, `int`, `bool`, `time.Time`) by value. Use pointers when mutating, for large structs (~128+ bytes), or when nil is meaningful.

## Code Organization Within Files

- **Group related declarations**: type, constructor, methods together
- **Order**: package doc, imports, constants, types, constructors, methods, helpers
- **One primary type per file** when it has significant methods
- **Blank imports** (`_ "pkg"`) register side effects (init functions). Restricting them to `main` and test packages makes side effects visible at the application root, not hidden in library code
- **Dot imports** pollute the namespace and make it impossible to tell where a name comes from — never use in library code
- **Unexport aggressively** — you can always export later; unexporting is a breaking change

## String Handling

Use `strconv` for simple conversions (faster), `fmt.Sprintf` for complex formatting. Use `%q` in error messages to make string boundaries visible. Use `strings.Builder` for loops, `+` for simple concatenation.

## Type Conversions

Prefer explicit, narrow conversions. Use generics over `any` when a concrete type will do:

```go
func Contains[T comparable](slice []T, target T) bool  // not []any
```

## Code Style Philosophy

- **"A little copying is better than a little dependency"**
- **Use `slices` and `maps` standard packages**; for filter/group-by/chunk, use `github.com/samber/lo`
- **"Reflection is never clear"** — avoid `reflect` unless necessary
- **Don't abstract prematurely** — extract when the pattern is stable
- **Minimize public surface** — every exported name is a commitment

### Parallelizing Code Style Reviews

When reviewing code style across a large codebase, use up to 5 parallel sub-agents (via the Agent tool), each targeting an independent style concern (e.g. control flow, function design, variable declarations, string handling, code organization).

---

# Part 2: Testing

**Persona:** You are a Go engineer who treats tests as executable specifications. You write tests to constrain behavior, not to hit coverage targets.

**Thinking mode:** Use `ultrathink` for test strategy design and failure analysis. Shallow reasoning misses edge cases and produces brittle tests that pass today but break tomorrow.

**Modes:**

- **Write mode** — generating new tests for existing or new code. Work sequentially through the code under test; use `gotests` to scaffold table-driven tests, then enrich with edge cases and error paths.
- **Review mode** — reviewing a PR's test changes. Focus on the diff: check coverage of new behaviour, assertion quality, table-driven structure, and absence of flakiness patterns. Sequential.
- **Audit mode** — auditing an existing test suite for gaps, flakiness, or bad patterns (order-dependent tests, missing `t.Parallel()`, implementation-detail coupling). Launch up to 3 parallel sub-agents split by concern: (1) unit test quality and coverage gaps, (2) integration test isolation and build tags, (3) goroutine leaks and race conditions.
- **Debug mode** — a test is failing or flaky. Work sequentially: reproduce reliably, isolate the failing assertion, trace the root cause in production code or test setup.

## Testing Best Practices Summary

1. Table-driven tests MUST use named subtests -- every test case needs a `name` field passed to `t.Run`
2. Integration tests MUST use build tags (`//go:build integration`) to separate from unit tests
3. Tests MUST NOT depend on execution order -- each test MUST be independently runnable
4. Independent tests SHOULD use `t.Parallel()` when possible
5. NEVER test implementation details -- test observable behavior and public API contracts
6. Packages with goroutines SHOULD use `goleak.VerifyTestMain` in `TestMain` to detect goroutine leaks
7. Use testify as helpers, not a replacement for standard library
8. Mock interfaces, not concrete types
9. Keep unit tests fast (< 1ms), use build tags for integration tests
10. Run tests with race detection in CI
11. Include examples as executable documentation

## Test Structure and Organization

### File Conventions

```go
// package_test.go - tests in same package (white-box, access unexported)
package mypackage

// mypackage_test.go - tests in test package (black-box, public API only)
package mypackage_test
```

### Naming Conventions

```go
func TestAdd(t *testing.T) { ... }               // function test
func TestMyStruct_MyMethod(t *testing.T) { ... } // method test
func BenchmarkAdd(b *testing.B) { ... }          // benchmark
func ExampleAdd() { ... }                        // example
func FuzzAdd(f *testing.F) { ... }               // fuzz test
```

## Table-Driven Tests

Table-driven tests are the idiomatic Go way to test multiple scenarios. Always name each test case.

```go
func TestCalculatePrice(t *testing.T) {
    tests := []struct {
        name     string
        quantity int
        unitPrice float64
        expected  float64
    }{
        {
            name:      "single item",
            quantity:  1,
            unitPrice: 10.0,
            expected:  10.0,
        },
        {
            name:      "bulk discount - 100 items",
            quantity:  100,
            unitPrice: 10.0,
            expected:  900.0, // 10% discount
        },
        {
            name:      "zero quantity",
            quantity:  0,
            unitPrice: 10.0,
            expected:  0.0,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := CalculatePrice(tt.quantity, tt.unitPrice)
            if got != tt.expected {
                t.Errorf("CalculatePrice(%d, %.2f) = %.2f, want %.2f",
                    tt.quantity, tt.unitPrice, got, tt.expected)
            }
        })
    }
}
```

## Unit Tests

Unit tests should be fast (< 1ms), isolated (no external dependencies), and deterministic.

## Testing HTTP Handlers

Use `httptest` for handler tests with table-driven patterns.

## Goroutine Leak Detection with goleak

Use `go.uber.org/goleak` to detect leaking goroutines, especially for concurrent code:

```go
import (
    "testing"
    "go.uber.org/goleak"
)

func TestMain(m *testing.M) {
    goleak.VerifyTestMain(m)
}
```

To exclude specific goroutine stacks (for known leaks or library goroutines):

```go
func TestMain(m *testing.M) {
    goleak.VerifyTestMain(m,
        goleak.IgnoreCurrent(),
    )
}
```

Or per-test:

```go
func TestWorkerPool(t *testing.T) {
    defer goleak.VerifyNone(t)
    // ... test code ...
}
```

## testing/synctest for Deterministic Goroutine Testing

`testing/synctest` (Go 1.25+) provides deterministic tests for goroutines, timers, deadlines, and context cancellation. Time advances only when all goroutines are blocked, making ordering predictable.

When to use `synctest` instead of real time:

- Testing concurrent code with time-based operations (time.Sleep, time.After, time.Ticker)
- When race conditions need to be reproducible
- When tests are flaky due to timing issues

```go
import (
    "context"
    "testing"
    "testing/synctest"
    "time"
)

func TestContextTimeout(t *testing.T) {
    synctest.Test(t, func(t *testing.T) {
        const timeout = 5 * time.Second

        ctx, cancel := context.WithTimeout(t.Context(), timeout)
        defer cancel()

        time.Sleep(timeout - time.Nanosecond)
        synctest.Wait()
        if err := ctx.Err(); err != nil {
            t.Fatalf("before timeout: %v", err)
        }

        time.Sleep(time.Nanosecond)
        synctest.Wait()
        if err := ctx.Err(); err != context.DeadlineExceeded {
            t.Fatalf("after timeout: got %v, want DeadlineExceeded", err)
        }
    })
}
```

Use `synctest.Test` in Go 1.25+ and Go 1.26+. Do not use the old Go 1.24 experimental `synctest.Run` API in Go 1.25+ or Go 1.26+ code. If a module explicitly targets Go 1.24 and opts into `GOEXPERIMENT=synctest`, use the old API only as a compatibility fallback.

Key differences in `synctest`:

- `time.Sleep` advances synthetic time instantly when the goroutine blocks
- `time.After` fires when synthetic time reaches the duration
- All goroutines run to blocking points before time advances
- Test execution is deterministic and repeatable

## Test Timeouts

For tests that may hang, use a timeout helper that panics with caller location.

## Benchmarks

→ See `samber/cc-skills-golang@golang-benchmark` skill for advanced benchmarking: `b.Loop()` (Go 1.24+), `benchstat`, profiling from benchmarks, and CI regression detection.

Write benchmarks to measure performance and detect regressions:

```go
func BenchmarkStringConcatenation(b *testing.B) {
    b.Run("plus-operator", func(b *testing.B) {
        for b.Loop() {
            result := "a" + "b" + "c"
            _ = result
        }
    })

    b.Run("strings.Builder", func(b *testing.B) {
        for b.Loop() {
            var builder strings.Builder
            builder.WriteString("a")
            builder.WriteString("b")
            builder.WriteString("c")
            _ = builder.String()
        }
    })
}
```

Benchmarks with different input sizes:

```go
func BenchmarkFibonacci(b *testing.B) {
    sizes := []int{10, 20, 30}
    for _, size := range sizes {
        b.Run(fmt.Sprintf("n=%d", size), func(b *testing.B) {
            b.ReportAllocs()
            for b.Loop() {
                Fibonacci(size)
            }
        })
    }
}
```

For Go 1.24+, new benchmarks should use `b.Loop()`. Use legacy `b.N` loops only when the module targets Go <1.24 or when preserving old benchmark code intentionally.

### Go 1.26+: test artifacts

When a test, benchmark, or fuzz target needs to persist files for inspection, use `ArtifactDir()` instead of ad-hoc paths or repo-local output.

```go
func TestRenderGoldenArtifact(t *testing.T) {
    dir := t.ArtifactDir()

    out := filepath.Join(dir, "rendered.json")
    if err := os.WriteFile(out, renderedBytes, 0o644); err != nil {
        t.Fatal(err)
    }

    t.Logf("artifact written: %s", out)
}
```

Available on `*testing.T`, `*testing.B`, and `*testing.F` in Go 1.26+.

## Parallel Tests

Use `t.Parallel()` to run tests concurrently:

```go
func TestParallelOperations(t *testing.T) {
    tests := []struct {
        name string
        data []byte
    }{
        {"small data", make([]byte, 1024)},
        {"medium data", make([]byte, 1024*1024)},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel()
            is := assert.New(t)

            result := Process(tt.data)
            is.NotNil(result)
        })
    }
}
```

## Fuzzing

Use fuzzing to find edge cases and bugs:

```go
func FuzzReverse(f *testing.F) {
    f.Add("hello")
    f.Add("")
    f.Add("a")

    f.Fuzz(func(t *testing.T, input string) {
        reversed := Reverse(input)
        doubleReversed := Reverse(reversed)
        if input != doubleReversed {
            t.Errorf("Reverse(Reverse(%q)) = %q, want %q", input, doubleReversed, input)
        }
    })
}
```

## Examples as Documentation

Examples are executable documentation verified by `go test`:

```go
func ExampleCalculatePrice() {
    price := CalculatePrice(100, 10.0)
    fmt.Printf("Price: %.2f\n", price)
    // Output: Price: 900.00
}

func ExampleCalculatePrice_singleItem() {
    price := CalculatePrice(1, 25.50)
    fmt.Printf("Price: %.2f\n", price)
    // Output: Price: 25.50
}
```

## Code Coverage

```bash
# Generate coverage file
go test -coverprofile=coverage.out ./...

# View coverage in HTML
go tool cover -html=coverage.out

# Coverage by function
go tool cover -func=coverage.out

# Total coverage percentage
go tool cover -func=coverage.out | grep total
```

## Integration Tests

Use build tags to separate integration tests from unit tests:

```go
//go:build integration

package mypackage

func TestDatabaseIntegration(t *testing.T) {
    db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
    if err != nil {
        t.Fatal(err)
    }
    defer db.Close()

    // Test real database operations
}
```

Run integration tests separately:

```bash
go test -tags=integration ./...
```

## Mocking

Mock interfaces, not concrete types. Define interfaces where consumed, then create mock implementations.

## Enforce with Linters

Many rules are enforced automatically: `gofmt`, `gofumpt`, `goimports`, `gocritic`, `revive`, `wsl_v5`, `thelper`, `paralleltest`, `testifylint`. See the `samber/cc-skills-golang@golang-lint` skill for configuration and usage.

## Cross-References

- -> See `samber/cc-skills-golang@golang-stretchr-testify` skill for detailed testify API (assert, require, mock, suite)
- -> See `samber/cc-skills-golang@golang-database` skill for database integration test patterns
- -> See `samber/cc-skills-golang@golang-concurrency` skill for goroutine leak detection with goleak
- -> See `samber/cc-skills-golang@golang-continuous-integration` skill for CI test configuration and GitHub Actions workflows
- -> See `samber/cc-skills-golang@golang-lint` skill for linter configuration

## Quick Reference

```bash
go test ./...                          # all tests
go test -run TestName ./...            # specific test by exact name
go test -run TestName/subtest ./...    # subtests within a test
go test -run 'Test(Add|Sub)' ./...     # multiple tests (regexp OR)
go test -run 'Test[A-Z]' ./...         # tests starting with capital letter
go test -run 'TestUser.*' ./...        # tests matching prefix
go test -run '.*Validation.*' ./...    # tests containing substring
go test -run TestName/. ./...          # all subtests of TestName
go test -run '/(unit|integration)' ./... # filter by subtest name
go test -race ./...                    # race detection
go test -cover ./...                   # coverage summary
go test -bench=. -benchmem ./...       # benchmarks
go test -fuzz=FuzzName ./...           # fuzzing
go test -tags=integration ./...        # integration tests
```

## Reference

- [Effective Go](https://go.dev/doc/effective_go) - Official Go guide on idiomatic code style
