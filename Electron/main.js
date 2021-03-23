const { app, BrowserWindow, net, dialog } = require('electron')

if (require('electron-squirrel-startup')) return app.quit();

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './Iconlogo.png',
    webPreferences: {
      nodeIntegration: false,
	    devTools: false
    }
  })
  win.maximize()
  win.setMenu(null)
  win.setMaximizable(false);

  win.loadFile('index.html')

  const request = net.request("https://github.com/invlabz/phylab_supportfiles/releases/latest"); 
  request.on('redirect', (statusCode, method, redirectUrl, responseHeaders) => { 
    console.log(`HEADERS: ${redirectUrl}`); 
    console.log(redirectUrl.split("/v")[1])
    const pkg = require('./package.json')
    console.log(pkg.version);
	const vr = redirectUrl.split("/v")[1];
    if ( vr !== pkg.version)
    {
      const dialogOpts = {
        type: 'info',
        buttons: ['Download', 'Later'],
        title: 'Application Update',
        message: `Version `,
        detail: `A new version ${vr} is available. It is highly recommend to install new version.`
      }

      dialog.showMessageBox(dialogOpts).then(({ response }) => {
        if (response === 0) {
          require("electron").shell.openExternal("https://github.com/invlabz/phylab_supportfiles/releases/latest/download/PhyLabSetup.exe").then(() => {
            app.exit(0)
          });
        }
      })
    }
    
    }); 
  request.end();
//   win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
