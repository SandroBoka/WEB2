<template>
    <article class="card">
        <header class="cardHeader">
            <h3>{{ item.player }}</h3>

            <small class="meta">
                <span class="badge">{{ item.type.toUpperCase() }}</span>
                <span>{{ item.from }} → {{ item.to }}</span>
            </small>
        </header>

        <p class="details">
            <span v-if="item.type === 'transfer'">
                Fee: {{ item.fee || "N/A" }}
            </span>

            <span v-else>
                Loan ends: {{ item.endDate || "N/A" }}
            </span>
        </p>

        <footer class="cardFooter">
            <small>Date: {{ item.date }}</small>

            <button type="button" @click="$emit('toggle-fav', item.id)">
                {{ isFav ? "Unfavorite" : "Favorite" }}
            </button>
        </footer>
    </article>
</template>

<script>
export default {
    props: ["item", "isFav"],
    emits: ["toggle-fav"],
};
</script>

<style scoped>
.card {
    border: 1px solid #ddd;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 12px;
}

.cardHeader h3 {
    margin: 0 0 4px 0;
}

.meta {
    display: flex;
    gap: 8px;
    align-items: center;
}

.badge {
    border: 1px solid #bbb;
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 12px;
}

.details {
    margin: 8px 0 12px 0;
}

.cardFooter {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
