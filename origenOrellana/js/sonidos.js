const sonidoBoton = new Audio('../sonidos/btn.mp3');
const botonIniciar = document.getElementById('btnIniciar')


botonIniciar.addEventListener('click', playBotonSonido);

function playBotonSonido(){
  sonidoBoton.currentTime = 0;
  sonidoBoton.play();
}