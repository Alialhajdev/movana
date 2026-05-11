## Goal
Turn the current read-only admin panel into a fully working management dashboard. All data stays in `localStorage` (no backend yet) so changes persist across reloads and reflect on the public site immediately.

## Scope

### 1. Extend the central store (`src/lib/store.tsx`)
Add managed collections + CRUD actions:
- **Series**: seeded from `src/lib/data.ts` on first load, then persisted. Add `addSeries`, `updateSeries`, `deleteSeries`.
- **Orders**: add `updateOrderStatus`, `deleteOrder`.
- **Series requests** (from users): add `submitRequest`, `updateRequestStatus`, `deleteRequest`.
- **Sliders**: list of hero slide entries (image/gradient, title AR/EN, subtitle AR/EN, linked seriesId, order, active). CRUD actions.
- **Payment receipts**: derived from orders with `wallet_transfer`; admin can approve (→ delivered) or reject.

Public components (`HeroSlider`, `SeriesRow`, category pages, search, series detail) read from the store's series list instead of importing the static array directly — so admin edits show up live.

### 2. Admin pages — make each tab functional (`src/routes/admin.tsx`, split into sub-components)

**Dashboard tab**
- Real stats from store (users count = unique order emails + 1, orders, series, revenue).
- Keep the bar chart but compute from last 7 days of orders.

**Series tab** — full CRUD
- Searchable/filterable table (by category, title).
- "Add series" opens a modal/sheet with all fields: title (AR/EN), description (AR/EN), category select, genres (tag input AR/EN), year, IMDB, seasons, episodes, source, price (YER), trailer URL (YouTube), poster gradient picker, flags (trending / new / topWatched / featured).
- Row actions: Edit (same form pre-filled), Delete (confirm dialog).

**Orders tab**
- Table already exists; wire actions to `updateOrderStatus` in the store (currently writes to local component state only).
- Add filters: status, payment method, search by order ID.
- Order detail drawer: items, customer email, receipt file name, timestamps.

**Payments tab**
- List orders with `paymentMethod === "wallet_transfer"` and `status === "pending"`.
- Show receipt name, amount, customer; Approve → status=delivered, Reject → status=rejected.

**Requests tab**
- Table of user-submitted series requests (title, notes, user, date, status).
- Approve / Reject / Delete actions.
- The user-facing `/requests` page writes via `submitRequest`.

**Sliders tab**
- Grid of slides with reorder (up/down), toggle active, edit, delete.
- "Add slide" form: pick existing series OR custom (title AR/EN, subtitle AR/EN, gradient, CTA link).
- `HeroSlider` reads slides from the store (only active ones, sorted).

### 3. Shared admin UI primitives
- Reuse shadcn `Dialog`, `Sheet`, `Table`, `Input`, `Textarea`, `Select`, `Switch`, `AlertDialog` (confirm delete), `Badge`, `Tabs`.
- Add small `<AdminFormField>` wrapper for label + input consistency in both RTL/EN.
- Toasts via existing `sonner` for success/error feedback.

### 4. i18n
Extend `src/lib/i18n.tsx` dictionary with all new admin strings (add/edit/delete/save/cancel/confirm/search, field labels, slide labels, request statuses) in AR + EN.

### 5. File layout
Split `admin.tsx` to keep it maintainable:
```
src/routes/admin.tsx                  // shell + tabs
src/components/admin/StatsPanel.tsx
src/components/admin/SeriesManager.tsx
src/components/admin/SeriesFormDialog.tsx
src/components/admin/OrdersManager.tsx
src/components/admin/PaymentsManager.tsx
src/components/admin/RequestsManager.tsx
src/components/admin/SlidesManager.tsx
src/components/admin/SlideFormDialog.tsx
```

## Out of scope (for this iteration)
- Real backend / database (still localStorage). Lovable Cloud can be enabled in a follow-up to make data multi-user and persistent server-side.
- Image uploads for slides (we'll use the existing gradient system + URL field).
- Role/permission granularity beyond the existing `admin@*` email check.

## Acceptance
- Admin can add a new series → it appears on the home page and category page after save.
- Admin can edit any field of any series → public pages reflect changes.
- Admin can delete a series (with confirm) → it's gone from public lists.
- Admin can change order status → user sees updated status in `/profile` and order confirmation.
- Admin can approve/reject wallet-transfer payments.
- Admin can manage user series requests (the `/requests` page submits real entries).
- Admin can add / edit / reorder / toggle / delete hero slides → `HeroSlider` updates.
- All changes persist after page reload.
