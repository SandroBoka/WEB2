import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import FavoritesView from "../views/FavoritesView.vue";
import ClubView from "../views/ClubView.vue";
import NotFoundView from "../views/NotFoundView.vue";

// lazy loading
const StatsView = () => import("../views/StatsView.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/favorites", name: "favorites", component: FavoritesView },

    // dinamic routing to club
    { path: "/clubs/:clubSlug", name: "club", component: ClubView },

    // lazy loading
    { path: "/stats", name: "stats", component: StatsView },

    // catch-all 404
    { path: "/:catchAll(.*)", name: "notfound", component: NotFoundView },
  ],
});

export default router;
