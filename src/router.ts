import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/CanvasMosaic'
  },
  {
    path: '/ImageEditor',
    name: 'ImageEditor',
    component: () => import('./components/ImageEditor.vue')
  },
  {
    path: '/HelloWorld',
    name: 'HelloWorld',
    component: () => import('./components/HelloWorld.vue')
  },
  {
    path: '/CanvasMosaic',
    name: 'CanvasMosaic',
    component: () => import('./components/CanvasMosaic.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router
