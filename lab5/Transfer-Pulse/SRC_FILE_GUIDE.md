# Src File Guide

This document explains every file under `src/`, what it does, and how it fits into
the application.

## Entry and app shell

- `src/main.js`
  - The app entry point.
  - Creates the Vue app instance, installs Pinia and the router, then mounts the
    app to `#app`.
  - This is where the root component and global plugins are wired together.

- `src/App.vue`
  - The root component rendered by the app entry.
  - Provides the top navigation (tab bar) and the layout container that wraps
    all pages.
  - Uses `RouterView` to render the active route.
  - Uses `onMounted` to trigger a single, centralized data load from the store
    on app start.
  - Holds the global styling (theme variables, layout helpers, button styles).

## Routing

- `src/router/index.js`
  - Declares all routes and enables `createWebHistory` for bookmarkable URLs.
  - Routes include: `/`, `/favorites`, `/stats`, `/clubs/:clubSlug`, and a
    catch-all 404 route.
  - `StatsView` is lazy-loaded (async chunk) to satisfy the requirement for
    lazy loading.
  - Note: in production, history routing requires a server rewrite to
    `index.html` so deep links work.

## State and data access

- `src/stores/news.js`
  - The Pinia store for all transfer data and favorites.
  - State: `items`, `favorites`, `loading`, `error`.
  - Getters: `allNews`, `isFavorite`, `clubs`, `nations`.
  - Actions:
    - `refreshNews()` asynchronously loads data from the service.
    - `toggleFavorite()` adds/removes an item id from the favorites set.
  - This is the single source of truth for transfer data across the app.

- `src/services/newsService.js`
  - Simulates an asynchronous backend call.
  - Uses an artificial delay, then returns mock data sorted by date
    (descending).
  - This satisfies the async data requirement without a real backend.

- `src/mock/mockTransfers.js`
  - The in-memory dataset used by the service.
  - Exports an array of transfer/loan objects with fields like `id`, `type`,
    `date`, `player`, `from`, `to`, `fee`, and `endDate`.

## Reusable components

- `src/components/FiltersPanel.vue`
  - Stateful component with local `data()` for filter inputs.
  - Uses `v-model` for two-way binding on search/club/type controls.
  - Emits `filters-changed` when Apply is clicked so the parent can update
    the feed.
  - Contains scoped styles for the filter panel layout.

- `src/components/NewsCard.vue`
  - Stateless component that renders one transfer or loan.
  - Props: `item`, `isFav`.
  - Computed helpers:
    - `playerName` provides a fallback when player name is missing.
    - `clubTarget` resolves the club to open on click.
  - Emits `toggle-fav` when the favorite button is clicked.
  - Clicking the card navigates to the club route using the router.
  - Contains scoped styles for the card visuals and interactions.

## Views (pages)

- `src/views/HomeView.vue`
  - The main feed page.
  - Renders `FiltersPanel` and a list of `NewsCard` components.
  - Uses `filteredNews` (computed) to filter the store items by search, club,
    and type.
  - Shows loading and error states from the store.
  - Also renders a list of club links as quick navigation.

- `src/views/FavoritesView.vue`
  - Page that shows only favorited items.
  - Computes `favItems` by filtering `allNews` with `isFavorite`.
  - Renders `NewsCard` for each favorite or an empty state message.

- `src/views/StatsView.vue`
  - Page that shows overall and club-specific statistics.
  - Top summary includes totals for clubs, transfers, loans, and favorites.
  - Club selector (`v-model`) drives computed stats:
    - Transfers and loans in/out.
    - Total transfers/loans.
    - Total spend (using fee parsing helpers).
  - Shows the club's related cards below the stats.

- `src/views/ClubView.vue`
  - Dynamic club page for `/clubs/:clubSlug`.
  - Reads the `clubSlug` from the route and formats a display name.
  - Filters store items where the club appears as `from` or `to`.
  - Renders `NewsCard` components or an empty state message.

- `src/views/NotFoundView.vue`
  - 404 page for unknown routes.
  - Displays the invalid path and provides a "Back to feed" link.
  - Uses a button-like style consistent with the rest of the app.

