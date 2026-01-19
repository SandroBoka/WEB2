<template>
  <section>
    <h1>404</h1>
    <p>Path <strong>{{ $route.params.catchAll }}</strong> does not exist.</p>
    <RouterLink to="/" class="buttonLike backButton">Back to feed</RouterLink>
  </section>
</template>

<style scoped>
.backButton {
  align-self: flex-start;
}
</style>
