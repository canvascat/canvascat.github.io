import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import DemoBlock from '@/components/demo-block.vue'
import 'element-plus/lib/theme-chalk/index.css'
import '@/assets/styles/common.scss'
import '@/assets/styles/page.scss'
import '@/assets/styles/post.scss'
import '@/assets/styles/theme-dark.scss'

const app = createApp(App)
app.component(DemoBlock.name, DemoBlock)
app.use(router);
app.use(ElementPlus)
app.mount('#app')
