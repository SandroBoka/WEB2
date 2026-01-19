<template>
    <section>
        <h1>Favorites</h1>

        <p v-if="favItems.length === 0" class="emptyState">No favorites yet.</p>

        <div v-else class="cards">
            <NewsCard v-for="it in favItems" :key="it.id" :item="it" :isFav="true"
                @toggle-fav="news.toggleFavorite" />
        </div>
    </section>
</template>

<script>
import { useNewsStore } from "../stores/news";
import NewsCard from "../components/NewsCard.vue";

export default {
    components: { NewsCard },
    data() {
        return { news: useNewsStore() };
    },
    computed: {
        favItems() {
            return this.news.allNews.filter((x) => this.news.isFavorite(x.id));
        },
    },
};
</script>
