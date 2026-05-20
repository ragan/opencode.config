---
name: django-admin
description: Django admin specialization for OpenCode. Use when working on admin.py, ModelAdmin customization, admin inlines, filters, search, permissions, actions, and admin UX/performance in Django projects.
license: MIT
compatibility: opencode, claude-code, agents
metadata:
  domain: python
  framework: django
  focus: admin
---

# Django Admin

Use this skill when the task involves Django's admin site, especially `admin.py`, `ModelAdmin`, `TabularInline`/`StackedInline`, admin actions, list pages, object edit pages, permissions, search, filters, or admin-specific performance and usability work.

## Goals

Optimize for a Django admin that is:

- Useful for staff and operators.
- Fast enough on realistic data volumes.
- Safe by default for destructive actions.
- Predictable to maintain.
- Consistent with Django conventions.

## Default approach

When editing or generating admin code:

1. Prefer stock Django admin capabilities before adding custom templates or JavaScript.
2. Keep logic close to the model or queryset layer when it affects correctness.
3. Keep admin-specific presentation logic in `ModelAdmin`, form, filter, or inline classes.
4. Avoid clever admin customizations that future maintainers will not recognize.
5. Optimize list pages for operator workflows, not developer aesthetics.

## What to inspect first

Before making changes, review:

- `admin.py` in the target app.
- Related `models.py` definitions.
- `forms.py` if custom admin forms exist.
- `urls.py` only if custom admin views are involved.
- Query-heavy relations used by `list_display`, filters, inlines, and search.
- Existing permissions and staff roles.

## Recommended workflow

1. Identify the operator workflow: browsing, searching, bulk editing, moderation, auditing, or support.
2. Choose the minimum Django admin feature set that solves it.
3. Make list pages efficient with focused columns, filters, search, ordering, and pagination.
4. Make edit pages safe with field grouping, readonly fields, inlines only where useful, and validation.
5. Check query count and avoid obvious N+1 issues.
6. Prefer incremental changes over complete rewrites.

## List page guidance

Use `list_display` to surface the fields staff need most often. Keep it compact and task-oriented.

Prefer:

- Primary identifier, status, owner, key timestamp, and one or two business-critical fields.
- `list_select_related` for common foreign keys shown in the changelist.
- `ordering` for stable default sorting.
- `list_per_page` when the default page size is a poor fit.
- `date_hierarchy` for time-oriented models.

Avoid:

- Too many columns.
- Expensive computed columns without queryset optimization.
- Large text blobs in changelists.
- Many-to-many fields directly in `list_display` unless carefully handled.

### Good pattern

```python
from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer",
        "status",
        "total_amount",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("id", "customer__email", "customer__name")
    list_select_related = ("customer",)
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
```

## Search and filter guidance

Use `search_fields` for high-value lookup paths staff actually use. In related lookups, use Django's double-underscore traversal where appropriate.

Prefer:

- Exact identifiers and human-facing references.
- Names, emails, slugs, and external IDs that operators know.
- `list_filter` for low-cardinality fields like status, booleans, type, and dates.
- `autocomplete_fields` for large foreign-key relationships.

Avoid:

- Searching very large text fields unless truly necessary.
- Adding filters that create slow or confusing sidebars.
- Huge dropdown relations where `autocomplete_fields` is better.

### Example

```python
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "id")
    list_filter = ("is_active", "category")
    search_fields = ("name", "slug")
    autocomplete_fields = ("category",)
    prepopulated_fields = {"slug": ("name",)}
```

## Edit page guidance

Use the object form to reduce mistakes and make important context visible.

Prefer:

- `readonly_fields` for derived, immutable, or audit fields.
- `fieldsets` to group fields by workflow.
- `filter_horizontal` or `filter_vertical` for manageable many-to-many fields.
- Clear help text when a field is easy to misuse.

Avoid:

- Showing every model field with no grouping.
- Allowing edits to fields that should be system-managed.
- Large inline sections that dominate the page without operator value.

### Example

```python
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    readonly_fields = ("created_at", "updated_at", "last_login_at")
    fieldsets = (
        ("Identity", {"fields": ("email", "full_name")}),
        ("Account", {"fields": ("status", "is_staff")}),
        ("Audit", {"fields": ("created_at", "updated_at", "last_login_at")}),
    )
```

## Inline guidance

Use inlines only when the parent-child editing workflow is genuinely valuable.

Prefer:

- `TabularInline` for simple child rows.
- `StackedInline` for rich child forms.
- Small inline counts and constrained editable fields.
- `extra = 0` unless blank rows are genuinely helpful.

Avoid:

- Huge child collections in an inline.
- Deeply nested editing expectations.
- Inlines for data that deserves its own dedicated admin page.

### Example

```python
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    autocomplete_fields = ("product",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
```

## Query performance rules

Admin pages can hide expensive ORM behavior. Assume `list_display`, filters, and inlines can trigger extra queries.

Prefer:

- `list_select_related` for foreign keys rendered in changelists.
- `get_queryset()` with `select_related()` and `prefetch_related()` when needed.
- Database indexes on fields used frequently in filtering, sorting, and lookup.
- Simple computed columns derived from already-fetched data.

Avoid:

- Per-row queries in display methods.
- Property access that hides database hits.
- Over-customization before confirming a bottleneck.

### Example

```python
@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "status", "issued_at", "paid_at")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related("customer")
```

## Safe display methods

When adding a custom column to `list_display`, keep it deterministic, cheap, and clearly labeled.

```python
@admin.register(BestSeller)
class BestSellerAdmin(admin.ModelAdmin):
    list_display = ("id", "rank", "year", "book", "author_name")
    search_fields = ("book__name",)

    @admin.display(ordering="book__author__name", description="Author")
    def author_name(self, obj):
        return obj.book.author.name
```

Rules:

- Use `@admin.display(...)` for label and ordering metadata.
- Prefer queryset annotations or `select_related()` if related data is shown repeatedly.
- Do not place complex business logic in display methods.

## Permissions and safety

Treat the admin as an internal tool with elevated risk.

Prefer:

- Explicit `readonly_fields` for sensitive state.
- `has_view_permission`, `has_change_permission`, `has_delete_permission`, and `has_add_permission` overrides when role rules differ by object or staff group.
- Soft-delete flows or confirmation-heavy destructive actions when the domain is high risk.
- Admin actions only for clearly reversible or well-understood bulk operations.

Avoid:

- Exposing critical fields to all staff users.
- Bulk destructive actions without confirmation or auditability.
- Assuming `is_staff` alone is a complete authorization model.

### Example

```python
@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    readonly_fields = ("amount", "recipient", "created_at")

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
```

## Admin actions

Actions should be explicit, constrained, and written for operator trust.

Prefer:

- Clear names and messages.
- Idempotent updates where possible.
- Logging or notes for important state transitions.
- Short-circuit behavior when records are ineligible.

Avoid:

- Silent partial failure.
- Hidden side effects.
- Actions that should really be modeled as service-layer commands without safeguards.

### Example

```python
@admin.action(description="Mark selected orders as shipped")
def mark_shipped(modeladmin, request, queryset):
    updated = queryset.filter(status="paid").update(status="shipped")
    modeladmin.message_user(request, f"Marked {updated} orders as shipped.")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    actions = [mark_shipped]
```

## Validation and forms

When admin editing needs extra constraints, prefer form or model validation over ad hoc save hooks.

Prefer:

- Model validation for domain invariants.
- Custom `ModelForm` for admin-specific input validation or widgets.
- `save_model()` only when orchestration is necessary and obvious.

Avoid:

- Business-critical validation living only in admin code if the model is writable elsewhere.
- Heavy side effects inside `save_model()` without tests.

## Custom admin UX

Customize the admin UI only after exhausting built-in options.

Prefer:

- Better labels, ordering, filters, readonly summaries, and fieldsets.
- `autocomplete_fields` before bespoke widgets.
- Small template overrides when the stock page is close to the goal.

Avoid:

- Large custom JavaScript bundles.
- Rebuilding the admin into a separate app inside the admin shell.
- Cosmetic churn that adds maintenance cost without operator benefit.

## When generating code

When asked to create or refactor admin code:

1. Register models with `@admin.register(Model)` unless project conventions prefer `admin.site.register`.
2. Add only the admin options justified by the workflow.
3. Use related lookups in `search_fields` where helpful.
4. Consider `list_select_related`, `autocomplete_fields`, and readonly audit fields by default.
5. Keep examples production-leaning, not tutorial-minimal.
6. Preserve existing project style and import patterns.

## Review checklist

Before finalizing, check:

- Is the admin page optimized for the actual staff workflow?
- Are list columns, filters, and search focused rather than exhaustive?
- Are there obvious N+1 queries from related fields or custom methods?
- Are dangerous fields protected?
- Are inlines truly useful?
- Are actions safe and understandable?
- Does the code stay close to normal Django conventions?

## Output expectations

For code changes, provide:

- The concrete `admin.py` changes.
- Any model/form/queryset changes needed to support the admin safely.
- Brief rationale tied to workflow, safety, and performance.
- Notes on testing if the change affects permissions, actions, or query-heavy screens.
