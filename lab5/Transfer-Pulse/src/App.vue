<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header class="topbar">
    <nav class="nav">
      <RouterLink to="/">Feed</RouterLink>
      <RouterLink to="/favorites">Favorites</RouterLink>
      <RouterLink to="/stats">Stats</RouterLink>
    </nav>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>

<style scoped>
.nav a { margin-right: 12px; }
.container { padding: 16px; }
</style>
