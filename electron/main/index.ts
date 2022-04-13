import {join} from 'path'
import {app, BrowserWindow, ipcMain, screen} from 'electron'

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
      contextIsolation: false,
      nodeIntegration: true,
      preload: join(__dirname, '../preload/index.js'),
    },
  })
  loadFor(loading)

  loading.show()
}

const showMainWindow = () => {
  let size = screen.getPrimaryDisplay().workAreaSize
  let width = parseInt(String(size.width * 0.66))
  let height = parseInt(String(size.height * 0.66))

  main = new BrowserWindow({
    frame: true,
    show: false,
    width: width,
    height: height,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  })
  loadFor(main)

  ipcMain.on('on-window-top', (res) => {
    main.focus()
  })

  main.on('closed', () => {
    main = null
  })

  main.once('ready-to-show', () => {
    main.show()
    loading.hide()
    loading.close()
    loading = null
  })
}

const loadFor = (win: BrowserWindow) => {
  const promise = app.isPackaged ? win.loadFile(join(__dirname, '../../index.html')) : win.loadURL(`http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`)
  promise.then(r => {
    console.log('page loaded.')
  }).catch(err => {
    console.error(err)
  })
}

ipcMain.on('loading-finished', (e, arg) => {
  showMainWindow()
})

app.on('window-all-closed', () => {
  loading = null
  main = null

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (main === null) {
    showMainWindow()
  }
})

app.whenReady().then(showLoadingWindow)
