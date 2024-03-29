import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { db } from '@/lib'
import { IonicVue } from '@ionic/vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/display.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'

/* Theme variables */
import './theme/variables.scss'

import 'mapbox-gl/dist/mapbox-gl.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia)
  .provide('db', db)

router.isReady().then(() => {
  app.mount('#app')
})

// Use matchMedia to check the user preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

toggleDarkTheme(prefersDark.matches)

// Listen for changes to the prefers-color-scheme media query
prefersDark.addEventListener('change', (mediaQuery) =>
  toggleDarkTheme(mediaQuery.matches)
)

// Add or remove the "dark" class based on if the media query matches
function toggleDarkTheme(shouldAdd: boolean) {
  document.body.classList.toggle('dark', shouldAdd)
}
