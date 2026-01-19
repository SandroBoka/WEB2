<template>
    <section>
        <h1>Stats</h1>

        <div class="panel statsSummary">
            <p>Clubs: {{ clubsCount }}</p>
            <p>Transfers: {{ transfersCount }}</p>
            <p>Loans: {{ loansCount }}</p>
            <p>Favorites: {{ favoritesCount }}</p>
        </div>

        <div class="panel clubStats">
            <label class="clubLabel">
                Club
                <select v-model="selectedClub">
                    <option value="">Select a club</option>
                    <option v-for="club in news.clubs" :key="club" :value="club">
                        {{ club }}
                    </option>
                </select>
            </label>

            <div v-if="selectedClub">
                <p>Spent: {{ formattedSpent }}</p>
                <p>Transfers in: {{ clubStats.transfersIn }}</p>
                <p>Transfers out: {{ clubStats.transfersOut }}</p>
                <p>Loans in: {{ clubStats.loansIn }}</p>
                <p>Loans out: {{ clubStats.loansOut }}</p>
                <p>Total transfers: {{ clubStats.transfersTotal }}</p>
                <p>Total loans: {{ clubStats.loansTotal }}</p>
            </div>

            <p v-else class="emptyState">Select a club to see detailed stats.</p>
        </div>

        <div v-if="selectedClub">
            <h2>Club activity</h2>

            <p v-if="clubItems.length === 0" class="emptyState">
                No transfers or loans for this club.
            </p>

            <div v-else class="cards">
                <NewsCard v-for="it in clubItems" :key="it.id" :item="it" :isFav="news.isFavorite(it.id)"
                    @toggle-fav="news.toggleFavorite" />
            </div>
        </div>
    </section>
</template>

<script>
import { useNewsStore } from "../stores/news";
import NewsCard from "../components/NewsCard.vue";

export default {
    components: { NewsCard },
    data() {
        return { news: useNewsStore(), selectedClub: "" };
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
        clubStats() {
            const club = this.selectedClub;
            const stats = {
                spent: 0,
                transfersIn: 0,
                transfersOut: 0,
                loansIn: 0,
                loansOut: 0,
                transfersTotal: 0,
                loansTotal: 0,
            };

            if (!club) return stats;

            this.news.allNews.forEach((item) => {
                const isFrom = item.from === club;
                const isTo = item.to === club;

                if (item.type === "transfer") {
                    if (isTo) {
                        stats.transfersIn += 1;
                        stats.spent += this.parseFee(item.fee);
                    }
                    if (isFrom) stats.transfersOut += 1;
                    if (isFrom || isTo) stats.transfersTotal += 1;
                }

                if (item.type === "loan") {
                    if (isTo) stats.loansIn += 1;
                    if (isFrom) stats.loansOut += 1;
                    if (isFrom || isTo) stats.loansTotal += 1;
                }
            });

            return stats;
        },
        formattedSpent() {
            return this.formatPounds(this.clubStats.spent);
        },
        clubItems() {
            if (!this.selectedClub) return [];
            return this.news.allNews.filter((item) => {
                return item.from === this.selectedClub || item.to === this.selectedClub;
            });
        },
    },
    methods: {
        parseFee(fee) {
            if (!fee) return 0;
            const raw = String(fee).trim().toLowerCase();
            if (!raw || raw === "free" || raw === "undisclosed") return 0;
            const cleaned = raw.replace(/[^0-9mk.,]/g, "");
            const match = cleaned.match(/([\d,.]+)([mk])?/i);
            if (!match) return 0;
            let value = parseFloat(match[1].replace(/,/g, ""));
            const suffix = match[2];
            if (suffix === "m") value *= 1000000;
            if (suffix === "k") value *= 1000;
            return Number.isFinite(value) ? value : 0;
        },
        formatPounds(amount) {
            const rounded = Math.round(amount || 0);
            return `GBP ${rounded.toLocaleString("en-GB")}`;
        },
    },
    async mounted() {
        if (!this.news.allNews.length) {
            await this.news.refreshNews();
        }
    },
};
</script>

<style scoped>
.statsSummary {
    margin-bottom: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 8px 12px;
}

.statsSummary p,
.clubStats p {
    margin: 0;
}

.clubStats p {
    color: var(--muted);
    font-weight: 600;
}

.clubLabel {
    display: flex;
    gap: 6px;
    align-items: flex-start;
    flex-direction: column;
    font-weight: 600;
}

.clubStats select {
    width: 100%;
}

.clubStats {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
