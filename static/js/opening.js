// ===== MODERN LOADING ANIMATION WITH MADURA ELEMENTS =====
const AnimationState = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    loadingProgress: 0,
    animationStartTime: 0,
    particles: [],
    phase: 'loading'
};

function init() {
    AnimationState.canvas = document.getElementById('mainCanvas');
    AnimationState.ctx = AnimationState.canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    initParticles();
    AnimationState.animationStartTime = Date.now();
    requestAnimationFrame(animate);
}

function resizeCanvas() {
    AnimationState.width = window.innerWidth;
    AnimationState.height = window.innerHeight;
    AnimationState.canvas.width = AnimationState.width;
    AnimationState.canvas.height = AnimationState.height;
}

function initParticles() {
    AnimationState.particles = [];
    for (let i = 0; i < 50; i++) {
        AnimationState.particles.push({
            x: Math.random() * AnimationState.width,
            y: Math.random() * AnimationState.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
}

function animate() {
    const elapsed = (Date.now() - AnimationState.animationStartTime) / 1000;
    const ctx = AnimationState.ctx;

    ctx.clearRect(0, 0, AnimationState.width, AnimationState.height);
    drawBackground(ctx, elapsed);

    if (AnimationState.phase === 'loading') {
        const progress = Math.min(elapsed / 2.5, 1);
        AnimationState.loadingProgress = progress * 100;

        updateLoadingBar();
        drawParticles(ctx, elapsed);
        drawCulturalElements(ctx, elapsed);

        if (progress >= 1) {
            AnimationState.phase = 'transition';
            AnimationState.animationStartTime = Date.now();
            document.getElementById('loadingContainer').classList.add('fade-out');
        }
    } else {
        const transitionProgress = Math.min(elapsed / 2, 1);
        drawTransitionEffect(ctx, transitionProgress);

        if (transitionProgress >= 1) {
            window.location.href = '/main';
            return;
        }
    }

    requestAnimationFrame(animate);
}

function drawBackground(ctx, elapsed) {
    const gradient = ctx.createLinearGradient(0, 0, AnimationState.width, AnimationState.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.5, '#1e293b');
    gradient.addColorStop(1, '#334155');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, AnimationState.width, AnimationState.height);

    // Batik pattern
    ctx.save();
    ctx.globalAlpha = 0.06;
    const size = 60;
    for (let y = 0; y < AnimationState.height + size; y += size) {
        for (let x = 0; x < AnimationState.width + size; x += size) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + size / 2, y);
            ctx.lineTo(x + size, y + size / 2);
            ctx.lineTo(x + size / 2, y + size);
            ctx.lineTo(x, y + size / 2);
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = '#DC143C';
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.restore();
}

function drawParticles(ctx, elapsed) {
    AnimationState.particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = AnimationState.width;
        if (p.x > AnimationState.width) p.x = 0;
        if (p.y < 0) p.y = AnimationState.height;
        if (p.y > AnimationState.height) p.y = 0;

        const pulse = Math.sin(elapsed * 2 + p.x) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity * pulse})`;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

function drawCulturalElements(ctx, elapsed) {
    const centerX = AnimationState.width / 2;
    const centerY = AnimationState.height / 2;

    // Madura island silhouette
    ctx.save();
    ctx.translate(centerX - 200, centerY + 150);
    ctx.shadowColor = 'rgba(255, 215, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'rgba(255, 215, 0, 0.12)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 120, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Traditional icons
    drawBoat(ctx, centerX - 300 + Math.sin(elapsed) * 10, centerY - 200 + Math.cos(elapsed * 0.5) * 15, elapsed);
    drawHouse(ctx, centerX + 300 + Math.sin(elapsed * 0.8) * 10, centerY - 180 + Math.cos(elapsed * 0.6) * 12, elapsed);
    drawBatikMotif(ctx, centerX + 280 + Math.cos(elapsed * 0.7) * 15, centerY + 180 + Math.sin(elapsed * 0.9) * 10, elapsed);
}

function drawBoat(ctx, x, y, elapsed) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.3;

    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(20, 0);
    ctx.lineTo(15, 10);
    ctx.lineTo(-15, 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -30);
    ctx.lineTo(15, -15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawHouse(ctx, x, y, elapsed) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.25;

    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-25, 0);
    ctx.lineTo(25, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-20, 0, 40, 25);
    ctx.restore();
}

function drawBatikMotif(ctx, x, y, elapsed) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(elapsed * 0.3);
    ctx.globalAlpha = 0.35;

    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(25, 0);
    ctx.lineTo(0, 25);
    ctx.lineTo(-25, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawTransitionEffect(ctx, progress) {
    const centerX = AnimationState.width / 2;
    const centerY = AnimationState.height / 2;
    const maxRadius = Math.sqrt(AnimationState.width ** 2 + AnimationState.height ** 2);
    const radius = maxRadius * easeInOutCubic(progress);

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, AnimationState.width, AnimationState.height);

    if (progress > 0.7) {
        const fadeProgress = (progress - 0.7) / 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${fadeProgress})`;
        ctx.fillRect(0, 0, AnimationState.width, AnimationState.height);
    }
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function updateLoadingBar() {
    const progressBar = document.getElementById('loadingProgress');
    const percentage = document.getElementById('loadingPercentage');

    if (progressBar) progressBar.style.width = `${AnimationState.loadingProgress}%`;
    if (percentage) percentage.textContent = `${Math.floor(AnimationState.loadingProgress)}%`;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
