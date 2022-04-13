import {App} from 'vue'

import Icon from './Icon.vue'

export default {
  install(app: App): void {
    app.component('Icon', Icon)
  },
}
