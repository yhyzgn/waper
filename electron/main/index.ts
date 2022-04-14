import {join} from 'path'
import {app, BrowserWindow, ipcMain, protocol, screen} from 'electron'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {scheme: 'app', privileges: {secure: true, standard: true}},
])

const title = `${app.getName()} ${app.getVersion()}`

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
  loading.loadFile('../preload/loading.html').then(() => {
  }).catch(err => {
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
    focusable: true,
    title: title,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  loadFor(main)

  main.setMenuBarVisibility(false)
  main.setMenu(null)

  ipcMain.on('menu-selected', (e, arg) => {
    // arg 为当前选中的菜单项
    main.title = `${title} ${arg.name}`
  })

  ipcMain.on('on-window-top', (e, arg) => {
    main.focus()
  })

  main.on('closed', () => {
    main = null
  })

  main.once('ready-to-show', () => {
    main.show()
    // 标题
    main.title = title

    main.webContents.openDevTools()
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
  if (BrowserWindow.getAllWindows().length === 0) {
    main === null ? showMainWindow() : main.show()
  }
})

app.whenReady().then(showLoadingWindow)
