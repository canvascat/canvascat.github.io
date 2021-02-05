import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/theme'
  },
  {
    path: '/theme',
    name: 'Theme',
    component: () => import('./posts/theme.md')
  },
  {
    path: '/ImageEditor',
    name: 'ImageEditor',
    component: () => import('./components/ImageEditor.vue')
  },
  {
    path: '/CanvasMosaic',
    name: 'CanvasMosaic',
    component: () => import('./components/CanvasMosaic.vue')
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: import('./pages/404.md') }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router
