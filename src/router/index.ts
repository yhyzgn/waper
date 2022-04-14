import {createRouter, createWebHashHistory} from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import Index from '@/views/index/Index.vue'
import Online from '@/views/online/Index.vue'
import Collection from '@/views/collection/Index.vue'
import Local from '@/views/local/Index.vue'
import Download from '@/views/download/Index.vue'
import Setting from '@/views/setting/Index.vue'
import About from '@/views/about/Index.vue'

NProgress.configure({showSpinner: false})

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'index',
      path: '/',
      component: Index,
      redirect: '/online',
      children: [
        {
          name: 'wl-online',
          path: '/online',
          component: Online,
        },
        {
          name: 'wl-collection',
          path: '/collection',
          component: Collection,
        },
        {
          name: 'wl-local',
          path: '/local',
          component: Local,
        },
        {
          name: 'wl-download',
          path: '/download',
          component: Download,
        },
        {
          name: 'mr-setting',
          path: '/setting',
          component: Setting,
        },
        {
          name: 'mr-about',
          path: '/about',
          component: About,
        },
      ],
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
