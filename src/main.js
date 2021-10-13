const { app, dialog, BrowserWindow, Menu } = require("electron");
const path = require('path');

require("electron-reload")(__dirname);


let win;
let isDevOpen = false;


const template = [
	{
		label: "File",
		submenu: [
			{
				label: "Open File",
				accelerator: "Control+O",
				click: async () => {
					const { filePaths } = await dialog.showOpenDialog({ 
						properties: ['openFile'] 
					});
					const filePath = filePaths[0];
					win.webContents.send("openFile", filePath);
				}
			},
			{
				label: "Save File",
				accelerator: "Control+S",
				click: () => {
					win.webContents.send("saveFile");
				}
			},
			{
				label: "Fullscreen",
				accelerator: "Control+F",
				click: () => {
					win.setFullScreen(!win.isFullScreen());
				}
			},
			{
				label: "DevTools",
				accelerator: "Control+D",
				click: () => {
					if (isDevOpen) {
						win.webContents.openDevTools();
					} else {
						win.webContents.closeDevTools();
					}
					isDevOpen = !isDevOpen;
				}
			},
			{
				label: "Quit",
				accelerator: 'Escape',
				click: () => { app.quit(); }
			}
		]
	}
];


const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


function createWindow () {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
		}
	});
	win.loadFile('index.html');
}


app.whenReady().then(() => {
	createWindow();

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	});
});


app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});
