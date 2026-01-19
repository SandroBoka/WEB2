<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header class="topbar">
    <div class="topbarInner">
      <nav class="tabs" aria-label="Primary">
        <RouterLink to="/" class="tab">Feed</RouterLink>
        <RouterLink to="/favorites" class="tab">Favorites</RouterLink>
        <RouterLink to="/stats" class="tab">Stats</RouterLink>
      </nav>
    </div>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Newsreader:wght@500;700&family=Space+Grotesk:wght@400;600&display=swap");

:root {
  --bg: #f3f1ee;
  --surface: #fffdf9;
  --surface-alt: #f0ebe2;
  --ink: #1e1c19;
  --muted: #5b564f;
  --accent: #d26d54;
  --accent-strong: #b85b46;
  --accent-cool: #2f5d62;
  --border: #e0d9cf;
  --shadow-soft: 0 1px 2px rgba(30, 28, 25, 0.12), 0 6px 16px rgba(30, 28, 25, 0.08);
  --shadow-card: 0 2px 4px rgba(30, 28, 25, 0.12), 0 10px 24px rgba(30, 28, 25, 0.12);
  --radius: 12px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Space Grotesk", "Trebuchet MS", sans-serif;
  color: var(--ink);
  background: var(--bg);
  position: relative;
  overflow-x: hidden;
}

#app {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

h1,
h2,
h3 {
  font-family: "Newsreader", "Georgia", serif;
  font-weight: 700;
  letter-spacing: 0.2px;
  margin-top: 0;
}

h1 {
  font-size: 32px;
  margin-bottom: 6px;
}

h2 {
  font-size: 20px;
  margin-bottom: 8px;
}

p {
  line-height: 1.6;
}

section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(30, 28, 25, 0.08);
}

.topbarInner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  justify-content: center;
}

.tabs {
  display: inline-flex;
  gap: 6px;
  padding: 6px;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
}

.tab {
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  color: var(--muted);
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.tab:hover {
  background: var(--surface-alt);
  color: var(--ink);
  transform: translateY(-1px);
}

.tab.router-link-exact-active {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 6px 12px rgba(210, 109, 84, 0.35);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px 56px;
  animation: pageIn 0.5s ease;
}

.cards {
  display: grid;
  gap: 16px;
  max-width: 780px;
  margin: 0 auto 28px;
}

.clubList {
  list-style: none;
  padding: 0;
  margin: 8px auto 40px;
  max-width: 780px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.clubList a {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 13px;
  transition: border 0.2s ease, transform 0.2s ease;
}

.clubList a:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  box-shadow: var(--shadow-soft);
  max-width: 780px;
  margin: 0 auto;
}

.emptyState {
  color: var(--muted);
}

input,
select {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 10px;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  font-size: 14px;
}

.buttonLike,
button {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 8px 18px;
  font-weight: 600;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(210, 109, 84, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.buttonLike:hover,
button:hover {
  background: var(--accent-strong);
  box-shadow: 0 6px 14px rgba(210, 109, 84, 0.3);
  transform: translateY(-1px);
}

.buttonLike:active,
button:active {
  transform: translateY(0);
  box-shadow: none;
}

.buttonLike:focus-visible,
button:focus-visible {
  outline: 2px solid rgba(210, 109, 84, 0.4);
  outline-offset: 2px;
}

@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 720px) {
  .tabs {
    width: 100%;
    justify-content: space-between;
  }
  .tab {
    flex: 1;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .container,
  .tab {
    animation: none;
    transition: none;
  }
}
</style>
