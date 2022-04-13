import {createApp} from 'vue'
import App from './App.vue'
import router from '@/router'
import {store} from '@/store'
import Components from '@/components'

import ElementPlus from 'element-plus'
import * as ElIcon from '@element-plus/icons-vue'

const app = createApp(App)
  .use(router)
  .use(store)
  .use(ElementPlus)
  .use(Components)

for (let icon in ElIcon) {
  app.component(ElIcon[icon].name, ElIcon[icon])
}

app
  .mount('#app')
  .$nextTick(window['removeLoading'])
