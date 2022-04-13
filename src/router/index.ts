import {createRouter, createWebHashHistory} from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import Index from '@/views/index/Index.vue'

NProgress.configure({showSpinner: false})

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'index',
      path: '/',
      component: Index,
    },
  ],
})

/**
 * 路由跳转前的配置
 */
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

/**
 * 路由跳转后的配置
 */
router.afterEach(() => {
  NProgress.done()
})

export default router
