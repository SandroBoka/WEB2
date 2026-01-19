<template>
    <section>
        <h1>Transfer Feed</h1>

        <FiltersPanel :clubs="news.clubs" @filters-changed="onFiltersChanged" />

        <div v-if="news.loading">Loading…</div>
        <div v-else-if="news.error">{{ news.error }}</div>

        <div v-else>
            <p>Showing {{ filteredNews.length }} items</p>

            <div class="cards">
                <NewsCard v-for="it in filteredNews" :key="it.id" :item="it" :isFav="news.isFavorite(it.id)"
                    @toggle-fav="news.toggleFavorite" />
            </div>

            <h2>Quick clubs</h2>
            <ul class="clubList">
                <li v-for="c in news.clubs" :key="c">
                    <RouterLink :to="`/clubs/${slug(c)}`">{{ c }}</RouterLink>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import { useNewsStore } from "../stores/news";
import NewsCard from "../components/NewsCard.vue";
import FiltersPanel from "../components/FiltersPanel.vue";

export default {
    components: { NewsCard, FiltersPanel },

    data() {
        return {
            news: useNewsStore(),
            filters: { search: "", club: "", type: "" }, // type: "", "transfer", "loan"
        };
    },

    computed: {
        filteredNews() {
            const s = this.filters.search.toLowerCase();

            return this.news.allNews.filter((x) => {
                const okSearch = !s || x.player.toLowerCase().includes(s);

                // klub filter: match on from or to
                const okClub =
                    !this.filters.club ||
                    x.from === this.filters.club ||
                    x.to === this.filters.club;

                const okType = !this.filters.type || x.type === this.filters.type;

                return okSearch && okClub && okType;
            });
        },
    },

    methods: {
        onFiltersChanged(newFilters) {
            this.filters = newFilters;
        },
        slug(clubName) {
            return clubName.toLowerCase().replace(/\s+/g, "-");
        },
    },

    async mounted() {
        await this.news.refreshNews();
    },
};
</script>
