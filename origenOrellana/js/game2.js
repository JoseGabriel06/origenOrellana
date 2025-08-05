const canvas = document.getElementById("gameCanvasDos");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

// Fondo
const fondo = new Image();
fondo.src = "../imgs/mapa_dos.png";

// Nave
const nave = new Image();
nave.src = "../imgs/nave.png";
let naveX = canvas.width / 2 - 30;
const naveY = 200;
const naveWidth = 60, naveHeight = 120;

// Físicas
const gravity = 1;
const floorY = canvas.height - 80;

// Botones imágenes
const botonIzqImg = new Image();
botonIzqImg.src = "../imgs/boton_izquierda.png";
const botonDerImg = new Image();
botonDerImg.src = "../imgs/boton_derecha.png";

// Botones
const botonIzquierda = { x: 100, y: floorY - 30, width: 40, height: 50 };
const botonDerecha = { x: canvas.width - 140, y: floorY - 30, width: 40, height: 50 };

// Personaje Kevin
const kevin = {
    x: 150, y: canvas.height - 100, width: 40, height: 80,
    vx: 0, vy: 0, onGround: false, facing: "right",
    walkFrame: 0, frameCounter: 0,
    imgRight: new Image(), imgLeft: new Image(),
    imgFront: new Image(), imgJumpRight: new Image(), imgJumpLeft: new Image()
};
kevin.imgRight.src = "../imgs/kevin_derecha.png";
kevin.imgLeft.src = "../imgs/kevin_izquierda.png";
kevin.imgFront.src = "../imgs/kevin_frente.png";
kevin.imgJumpRight.src = "../imgs/kevin_salto_derecha.png";
kevin.imgJumpLeft.src = "../imgs/kevin_salto_izquierda.png";

// Personaje Samantha
const samantha = {
    x: 810, y: canvas.height - 100, width: 40, height: 75,
    vx: 0, vy: 0, onGround: false, facing: "right",
    walkFrame: 0, frameCounter: 0,
    imgRight: new Image(), imgLeft: new Image(),
    imgFront: new Image(), imgJumpRight: new Image(), imgJumpLeft: new Image()
};
samantha.imgRight.src = "../imgs/samantha_derecha.png";
samantha.imgLeft.src = "../imgs/samantha_izquierda.png";
samantha.imgFront.src = "../imgs/samantha_frente.png";
samantha.imgJumpRight.src = "../imgs/samantha_salto_derecha.png";
samantha.imgJumpLeft.src = "../imgs/samantha_salto_izquierda.png";

// Controles
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Rayos
let rayos = [];
setInterval(() => {
    rayos.push({
        x: naveX + naveWidth / 2 - 5,
        y: naveY,
        width: 10,
        height: 20,
        speed: 5
    });
}, 800);

function actualizarRayos() {
    rayos.forEach(r => r.y -= r.speed);
    rayos = rayos.filter(r => r.y + r.height > 0);
}

function dibujarRayos() {
    ctx.fillStyle = "yellow";
    rayos.forEach(r => ctx.fillRect(r.x, r.y, r.width, r.height));
}

// Meteoritos
const meteoritoImg = new Image();
meteoritoImg.src = "../imgs/meteorito.png";
const muertoImg = new Image();
muertoImg.src = "../imgs/muertiorito.png";
let meteoritos = [];

setInterval(() => {
    meteoritos.push({
        x: 200 + Math.random() * 600,
        y: -50,
        width: 40,
        height: 40,
        speed: 1,
        muerto: false,
        muertoTimer: 0
    });
}, 6000);

function actualizarMeteoritos() {
    meteoritos.forEach(m => {
        if (!m.muerto) m.y += m.speed;
        else m.muertoTimer++;
    });
    meteoritos = meteoritos.filter(m => !(m.muerto && m.muertoTimer > 30) && m.y < canvas.height - 180);
}

function dibujarMeteoritos() {
    meteoritos.forEach(m => {
        const img = m.muerto ? muertoImg : meteoritoImg;
        ctx.drawImage(img, m.x, m.y, m.width, m.height);
    });
}

// Colisiones
function detectarColisiones() {
    rayos.forEach(rayo => {
        meteoritos.forEach(m => {
            if (!m.muerto &&
                rayo.x < m.x + m.width &&
                rayo.x + rayo.width > m.x &&
                rayo.y < m.y + m.height &&
                rayo.y + rayo.height > m.y) {
                m.muerto = true;
                rayo.y = -100;
            }
        });
    });
    rayos = rayos.filter(r => r.y + r.height > 0);
}

// Movimiento personajes
function updateCharacter(c, left, right, jump) {
    if (keys[left]) { c.vx = -2; c.facing = "left"; }
    else if (keys[right]) { c.vx = 2; c.facing = "right"; }
    else c.vx = 0;

    if (keys[jump] && c.onGround) {
        c.vy = -15;
        c.onGround = false;
    }

    c.vy += gravity;
    c.x += c.vx;
    c.y += c.vy;

    if (c.y + c.height >= floorY) { c.y = floorY - c.height; c.vy = 0; c.onGround = true; }

    if (c.x < 0) c.x = 0;
    if (c.x + c.width > canvas.width) c.x = canvas.width - c.width;

    if (c.vx !== 0 && c.onGround) {
        c.frameCounter++;
        if (c.frameCounter % 10 === 0) c.walkFrame = 1 - c.walkFrame;
    } else { c.walkFrame = 0; c.frameCounter = 0; }
}

function drawCharacter(c) {
    let img;
    if (!c.onGround) img = c.facing === "right" ? c.imgJumpRight : c.imgJumpLeft;
    else if (c.vx !== 0) img = c.walkFrame === 0
        ? (c.facing === "right" ? c.imgRight : c.imgLeft)
        : c.imgFront;
    else img = c.imgFront;
    ctx.drawImage(img, c.x, c.y, c.width, c.height);
}

// Botones
function dibujarBotones() {
    ctx.drawImage(botonIzqImg, botonIzquierda.x, botonIzquierda.y, botonIzquierda.width, botonIzquierda.height);
    ctx.drawImage(botonDerImg, botonDerecha.x, botonDerecha.y, botonDerecha.width, botonDerecha.height);
}

function estaSobreBoton(c, boton) {
    return c.x + c.width > boton.x && c.x < boton.x + boton.width &&
           c.y + c.height >= boton.y && c.y + c.height <= boton.y + boton.height;
}

function moverNave() {
    if (estaSobreBoton(kevin, botonIzquierda)) naveX -= 3;
    if (estaSobreBoton(samantha, botonDerecha)) naveX += 3;
    if (naveX < 0) naveX = 0;
    if (naveX + naveWidth > canvas.width) naveX = canvas.width - naveWidth;
}

// Loop
function loop() {
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
    dibujarBotones();
    moverNave();
    ctx.drawImage(nave, naveX, naveY, naveWidth, naveHeight);
    actualizarRayos(); dibujarRayos();
    actualizarMeteoritos(); dibujarMeteoritos();
    detectarColisiones();
    updateCharacter(kevin, 'a', 'd', 'w');
    updateCharacter(samantha, 'ArrowLeft', 'ArrowRight', 'ArrowUp');
    drawCharacter(kevin); drawCharacter(samantha);
    requestAnimationFrame(loop);
}

fondo.onload = () => loop();
