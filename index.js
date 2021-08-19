//DevRobh and HickDev
//Requisições
const {app, BrowserWindow, Menu, dialog, ipcMain} = require("electron");
const  fs  = require("fs");
const path = require("path");

let mainWindow = null;//Variável Janela
async function createWindow(){ // Função de Criar janela
  mainWindow = new BrowserWindow({
    width:800,
    height:600,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  await mainWindow.loadFile('./src/pages/edit/index.html'); //Abrir HTML nessa janela
  //mainWindow.webContents.openDevTools();
  createNewFile();//Criar novo arquivo
  ipcMain.on('update-content', function(event,data){ // receber conteudo do arquivo
    file.content = data;
  });
}
var file = {};//variavel arquivo
function createNewFile(){//função criar novo arquivo
  file = {//array de arquivos
    name:'novo-arquivo.txt',
    content: '',
    saved: false,
    path: app.getPath('documents')+'/novo-arquivo.txt'
  };
  mainWindow.webContents.send('set-file', file);//mandar esse array para o jS renderer
}
//validação
function writeFile(filePath){ //Escreve o arquivo na hora de salvar
  try{
    fs.writeFile(filePath, file.content, function(error){
      if(error) throw error;
      file.path = filePath;
      file.saved = true;
      file.name = path.basename(filePath);

      mainWindow.webContents.send('set-file',file);
    })
  }catch(e){//se der error
    console.log(e)
  }
}
async function saveFileAs(){//função de salvar como 
  let dialogFile = await dialog.showSaveDialog({//caixa de dialogo do windows
    defaultPath: file.path
  });
  if(dialogFile.canceled){//caso seja cancelado
    return false;
  }
  writeFile(dialogFile.filePath);//se não escreva o arquivo
}
function saveFile(){//função de salvar
  if(file.saved){//arquivo ja for salvo retorna função de escrever arquivo
    return writeFile(file.path);
  }
  return saveFileAs();//se não ele salva
}
//validação
function readFile(filePath){//ler aquivo
  try{//ler e trazer o conteudo do arquivo
    return fs.readFileSync(filePath,'utf8')
  }catch(e){//error
    console.log(e);
    return '';
  }
}
async function openFile(){//função de abrir o arquivo
  let dialogFile = await dialog.showOpenDialog({//abre caixa de dialogo do windows
    defaultPath: file.path
  });
  if(dialogFile.canceled) return false;//se for cancelado
  file = {//novo arquivo com nome do novo
    name: path.basename(dialogFile.filePaths[0]),
    content: readFile(dialogFile.filePaths[0]),
    saved:true,
    path: dialogFile.filePaths[0]
  }
  mainWindow.webContents.send('set-file', file);//manda arquivos
}
//menu
const templateMenu = [
  {
    label:'Arquivo',
    submenu:[
      {
        label:'Novo',
        accelerator:'CmdOrCtrl+N',
        click(){
          createNewFile();
        }
      },
      {
        label:'Abrir',
        accelerator:'CmdOrCtrl+O',
        click(){
          openFile();
        }
      },
      {
        label:'Salvar',
        accelerator:'CmdOrCtrl+S',
        click(){
          saveFile();
        }
      },
      {
        label:'Salvar como',
        accelerator:'CmdOrCtrl+Shift+S',
        click(){
          saveFileAs();
        }
      },
      {
        label:'Fechar',
        role:process.platform === 'darwin' ? 'close':'quit'
      }
    ]
  }
];
//cria o menu
const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);
//criar a aplicação
app.whenReady().then(createWindow);
//valida se for para mac
app.on('activate', () => {
  if(BrowserWindow.getAllWindows().lenght === 0){
    createWindow();
  }
});