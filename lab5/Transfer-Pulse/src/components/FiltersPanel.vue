<template>
    <section class="filters">
        <input type="text" placeholder="Search player..." v-model.trim="search" />

        <select v-model="club">
            <option value="">All clubs</option>
            <option v-for="c in clubs" :key="c" :value="c">{{ c }}</option>
        </select>

        <select v-model="type">
            <option value="">All types</option>
            <option value="transfer">Transfers</option>
            <option value="loan">Loans</option>
        </select>

        <button type="button" @click="apply">Apply</button>
    </section>
</template>

<script>
export default {
    props: ["clubs"],
    emits: ["filters-changed"],

    data() {
        return {
            search: "",
            club: "",
            type: "",
        };
    },

    methods: {
        apply() {
            this.$emit("filters-changed", {
                search: this.search,
                club: this.club,
                type: this.type,
            });
        },
    },
};
</script>

<style scoped>
.filters {
    display: grid;
    gap: 10px;
    grid-template-columns: 1.4fr 1fr 1fr auto;
    align-items: center;
    padding: 12px;
    margin: 0 auto 18px;
    max-width: 780px;
    border-radius: 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-soft);
}

.filters input,
.filters select {
    width: 100%;
}

.filters button {
    justify-self: end;
}

@media (max-width: 760px) {
    .filters {
        grid-template-columns: 1fr;
    }
    .filters button {
        justify-self: stretch;
    }
}
</style>
