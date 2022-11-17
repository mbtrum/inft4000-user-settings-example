const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

const settingsFilePath = app.getPath('userData') + '\\settings.json'

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')

    return win
}

// Get the user settings file contents. If file does not exist, create it and return blank
function getUserSettings() {
    let data = ""

    if (fs.existsSync(settingsFilePath)) {
        data = fs.readFileSync(settingsFilePath)
        data = data.toString('utf8')
        console.log("data" + data)
    }
    else {
        fs.writeFileSync(settingsFilePath, "")
    }

    return data
}

function saveSettings(json) {
    fs.writeFile(settingsFilePath, json, function (err) {
        if (err) throw err;
        console.log('User settings saved.')
    })
}

function handleFolderOpen() {
    let folders = dialog.showOpenDialogSync({
        properties: ['openDirectory']
    })

    return folders[0]
}

app.whenReady().then(() => {
    const mainWindow = createWindow()

    let strSettings = getUserSettings()
    
    if (strSettings !== "") {

        const objSettings = JSON.parse(strSettings)

        mainWindow.webContents.once('dom-ready', () => {
            mainWindow.webContents.send('user-settings', objSettings.MusicFolder)
        })
    }

    ipcMain.handle('dialog:openFolder', handleFolderOpen)

    ipcMain.on('save-settings', (event, strPath) => {
        const newSettings = {
            MusicFolder: strPath
        }
        saveSettings(JSON.stringify(newSettings))
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
