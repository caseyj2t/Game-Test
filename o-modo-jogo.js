// Seleção dos elementos do DOM para o canvas e interface
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');

// Objeto principal do jogo, contendo configurações e estado
const game = {
    width: canvas.width,
    height: canvas.height,
    gravity: 0.5, // Gravidade aplicada ao jogador
    speed: 5, // Velocidade dos obstáculos
    score: 0, // Pontuação atual
    running: false, // Se o jogo está em execução
    gameOver: false, // Se o jogo terminou
    obstacles: [], // Array de obstáculos
    frame: 0, // Contador de frames
    obstacleInterval: 120, // Intervalo para criar obstáculos
    lastObstacle: 0, // Último frame em que um obstáculo foi criado
    reset() { // Função para resetar o jogo
        this.score = 0;
        this.running = false;
        this.gameOver = false;
        this.obstacles = [];
        this.frame = 0;
        this.lastObstacle = 0;
        player.reset();
        statusEl.textContent = 'Pressione Espaço para iniciar';
        scoreEl.textContent = 'Score: 0';
    }
};

// Objeto do jogador (patinho), com propriedades e métodos
const player = {
    x: 80, // Posição X inicial
    y: game.height - 60, // Posição Y inicial
    width: 40, // Largura
    height: 40, // Altura
    velocityY: 0, // Velocidade vertical
    jumpPower: -14, // Força do pulo
    grounded: true, // Se está no chão
    reset() { // Resetar posição do jogador
        this.y = game.height - 60;
        this.velocityY = 0;
        this.grounded = true;
    },
    jump() { // Função para pular
        if (!game.gameOver && this.grounded) {
            this.velocityY = this.jumpPower;
            this.grounded = false;
            game.running = true;
            statusEl.textContent = 'Jogo em andamento';
        }
    },
    update() { // Atualizar posição do jogador com gravidade
        this.velocityY += game.gravity;
        this.y += this.velocityY;
        if (this.y + this.height >= game.height) {
            this.y = game.height - this.height;
            this.velocityY = 0;
            this.grounded = true;
        }
    },
    draw() { // Desenhar o patinho no canvas
        ctx.save();
        ctx.translate(this.x, this.y);

        // Corpo amarelo
        ctx.fillStyle = '#ffd85b';
        ctx.beginPath();
        ctx.ellipse(this.width * 0.45, this.height * 0.55, this.width * 0.45, this.height * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cabeça
        ctx.beginPath();
        ctx.arc(this.width * 0.75, this.height * 0.3, this.width * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // Bico laranja
        ctx.fillStyle = '#ff8a2b';
        ctx.beginPath();
        ctx.moveTo(this.width * 0.88, this.height * 0.3);
        ctx.lineTo(this.width * 0.98, this.height * 0.33);
        ctx.lineTo(this.width * 0.88, this.height * 0.36);
        ctx.closePath();
        ctx.fill();

        // Asa
        ctx.fillStyle = '#f0c750';
        ctx.beginPath();
        ctx.moveTo(this.width * 0.25, this.height * 0.45);
        ctx.quadraticCurveTo(this.width * 0.35, this.height * 0.25, this.width * 0.55, this.height * 0.45);
        ctx.quadraticCurveTo(this.width * 0.45, this.height * 0.6, this.width * 0.25, this.height * 0.45);
        ctx.fill();

        // Olho
        ctx.fillStyle = '#3b3b3b';
        ctx.beginPath();
        ctx.arc(this.width * 0.78, this.height * 0.27, this.width * 0.06, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
};

// Classe para os obstáculos (flores espinhosas)
class Obstacle {
    constructor() {
        this.width = 40 + Math.random() * 20; // Largura aleatória
        this.height = 80 + Math.random() * 20; // Altura aleatória
        this.x = game.width; // Posição inicial à direita
        this.y = game.height - this.height - 10; // Posição no chão
        this.speed = game.speed; // Velocidade
        this.stemColor = '#3a8f4f'; // Cor do caule
        this.flowerColor = '#ff5b8f'; // Cor da flor
        this.centerColor = '#fff2b5'; // Cor do centro
    }
    update() { // Mover o obstáculo para a esquerda
        this.x -= this.speed;
    }
    draw() { // Desenhar a flor espinhosa
        // Caule
        ctx.fillStyle = this.stemColor;
        ctx.fillRect(this.x + this.width * 0.44, this.y, this.width * 0.14, this.height);

        // Flor (pétalas)
        const centerX = this.x + this.width * 0.5;
        const centerY = this.y - 10;
        const radius = 12;
        ctx.fillStyle = this.flowerColor;
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const spikeX = centerX + Math.cos(angle) * radius;
            const spikeY = centerY + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(spikeX, spikeY);
            ctx.lineTo(centerX + Math.cos(angle + 0.2) * (radius * 0.6), centerY + Math.sin(angle + 0.2) * (radius * 0.6));
            ctx.closePath();
            ctx.fill();
        }

        // Centro da flor
        ctx.fillStyle = this.centerColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Espinhos no caule
        ctx.fillStyle = '#22773b';
        for (let i = 0; i < 3; i++) {
            const thornY = this.y + 20 + i * 18;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.44, thornY);
            ctx.lineTo(this.x + this.width * 0.38, thornY + 6);
            ctx.lineTo(this.x + this.width * 0.44, thornY + 10);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.58, thornY);
            ctx.lineTo(this.x + this.width * 0.64, thornY + 6);
            ctx.lineTo(this.x + this.width * 0.58, thornY + 10);
            ctx.fill();
        }
    }
    isOffScreen() { // Verificar se o obstáculo saiu da tela
        return this.x + this.width < 0;
    }
}

// Função para detectar colisão entre dois retângulos
function collide(rectA, rectB) {
    return rectA.x < rectB.x + rectB.width &&
        rectA.x + rectA.width > rectB.x &&
        rectA.y < rectB.y + rectB.height &&
        rectA.y + rectA.height > rectB.y;
}

// Função principal de atualização do jogo (loop)
function update() {
    if (game.gameOver) return; // Parar se o jogo acabou

    ctx.clearRect(0, 0, game.width, game.height); // Limpar canvas
    game.frame += 1; // Incrementar contador de frames

    player.update(); // Atualizar jogador
    player.draw(); // Desenhar jogador

    if (game.running) { // Se o jogo está rodando
        // Criar novos obstáculos periodicamente
        if (game.frame - game.lastObstacle > game.obstacleInterval) {
            game.obstacles.push(new Obstacle());
            game.lastObstacle = game.frame;
        }

        // Atualizar e desenhar obstáculos, verificar colisões
        game.obstacles.forEach(obstacle => {
            obstacle.update();
            obstacle.draw();
            if (collide(player, obstacle)) { // Se colidiu
                game.gameOver = true;
                statusEl.textContent = 'Fim de jogo! Pressione Espaço para reiniciar';
            }
        });

        // Remover obstáculos fora da tela
        game.obstacles = game.obstacles.filter(obstacle => !obstacle.isOffScreen());
        // Incrementar pontuação
        game.score += 0.05;
        scoreEl.textContent = 'Score: ' + Math.floor(game.score);
    }

    drawGround(); // Desenhar o chão

    if (!game.gameOver) {
        requestAnimationFrame(update); // Continuar loop
    }
}

// Função para desenhar o chão
function drawGround() {
    ctx.fillStyle = '#2e3a70';
    ctx.fillRect(0, game.height - 10, game.width, 10);
}

// Função para iniciar o jogo
function startGame() {
    if (game.gameOver) {
        game.reset(); // Resetar se acabou
    }
    game.running = true;
    statusEl.textContent = 'Jogo em andamento';
    requestAnimationFrame(update); // Iniciar loop
}

// Event listener para tecla Espaço
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        if (!game.running && !game.gameOver) {
            startGame(); // Iniciar se parado
        }
        if (game.gameOver) {
            game.reset(); // Resetar se acabou
            startGame();
        }
        player.jump(); // Pular
    }
});

// Event listener para toque (mobile)
window.addEventListener('pointerdown', () => {
    if (!game.running && !game.gameOver) {
        startGame();
    }
    if (game.gameOver) {
        game.reset();
        startGame();
    }
    player.jump();
});

// Event listener para carregamento da página
window.addEventListener('load', () => {
    game.reset(); // Resetar jogo
    update(); // Iniciar renderização inicial
});