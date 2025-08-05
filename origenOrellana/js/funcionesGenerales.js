let contenedorControles = document.getElementById('controles');
let titulo = document.getElementById('tituloControles');

titulo.addEventListener('click', moverControles);

function moverControles() {
    if (contenedorControles.classList.contains('abierto')) {
        contenedorControles.classList.remove('abierto'); 
    } else {
        contenedorControles.classList.add('abierto'); 
    }
};

let totalSeconds = 0; 

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

function updateTimer() {
    totalSeconds++;
    document.getElementById('time').textContent = formatTime(totalSeconds);
}

document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateTimer, 1000);
});