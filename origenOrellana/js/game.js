const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

const fondo = new Image();
fondo.src = "../imgs/mapa_uno.png";

// Personaje: Kevin
const kevin = {
  x: 50,
  y: canvas.height - 80,
  width: 40,
  height: 80,
  vx: 0,
  vy: 0,
  onGround: false,
  facing: "right",
  walkFrame: 0,
  frameCounter: 0,
  imgRight: new Image(),
  imgLeft: new Image(),
  imgJumpRight: new Image(),
  imgJumpLeft: new Image(),
  imgFront: new Image(),
};

kevin.imgRight.src = "../imgs/kevin_derecha.png";
kevin.imgLeft.src = "../imgs/kevin_izquierda.png";
kevin.imgJumpRight.src = "../imgs/kevin_salto_derecha.png";
kevin.imgJumpLeft.src = "../imgs/kevin_salto_izquierda.png";
kevin.imgFront.src = "../imgs/kevin_frente.png";

// Personaje: Samantha
const samantha = {
  x: 80,
  y: canvas.height - 80,
  width: 40,
  height: 75,
  vx: 0,
  vy: 0,
  onGround: false,
  facing: "right",
  walkFrame: 0,
  frameCounter: 0,
  imgRight: new Image(),
  imgLeft: new Image(),
  imgJumpRight: new Image(),
  imgJumpLeft: new Image(),
  imgFront: new Image(),
};

samantha.imgRight.src = "../imgs/samantha_derecha.png";
samantha.imgLeft.src = "../imgs/samantha_izquierda.png";
samantha.imgJumpRight.src = "../imgs/samantha_salto_derecha.png";
samantha.imgJumpLeft.src = "../imgs/samantha_salto_izquierda.png";
samantha.imgFront.src = "../imgs/samantha_frente.png";

// boton
const botonImagen = new Image();
botonImagen.src = "../imgs/boton.png";

const botonPresionadoImagen = new Image();
botonPresionadoImagen.src = "../imgs/boton_presionado.png";

// Puas
const puaImagen = new Image();
puaImagen.src = "../imgs/puas.png"; // Ruta relativa a tu carpeta de imágenes

// Pared
const pared = { 
  x: 150, 
  y: 220, 
  width: 30, 
  height: 200 
};

//Plataforma
const plataformas = [
  // Plataformas iniciales
  { x: 0, y: 350, width: 50, height: 20 },
  { x: 100, y: 290, width: 50, height: 20 },
  { x: 150, y: 220, width: 30, height: 20 },
  // Primer Reto
  { x: 240, y: 150, width: 70, height: 20 },
  { x: 365, y: 180, width: 30, height: 20 },
  { x: 440, y: 140, width: 40, height: 20 },
  { x: 552, y: 100, width: 60, height: 20 },
  { x: 690, y: 140, width: 55, height: 20 },
  { x: 820, y: 110, width: 40, height: 20 },

  // Segundo Reto
  { x: 180, y: 350, width: 130, height: 20 },
  { x: 365, y: 300, width: 30, height: 20 },
  { x: 460, y: 280, width: 20, height: 20 },
  { x: 552, y: 290, width: 50, height: 20 },
];

// Barreras
const barreras = [
  {
    x: 552,
    y: 40,
    width: 20,
    height: 60,
    visible: true,
    controladoPor: 0, // índice del botón que la controla
  },
];

// Botones
const botones = [
  { x: 564, y: 268, width: 30, height: 40, activo: false },
  { x: 826, y: 90, width: 30, height: 40, activo: false },
];

// Puas
const puas = [
  { x: 315, y: 350, width: 50, height: 50 },
  { x: 400, y: 350, width: 60, height: 50 },
  { x: 490, y: 350, width: 60, height: 50 },
  { x: 400, y: 350, width: 60, height: 50 },
  { x: 610, y: 345, width: 120, height: 60 },
  { x: 730, y: 345, width: 120, height: 60 },
];

// plataformas dinamicas
const plataformasDinamicas = [
  {
    x: 650,
    y: 300,
    width: 80,
    height: 20,
    visible: false,
    controladoPor: 1, // índice del botón que la controla
  },
  {
    x: 780,
    y: 300,
    width: 80,
    height: 20,
    visible: false,
    controladoPor: 1, // índice del botón que la controla
  },
];




// Controles
const keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Físicas
const gravity = 1;
const floorY = canvas.height - 80;

// Actualizar personajes
function updateCharacter(c, leftKey, rightKey, jumpKey) {
  if (keys[leftKey]) {
    c.vx = -1.8;
    c.facing = "left";
  } else if (keys[rightKey]) {
    c.vx = 1.8;
    c.facing = "right";
  } else {
    c.vx = 0;
  }

  if (keys[jumpKey] && c.onGround) {
    c.vy = -15;
    c.onGround = false;
  }

  c.vy += gravity;
  c.x += c.vx;
  c.y += c.vy;

  // Límite inferior (piso)
  if (c.y + c.height >= floorY) {
    c.y = floorY - c.height;
    c.vy = 0;
    c.onGround = true;
  }

  // Limitar movimiento horizontal al canvas
  if (c.x < 0) c.x = 0;
  if (c.x + c.width > canvas.width) c.x = canvas.width - c.width;

  // Animación caminar
  if (c.vx !== 0 && c.onGround) {
    c.frameCounter++;
    if (c.frameCounter % 10 === 0) {
      c.walkFrame = 1 - c.walkFrame;
    }
  } else {
    c.walkFrame = 0;
    c.frameCounter = 0;
  }
}

// Manejar colision con pared
function manejarColisionConPared(c) {
  const encimaDePared = c.y + c.height <= pared.y + 1;

  const chocaX = c.x + c.width > pared.x && c.x < pared.x + pared.width;
  const chocaY = c.y + c.height > pared.y && c.y < pared.y + pared.height;

  // Solo bloquear si no está encima
  if (chocaX && chocaY && !encimaDePared) {
    if (c.vx > 0) {
      c.x = pared.x - c.width;
    } else if (c.vx < 0) {
      c.x = pared.x + pared.width;
    }
    c.vx = 0;
  }
}


// Manejar colision en plataforma
function manejarColisionConPlataforma(personaje) {
  personaje.onGround = false;

  [...plataformas, ...plataformasDinamicas.filter(p => p.visible)].forEach((p) => {
    const px = personaje.x;
    const py = personaje.y;
    const pw = personaje.width;
    const ph = personaje.height;

    const enRangoX = px + pw > p.x && px < p.x + p.width;
    const caeDesdeArriba = py + ph <= p.y + 5 && py + ph + personaje.vy >= p.y;

    if (enRangoX && caeDesdeArriba) {
      personaje.y = p.y - ph;
      personaje.vy = 0;
      personaje.onGround = true;
    }
  });

  // Piso
  if (personaje.y + personaje.height >= floorY) {
    personaje.y = floorY - personaje.height;
    personaje.vy = 0;
    personaje.onGround = true;
  }
}


  // Manejar colision en barrera
  function manejarColisionConBarreras(c) {
  barreras.forEach((barrera) => {
    if (!barrera.visible) return;

    const chocaX = c.x + c.width > barrera.x && c.x < barrera.x + barrera.width;
    const chocaY = c.y + c.height > barrera.y && c.y < barrera.y + barrera.height;

    const encima = c.y + c.height <= barrera.y + 1;

    if (chocaX && chocaY && !encima) {
      if (c.vx > 0) {
        c.x = barrera.x - c.width;
      } else if (c.vx < 0) {
        c.x = barrera.x + barrera.width;
      }
      c.vx = 0;
    }
  });
}


// Dibujar botones
function dibujarBotones() {
  botones.forEach((boton) => {
    const imagen = boton.activo ? botonPresionadoImagen : botonImagen;
    ctx.drawImage(imagen, boton.x, boton.y, boton.width, boton.height);
  });
}

// Dibujar Puas
function dibujarPuas() {
  puas.forEach(pua => {
    ctx.drawImage(puaImagen, pua.x, pua.y, pua.width, pua.height);
  });
}



  //Verificar botones
  function verificarBotones(personaje) {
  botones.forEach((boton) => {
    const sobreX = personaje.x + personaje.width > boton.x && personaje.x < boton.x + boton.width;
    const sobreY = personaje.y + personaje.height >= boton.y && personaje.y + personaje.height <= boton.y + boton.height + 10;

    if (sobreX && sobreY) {
      boton.activo = true;
    }
  });
}

// Verificar Puas
function verificarPuas(personaje) {
  puas.forEach(pua => {
    const chocaX = personaje.x + personaje.width > pua.x && personaje.x < pua.x + pua.width;
    const chocaY = personaje.y + personaje.height > pua.y && personaje.y < pua.y + pua.height;

    if (chocaX && chocaY) {
      personaje.x = 50;
      personaje.y = canvas.height - personaje.height;
      personaje.vx = 0;
      personaje.vy = 0;
    }
  });
}

// Dibujar barreras
function dibujarBarreras() {
  ctx.fillStyle = "#223";
  barreras.forEach(barrera => {
    if (barrera.visible) {
      ctx.fillRect(barrera.x, barrera.y, barrera.width, barrera.height);
    }
  });
}

// Dibujar plataformas dinámicas
plataformasDinamicas.forEach((p) => {
  if (p.visible) {
    ctx.fillStyle = "#777"; // puedes cambiar el color
    ctx.fillRect(p.x, p.y, p.width, p.height);
  }
});


// Mover barreras con botón 
function actualizarBarreras() {
  barreras.forEach((barrera) => {
    const boton = botones[barrera.controladoPor];
    if (boton && boton.activo) {
      barrera.visible = false;
    } else {
      barrera.visible = true;
    }
  });
}

// Actualizar plataformas con boton
function actualizarPlataformasDinamicas() {
  plataformasDinamicas.forEach((plat) => {
    const boton = botones[plat.controladoPor];
    plat.visible = boton && boton.activo;
  });
}




// Dibujar personaje
function drawCharacter(c) {
  let img;
  if (!c.onGround) {
    img = c.facing === "right" ? c.imgJumpRight : c.imgJumpLeft;
  } else if (c.vx !== 0) {
    img = c.walkFrame === 0
      ? (c.facing === "right" ? c.imgRight : c.imgLeft)
      : c.imgFront;
  } else {
    img = c.imgFront;
  }
  ctx.drawImage(img, c.x, c.y, c.width, c.height);
}

// Loop principal
function loop() {
  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar el fondo
  ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

  // Actualizar movimiento de personajes
  updateCharacter(kevin, 'a', 'd', 'w');
  updateCharacter(samantha, 'ArrowLeft', 'ArrowRight', 'ArrowUp');

  // Verificar botones (reiniciar y detectar si hay personajes encima)
  botones.forEach((b) => (b.activo = false));
  verificarBotones(kevin);
  verificarBotones(samantha);

  // Actualizar estado de las barreras y plataformas dinámicas según botones
  actualizarBarreras();
  actualizarPlataformasDinamicas();

  // Colisiones con pared
  manejarColisionConPared(kevin);
  manejarColisionConPared(samantha);

  // Colisiones con plataformas (fijas + dinámicas)
  manejarColisionConPlataforma(kevin);
  manejarColisionConPlataforma(samantha);

  // Verificar colisiones con púas
  verificarPuas(kevin);
  verificarPuas(samantha);

  // Colisiones con barreras
  manejarColisionConBarreras(kevin);
  manejarColisionConBarreras(samantha);

  // Dibujar pared
  ctx.fillStyle = "#333";
  ctx.fillRect(pared.x, pared.y, pared.width, pared.height);

  // Dibujar plataformas fijas
  ctx.fillStyle = "#555";
  plataformas.forEach((p) => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });

  // Dibujar plataformas dinámicas si están visibles
  plataformasDinamicas.forEach((p) => {
    if (p.visible) {
      ctx.fillStyle = "#777";
      ctx.fillRect(p.x, p.y, p.width, p.height);
    }
  });

  // Dibujar botones
  dibujarBotones();

  // Dibujar púas
  dibujarPuas();

  // Dibujar barreras
  dibujarBarreras();

  // Dibujar personajes
  drawCharacter(kevin);
  drawCharacter(samantha);

  // Siguiente cuadro de animación
  requestAnimationFrame(loop);
}



fondo.onload = () => {
  loop();
};
