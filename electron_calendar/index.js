const { app, BrowserWindow, Menu } = require('electron')
//const remote = require('@electron/remote/main')
const ipc = require('electron').ipcMain;
const path = require('path')
const fs = require('fs')

var calendarWnd;
let mainWnd;
function createWindow () {
    mainWnd = new BrowserWindow({
      width: 1000,
      height: 1000,
      webPreferences:{
          nodeIntegration:true,
          contextIsolation:false,
        //  enableRemoteModule:true,
      },
    })
    Menu.setApplicationMenu(null)
    mainWnd.loadFile('index.html')
    // remote.initialize()
    // remote.enable(win.webContents)
    // 打开开发者工具
    mainWnd.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipc.on('createCalenderWindow', function(event){
    //event.sender.send('actionReply', result);
    if(calendarWnd){
        calendarWnd.show();
        return
    }
    createCalenderWindow();
});

function createCalenderWindow(){
    calendarWnd = new BrowserWindow({
      height: 600,
      width: 800,
      webPreferences:{
        nodeIntegration:true,
        contextIsolation:false,
      //  enableRemoteModule:true,
    },
    });
    calendarWnd.loadFile('./sub_wnd/calender.html');
    calendarWnd.on('closed', function (event) {
        calendarWnd = null;
    });
    // 打开开发者工具
    calendarWnd.webContents.openDevTools()
}

ipc.on('reqSendShowDate',function(event)
{   
    ipc.once('syncShowDate',function(e,newDate){
        console.log('syncShowDate ',newDate)
        //mainWnd.webContents.send('sendCalenderShowDate',newDate);
        event.sender.send('sendCalenderShowDate',newDate);
    })
    console.log('reqSendShowDate')
    mainWnd.webContents.send('reqSendShowDate')
})

ipc.on('onChooseDate',function(e,date){
    mainWnd.webContents.send('changeShowData',date);
    if(calendarWnd){
        calendarWnd.close();
    }
})

ipc.on('saveImgAction',function(e,base64Data,fileName,date){
    //设置保存路径
    const fileDir = path.join(app.getAppPath(), '/img/');
    if(!checkDirAndMk(fileDir)){
        return;
    }
    let str = '/' + date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString() + '/';
    const dayDir = path.join(fileDir,str);
    if(!checkDirAndMk(dayDir)){
        return;
    };
    const filePath = path.join(dayDir, `${fileName}`);
    console.log(filePath)
    const nD = Buffer.from(base64Data,'base64');
    fs.writeFile(filePath, nD,
        function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("save success!");   
    }});
});

function checkDirAndMk(dir){
    if(!fs.existsSync(dir)){
        fs.mkdir(dir, function(err){
            if (err) {
                console.log('mkdir err:'+ err)
                return false;
            }
            else{
                console.log('New Directory Created')
            }
        })
    }
    return true;
}

