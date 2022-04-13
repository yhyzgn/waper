import {useLoading} from './loading'
import {ipcRenderer} from 'electron'

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const {appendLoading} = useLoading()
domReady().then(() => {
  appendLoading()

  // 倒计时模拟记载
  setTimeout(() => {
    ipcRenderer.send('loading-finished', {
      msg: 'Loading finished.'
    })
  }, 3000)
})
