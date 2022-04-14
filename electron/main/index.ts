import {join} from 'path'
import {app, BrowserWindow, ipcMain, screen} from 'electron'
import * as fs from 'fs'
import settings from './settings'

const title = `${app.getName()} ${app.getVersion()}`
const homeDir = app.getPath('home')
const appHomePath = join(homeDir, '.waper')
const settingsPath = join(appHomePath, 'settings.json')

let loading: BrowserWindow
let main: BrowserWindow

const showLoadingWindow = cb => {
  loading = new BrowserWindow({
    frame: false,
    transparent: true,
    maximizable: false,
    show: false,
    width: 320,
    height: 320,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  // 加载 loading.html
  const promise = app.isPackaged ? loading.loadFile(join(__dirname, '../../loading.html')) : loading.loadFile(join(__dirname, '../../../../public/loading.html'))
  promise.then(r => {
    console.log('page loaded.')
  }).catch(err => {
    console.error(err)
  })

  loading.setMenuBarVisibility(false)
  loading.setMenu(null)

  loading.show()
}

const showMainWindow = () => {
  let size = screen.getPrimaryDisplay().workAreaSize
  let width = parseInt(String(size.width * 0.88))
  let height = parseInt(String(size.height * 0.88))

  main = new BrowserWindow({
    frame: true,
    show: false,
    width: width,
    height: height,
    minWidth: width,
    minHeight: height,
    focusable: true,
    title: title,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  main.setMenuBarVisibility(false)
  main.setMenu(null)

  let mainTitle = title

  ipcMain.on('menu-selected', (e, arg) => {
    // arg 为当前选中的菜单项
    mainTitle = `${title} ${arg.name}`
    main.title = mainTitle
  })

  ipcMain.on('on-window-top', (e, arg) => {
    main.focus()
  })

  main.on('show', e => {
    // 标题
    main.title = mainTitle

    // 开发者模式
    main.webContents.openDevTools()
  })

  main.on('closed', () => {
    // main = null
  })

  loadFor(main)

  main.once('ready-to-show', () => {
    main.show()

    loading.hide()
    loading.close()
    loading = null
  })
}

const loadFor = (win: BrowserWindow) => {
  const promise = app.isPackaged ? win.loadFile(join(__dirname, '../../index.html')) : win.loadURL(`http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/`)
  promise.then(r => {
    console.log('page loaded.')
  }).catch(err => {
    console.error(err)
  })
}

ipcMain.on('read-settings', (e, arg) => {
  fs.readFile(settingsPath, 'utf-8', (err, data) => {
    if (err) {
      e.sender.send('error', '配置文件读取失败' + err)
      return
    }
    const settingsContent = JSON.parse(data)
    e.sender.send('on-settings-read', settingsContent)
  })
})

ipcMain.on('on-loading-started', (e, arg) => {
  // 加载时检查本地配置文件是否存在，不存在则新建一个
  if (fs.existsSync(settingsPath)) {
    // 显示主窗口
    showMainWindow()
    return
  }

  if (!fs.existsSync(appHomePath)) {
    fs.mkdirSync(appHomePath, {mode: 0o777})
  }
  // 说明配置文件不存在
  fs.writeFile(settingsPath, JSON.stringify(settings), {encoding: 'utf-8', mode: 0o777}, wer => {
    if (wer) {
      loading.webContents.send('error', '配置文件创建出错啦')
      return
    }
    // 显示主窗口
    showMainWindow()
  })
})

app.on('window-all-closed', () => {
  loading = null
  main = null

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    main === null ? showMainWindow() : main.show()
  }
})

app.whenReady().then(showLoadingWindow)
