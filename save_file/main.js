const { app, BrowserWindow } = require('electron')
let win
function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation:false,  //  把这一项加上错误就会消失
      enableRemoteModule:true,
    }
  })
  // 加载index.html文件
  win.loadFile('index.html')
  // 打开开发者工具
  win.webContents.openDevTools()
  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
  require('@electron/remote/main').initialize()
  require("@electron/remote/main").enable(win.webContents)
}
// Electron 会在初始化后并准备
app.on('ready', createWindow)
// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (win === null) {
      createWindow()
  }
})