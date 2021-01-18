import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import 'element-plus/lib/theme-chalk/index.css';
import './assets/common.styl'

const app = createApp(App).use(router).use(ElementPlus)
app.mount('#app')
