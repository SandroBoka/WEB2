<template>
    <section>
        <h1>Stats</h1>

        <p>Clubs: {{ clubsCount }}</p>
        <p>Transfers: {{ transfersCount }}</p>
        <p>Loans: {{ loansCount }}</p>
        <p>Favorites: {{ favoritesCount }}</p>
    </section>
</template>

<script>
import { useNewsStore } from "../stores/news";

export default {
    data() {
        return { news: useNewsStore() };
    },
    computed: {
        clubsCount() {
            return this.news.clubs.length;
        },
        transfersCount() {
            return this.news.allNews.filter((x) => x.type === "transfer").length;
        },
        loansCount() {
            return this.news.allNews.filter((x) => x.type === "loan").length;
        },
        favoritesCount() {
            return this.news.favorites.size;
        },
    },
};
</script>
