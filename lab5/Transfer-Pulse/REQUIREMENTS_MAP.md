# Requirements Map

This file maps each assignment requirement to the place(s) in code where it is implemented,
with short notes and line references to make it easier to find and explain in a code review.

## Vue basics
- interpolation / one-way binding:
  - `src/components/NewsCard.vue:11` and `src/components/NewsCard.vue:15` render transfer data with interpolation.
  - `src/views/HomeView.vue:11` shows the count with `{{ filteredNews.length }}`.
- two-way binding (v-model):
  - `src/components/FiltersPanel.vue:3`, `src/components/FiltersPanel.vue:5`, `src/components/FiltersPanel.vue:10`.
  - `src/views/StatsView.vue:15` uses `v-model` on the club selector.
- methods:
  - `src/components/FiltersPanel.vue:34` has `apply()` to emit selected filters.
  - `src/views/HomeView.vue:64` and `src/views/HomeView.vue:67` define `onFiltersChanged()` and `slug()`.
  - `src/components/NewsCard.vue:53` has `openClub()` to navigate on card click.
- computed properties:
  - `src/views/HomeView.vue:44` has `filteredNews` to filter by search, club, and type.
  - `src/views/StatsView.vue:73`, `src/views/StatsView.vue:109`, `src/views/StatsView.vue:112`.
  - `src/components/NewsCard.vue:44` and `src/components/NewsCard.vue:48` for `playerName` and `clubTarget`.
- scoped styles:
  - `src/components/NewsCard.vue:62`, `src/views/StatsView.vue:141`, `src/views/NotFoundView.vue:9`.
- lifecycle hook:
  - `src/App.vue:8` uses `onMounted` to load data into the store at app start.

## Routing
- routing (multiple pages):
  - `src/router/index.js:14` to `src/router/index.js:24` define all routes.
  - `src/App.vue:19` to `src/App.vue:27` use `RouterLink` and `RouterView`.
- bookmarkable routes (deep links):
  - `src/router/index.js:12` uses `createWebHistory` so URLs are clean and shareable.
  - Production note: this requires a rewrite to `index.html` on the server (Render rewrite).
- dynamic routing:
  - `src/router/index.js:18` defines `/clubs/:clubSlug`.
  - `src/views/ClubView.vue:26` and `src/views/ClubView.vue:36` read the slug and filter items.
- 404 catch-all:
  - `src/router/index.js:24` uses `/:catchAll(.*)` to catch unknown routes.
  - `src/views/NotFoundView.vue:1` to `src/views/NotFoundView.vue:6` is the 404 page.
- lazy loading (async page load):
  - `src/router/index.js:9` lazy-loads `StatsView` with `const StatsView = () => import(...)`.

## Components
- at least two components:
  - `src/components/NewsCard.vue` (card for one transfer/loan)
  - `src/components/FiltersPanel.vue` (search + filters)
- stateless component using props:
  - `src/components/NewsCard.vue:41` receives `item` and `isFav` via props and renders them.
  - No local data state, it only derives computed values from props.
- stateful component:
  - `src/components/FiltersPanel.vue:25` keeps local `data()` for `search`, `club`, `type`.
- component emits event:
  - `src/components/NewsCard.vue:42` and `src/components/NewsCard.vue:32` emit `toggle-fav`.
  - `src/components/FiltersPanel.vue:23` and `src/components/FiltersPanel.vue:34` emit `filters-changed`.

## Store + async data
- Pinia store:
  - `src/stores/news.js:4` defines the `news` store, state, getters, and actions.
- async data fetch (mocked):
  - `src/services/newsService.js:7` provides `fetchNewsAsync` with an artificial delay.
  - `src/stores/news.js:23` and `src/stores/news.js:28` use `refreshNews()` to await the async call.
