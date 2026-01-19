import { defineStore } from "pinia";
import { fetchNewsAsync } from "../services/newsService";

export const useNewsStore = defineStore("news", {
    state: () => ({
        items: [],
        favorites: new Set(),
        loading: false,
        error: null,
    }),

    getters: {
        allNews: (state) => state.items,
        isFavorite: (state) => (id) => state.favorites.has(id),

        clubs: (state) => [...new Set(state.items.map((x) => x.club))].sort(),
        nations: (state) => [...new Set(state.items.map((x) => x.nation))].sort(),
    },

    actions: {
        async refreshNews() {
            // asynchrone
            this.loading = true;
            this.error = null;
            try {
                this.items = await fetchNewsAsync();
            } catch (e) {
                this.error = "Could not fetch data.";
            } finally {
                this.loading = false;
            }
        },

        toggleFavorite(id) {
            if (this.favorites.has(id)) this.favorites.delete(id);
            else this.favorites.add(id);
        },
    },
});
