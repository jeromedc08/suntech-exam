import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import 'normalize.css'
import '@/assets/main.scss'
import '@progress/kendo-theme-default/dist/all.css'

createApp(App).use(router).mount('#app')
