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
  --bg: #f5f1ea;
  --surface: #fffdf9;
  --surface-alt: #f7efe4;
  --ink: #1f1c16;
  --muted: #6f675e;
  --accent: #e07a5f;
  --accent-strong: #c65f47;
  --accent-cool: #2f5d62;
  --border: #e6ddd1;
  --shadow-soft: 0 10px 22px rgba(31, 28, 22, 0.08);
  --shadow-card: 0 16px 34px rgba(31, 28, 22, 0.12);
  --radius: 16px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Space Grotesk", "Trebuchet MS", sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #f7f3ec 0%, #efe7db 100%);
  position: relative;
  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background:
    radial-gradient(520px 380px at 8% 10%, rgba(224, 122, 95, 0.16), transparent 60%),
    radial-gradient(520px 380px at 92% 12%, rgba(47, 93, 98, 0.14), transparent 60%),
    radial-gradient(540px 400px at 82% 90%, rgba(244, 162, 97, 0.16), transparent 60%);
  pointer-events: none;
  z-index: 0;
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
  backdrop-filter: blur(8px);
  background: rgba(245, 241, 234, 0.9);
  border-bottom: 1px solid var(--border);
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
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
}

.tab {
  padding: 8px 16px;
  border-radius: 999px;
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
  box-shadow: 0 8px 18px rgba(224, 122, 95, 0.3);
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

button {
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 600;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

button:hover {
  background: var(--accent-strong);
  box-shadow: 0 10px 18px rgba(224, 122, 95, 0.3);
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
  box-shadow: none;
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
