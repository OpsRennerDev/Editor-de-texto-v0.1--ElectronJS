const {ipcRenderer} = require('electron');

const textarea = document.getElementById('edit');
const title = document.getElementById('title');

ipcRenderer.on('set-file', function(event,data){
  textarea.value = data.content;
  title.innerHTML = data.name + ' | Editor'
});

function handleChange(){
  ipcRenderer.send('update-content', textarea.value);
}
function mudarTamanho(){
  var tamanho1 = document.getElementById('tamanho').value;
  document.getElementById('edit').style.fontSize = tamanho1+"px";
}
function mudarFonte(){
  var fonte = document.getElementById('trocaFonte').value;
  document.getElementById('edit').style.fontFamily = fonte;
}
function mudarBotao1(){
  var x = document.getElementById('edit');
  x.classList.toggle('negrito1')
}
function mudarBotao2(){
  var x = document.getElementById('edit');
  x.classList.toggle('italic1');
}
function mudarBotao3(){
 var x = document.getElementById('edit');
 x.classList.toggle('subli1');
}
function mudarBotao4(){
  textarea.value = "";
}
function mudarBotao5(){
  var x = document.getElementById('edit');
  x.classList.toggle('centra');
}