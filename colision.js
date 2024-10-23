const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.originalColor = color; // Guardar el color original
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.isColliding = false; // Estado de colisión
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);
        // Actualizar la posición X
        this.posX += this.dx;
        // Cambiar la dirección si el círculo llega al borde del canvas en X
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        // Actualizar la posición Y
        this.posY += this.dy;
        // Cambiar la dirección si el círculo llega al borde del canvas en Y
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    // Detectar colisión con otro círculo
    checkCollision(otherCircle) {
        const dx = this.posX - otherCircle.posX;
        const dy = this.posY - otherCircle.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + otherCircle.radius;
    }

    // Cambiar dirección después de una colisión
    reverseDirection() {
        this.dx = -this.dx;
        this.dy = -this.dy;
    }

    // Cambiar temporalmente el color al chocar y restaurarlo
    flashColor() {
        this.color = "#0000FF"; // Cambiar a azul
        setTimeout(() => {
            this.color = this.originalColor; // Restaurar el color original después de 100ms
        }, 100);
    }
}

// Crear un array para almacenar 10 círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles() {
    for (let i = 0; i < 10; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
        let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
        let text = `C${i + 1}`; // Etiqueta del círculo
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Función para detectar colisiones y actualizar los colores
function detectCollisions() {
    for (let i = 0; i < circles.length; i++) {
        circles[i].isColliding = false; // Reiniciar el estado de colisión

        for (let j = i + 1; j < circles.length; j++) {
            if (circles[i].checkCollision(circles[j])) {
                // Si hay colisión, marcar ambos círculos como colisionando
                circles[i].isColliding = true;
                circles[j].isColliding = true;

                // Hacer que ambos círculos "flasheen" de color azul
                circles[i].flashColor();
                circles[j].flashColor();

                // Cambiar dirección de ambos círculos
                circles[i].reverseDirection();
                circles[j].reverseDirection();
            }
        }
    }
}

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
    circles.forEach(circle => {
        circle.update(ctx); // Actualizar cada círculo
    });
    detectCollisions(); // Detectar colisiones
    requestAnimationFrame(animate); // Repetir la animación
}

// Generar los 10 círculos y comenzar la animación
generateCircles();
animate();
