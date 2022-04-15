import {defineStore} from 'pinia'
import {join} from 'path'
import * as fs from 'fs'

const exeDir = process.cwd()
const localStateDir = join(exeDir, 'localState')
const settingsPath = join(localStateDir, 'settings.json')

const getSettings = () => {
  return readSettings()
}

const setSettings = (settings, okCallback, errCallback) => {
  writeSettings(settings, okCallback, errCallback)
}

const useSettings = defineStore('settings', {
  state: () => ({
    settings: getSettings(),
  }),
  actions: {
    save(data): Promise<any> {
      const self = this
      return new Promise<any>((resolve, reject) => {
        self.settings = data
        setSettings(data, () => {
          resolve(null)
        }, err => {
          reject(err)
        })
      })
    },
  },
})

const readSettings = () => {
  const data = fs.readFileSync(settingsPath, 'utf-8')
  return JSON.parse(data)
}


const writeSettings = (data, okCallback, errCallback) => {
  if (!fs.existsSync(localStateDir)) {
    fs.mkdirSync(localStateDir, {mode: 0o777})
  }
  // 说明配置文件不存在
  fs.writeFile(settingsPath, JSON.stringify(data, null, 2), {encoding: 'utf-8', mode: 0o777}, err => {
    if (err && errCallback) {
      errCallback(err)
      return
    }

    okCallback()
  })
}

export {useSettings}
