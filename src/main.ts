import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import phila-ui-core CSS for design system variables and button styles
// import '@phila/phila-ui-core/dist/styles/variables.css'
// import '@phila/phila-ui-core/dist/styles/light-mode.css'
// import '@phila/phila-ui-core/dist/styles/elements/buttons.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
