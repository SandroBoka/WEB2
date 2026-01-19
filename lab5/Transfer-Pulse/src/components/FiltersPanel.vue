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
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}
</style>
