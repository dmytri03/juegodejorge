
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const gravity = 0.5;
const jumpStrength = -15; // Aumentado para un salto más alto
const moveSpeed = 5;
const lineSpeed = 0.5; // Reducido para disminuir la velocidad de la línea roja

let gameOver = false; // Variable para controlar el estado de juego

let platforms = [
    { x: 100, y: 500, width: 200, height: 20 },
    { x: 400, y: 400, width: 200, height: 20 },
    { x: 700, y: 300, width: 200, height: 20 }
];

// Encuentra la primera plataforma para posicionar la bola encima de ella
const firstPlatform = platforms[0];
let ball = {
    x: firstPlatform.x,            // Misma coordenada x que la plataforma
    y: firstPlatform.y - 21,       // Ajuste de posición vertical encima de la plataforma
    radius: 20,
    color: '#ff5733', // Cambiado el color de la bola roja a naranja
    dy: 0,
    dx: 0,
    jump() {
        if (this.dy === 0) {
            this.dy = jumpStrength;
        }
    },
    moveLeft() {
        this.dx = -moveSpeed;
    },
    moveRight() {
        this.dx = moveSpeed;
    },
    stop() {
        this.dx = 0;
    },
    update() {
        this.dy += gravity;
        this.y += this.dy;
        this.x += this.dx;

        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.dy = 0;
        }

        if (this.x - this.radius < 0) {
            this.x = this.radius;
        } else if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
        }

        // Verificar colisión con la línea roja
        if (line.y <= this.y + this.radius && !gameOver) {
            gameOver = true;
            alert("Game Over! Bola roja ha chocado con la línea roja.");
            // Puedes agregar aquí cualquier acción adicional al finalizar el juego
        }
    },
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
};

let line = {
    x1: 0,
    y: canvas.height,
    x2: canvas.width,
    color: 'red',
    update() {
        // Actualización de la línea roja (pendiente)
    },
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y);
        ctx.lineTo(this.x2, this.y);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    }
};

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = '#333';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function addPlatform() {
    const lastPlatform = platforms[platforms.length - 1];
    const newPlatform = {
        x: Math.random() * (canvas.width - 200),
        y: lastPlatform.y - 100,
        width: 200,
        height: 20
    };
    platforms.push(newPlatform);
}

function checkCollision() {
    platforms.forEach(platform => {
        if (ball.y + ball.radius > platform.y &&
            ball.y - ball.radius < platform.y + platform.height &&
            ball.x + ball.radius > platform.x &&
            ball.x - ball.radius < platform.x + platform.width) {
            if (ball.dy > 0) {
                ball.dy = 0;
                ball.y = platform.y - ball.radius;
            }
        }
    });
}

function animate() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ball.update();
        checkCollision();
        ball.draw();
        drawPlatforms();
        line.update();
        line.draw();

        // Add a new platform if the ball goes above a certain height
        if (ball.y < canvas.height / 2) {
            platforms.forEach(platform => {
                platform.y += Math.abs(ball.dy);
            });
            ball.y += Math.abs(ball.dy);

            if (platforms[0].y > canvas.height) {
                platforms.shift();
            }

            if (platforms[platforms.length - 1].y < canvas.height - 100) {
                addPlatform();
            }
        }

        requestAnimationFrame(animate);
    }
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        ball.jump();
    }
    if (e.code === 'ArrowLeft') {
        ball.moveLeft();
    }
    if (e.code === 'ArrowRight') {
        ball.moveRight();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        ball.stop();
    }
});

animate();

