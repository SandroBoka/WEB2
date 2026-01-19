<template>
  <section>
    <h1>404</h1>
    <p>Path <strong>{{ $route.params.catchAll }}</strong> does not exist.</p>
    <RouterLink to="/">Back to feed</RouterLink>
  </section>
</template>
