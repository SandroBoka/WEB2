<template>
    <article class="card">
        <header class="cardHeader">
            <h3>Player: {{ playerName }}</h3>

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
    computed: {
        playerName() {
            const name = (this.item.player || "").trim();
            return name || "Unknown player";
        },
    },
};
</script>

<style scoped>
.card {
    border: 1px solid var(--border);
    padding: 16px;
    border-radius: var(--radius);
    background: linear-gradient(180deg, #ffffff 0%, #fff7ed 100%);
    box-shadow: var(--shadow-card);
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: cardIn 0.35s ease;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cardHeader h3 {
    margin: 0;
    font-size: 20px;
}

.cardHeader {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.meta {
    display: flex;
    gap: 8px;
    align-items: center;
    color: var(--muted);
    font-size: 13px;
}

.badge {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 2px 10px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.6px;
    background: #fff;
    text-transform: uppercase;
}

.details {
    margin: 0;
    font-weight: 600;
}

.cardFooter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 8px;
    border-top: 1px dashed var(--border);
    color: var(--muted);
}

.cardFooter small {
    font-size: 12px;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 36px rgba(31, 28, 22, 0.14);
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@media (prefers-reduced-motion: reduce) {
    .card {
        animation: none;
        transition: none;
    }
}
</style>
