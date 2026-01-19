<template>
    <section>
        <h1>Stats</h1>

        <div class="statsSummary">
            <p>Clubs: {{ clubsCount }}</p>
            <p>Transfers: {{ transfersCount }}</p>
            <p>Loans: {{ loansCount }}</p>
            <p>Favorites: {{ favoritesCount }}</p>
        </div>

        <div class="clubStats">
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

            <p v-else>Select a club to see detailed stats.</p>
        </div>
    </section>
</template>

<script>
import { useNewsStore } from "../stores/news";

export default {
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
}

.clubLabel {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
}

.clubStats select {
    padding: 4px 6px;
}
</style>
