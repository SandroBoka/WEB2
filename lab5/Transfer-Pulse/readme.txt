URL aplikacije: https://transfer-pulse.onrender.com

Zbog zahtjeva na velicinu .zip < 10MB node_modules su maknuti => !!! Za pokretanje prvo npm ci pa zatim npm run dev !!!

Zahtjevi:
- interpolation / one-way binding:
  - src/components/NewsCard.vue:11 i src/components/NewsCard.vue:15 prikazivanje podataka o transferima s interpolacijom
  - src/views/HomeView.vue:11 prikazuje broj s filteredNews.length
  
- two-way binding:
  - src/components/FiltersPanel.vue:3, src/components/FiltersPanel.vue:5, src/components/FiltersPanel.vue:10
  - src/views/StatsView.vue:15 koristenje v-model za selektiranje kluba
  
- methods:
  - src/components/FiltersPanel.vue:34 ima apply() za emitanje selektiranog filtera
  - src/views/HomeView.vue:64 i src/views/HomeView.vue:67 imaju onFiltersChanged() i slug()
  - src/components/NewsCard.vue:53 ima openClub() za navigaciju nakon klika na karticu
  
- computed properties:
  - src/views/HomeView.vue:44 ima filteredNews za filtiranje po pretrazivanju, klubu i tipu transfera
  - src/views/StatsView.vue:73, src/views/StatsView.vue:109, src/views/StatsView.vue:112
  - src/components/NewsCard.vue:44 i src/components/NewsCard.vue:48 za playerName i clubTarget
     
- scoped styles:
  - src/components/NewsCard.vue:62, src/views/StatsView.vue:141, src/views/NotFoundView.vue:9
  
- lifecycle hook:
  - src/App.vue:8 koristi onMounted da ucita podatke u aplikaciju pri pokretanju
  
 - routing:
  - src/router/index.js:14 do :24 definicija ruta, src/App.vue:19 do :27 RouterLink, RouterView
  
- bookmarkable:
  - src/router/index.js:12 koristi createWebHistory, cisti URL-ovi
  
- dynamic routing / dinamičko usmjeravanje:
  - src/router/index.js:18 ruta /clubs/:clubSlug
  - src/views/ClubView.vue:26 i :36 cita slug i filtrira
  
- 404 catch-all:
  - src/router/index.js:24 (/:catchAll(.*))
  - src/views/NotFoundView.vue:1 do src/views/NotFoundView.vue:6
     
- Barem dvije komponente:
  - src/components/NewsCard.vue (kartica za transfer/loan)
  - src/components/FiltersPanel.vue (search i filters)
     
- Komponenta bez stanja s koristenjem properties:
  - src/components/NewsCard.vue:41 prima item i isFav pomocu props i rendera ih
  - Nema lokalnog stanja 
  
- Komponenta s stanjem:
  - src/components/FiltersPanel.vue:25 drzi lokalni data() za search, club, type
  
- Komponenta koja emitara event:
  - src/components/NewsCard.vue:42 i src/components/NewsCard.vue:32 emitaju toggle-fav
  - src/components/FiltersPanel.vue:23 i src/components/FiltersPanel.vue:34 emitaju filters-changed
  
 - Pinia store:
  - src/stores/news.js:4 definira news store, state, getters, actions
  
- Asinkroni dohvat podataka (mocked):
  - src/services/newsService.js:7 daje fetchNewsAsync s kasnjenjem
  - src/stores/news.js:23 i src/stores/news.js:28 koriste refreshNews() da await-aju async poziv