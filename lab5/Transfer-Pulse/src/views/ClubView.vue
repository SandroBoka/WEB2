<template>
    <section>
        <h1>Club: {{ clubDisplay }}</h1>

        <p v-if="items.length === 0" class="emptyState">No items for this club.</p>

        <div v-else class="cards">
            <NewsCard v-for="it in items" :key="it.id" :item="it" :isFav="news.isFavorite(it.id)"
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
        clubSlug() {
            return String(this.$route.params.clubSlug || "");
        },

        clubDisplay() {
            return this.clubSlug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());
        },

        items() {
            const slugify = (s) =>
                String(s || "")
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-");

            return this.news.allNews.filter((x) => {
                return slugify(x.from) === this.clubSlug || slugify(x.to) === this.clubSlug;
            });
        },
    },
};
</script>
