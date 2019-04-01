const {app, BrowserWindow, Menu, ipcMain} = require('electron');

const url = require ('url');
const path =require ('path');

if(process.env.NODE.ENV !== 'produccion'){
require('electron-reload')(__dirname, {
electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
})
}

let mainWindow
let newProductWindow

app.on('ready', () => {
 mainWindow = new BrowserWindow ({});
 mainWindow.loadURL(url.format({
 	pathname: path.join(__dirname,'views/index.html'),
 	protocol: 'file',
 	slashes: true
 }))

 const mainMenu = Menu.buildFromTemplate(templateMenu);
 Menu.setApplicationMenu(mainMenu);

    mainWindow.on('close', () => {
    app.quit();
    });
});

function createNewPWindow(){
	newProductWindow = new BrowserWindow({
        width: 500,
        height: 400,
        title: 'agregar nuevo producto'
	});
	newProductWindow.setMenu(null);
	newProductWindow.loadURL(url.format({
 	pathname: path.join(__dirname,'views/new-product.html'),
 	protocol: 'file',
 	slashes: true
 }))
	newProductWindow.on('closed', () => {
		 newProductWindow = null;
	});
}

ipcMain.on('product:new', (e, newProduct) => {
 mainWindow.webContents.send('product:new', newProduct);
  newProductWindow.close();
});

const templateMenu = [ 
{
   label: 'File',
   submenu: [
    {
    label: 'New product',
    acelerator: 'Ctrl+N',
    click(){
      createNewPWindow();	
     }	
    },
    {
 	label: 'Remove all products',
 	click() {
    mainWindow.webContents.send('products:remove-all');
 	}
   },
   {
 	label: 'Exit',
 	acelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
    click() {
    	app.quit();
    }
  }
   ]
 }
];

if(process.platform === 'darwin'){ 
  templateMenu.unshift({
     label: app.getName()
   });
}

if(process.env.NODE_ENV !== 'production'){
    templateMenu.push({
    	label: 'DevTools',
    	submenu: [
    	{
         label: 'Show/Hide Dev tools',
         acelerator: 'Ctrl+D',
         click(intem, focusedWindow){
         	focusedWindow.toggleDevTools();
         }
    	},
    	{
    		role: 'reload'
    	}
    	]
    })
	}
