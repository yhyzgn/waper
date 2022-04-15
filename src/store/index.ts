import {createPinia} from 'pinia'
import {useSettings} from '@/store/settings'

const store = createPinia()

export {
  store,
  useSettings,
}
