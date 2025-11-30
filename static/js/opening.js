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
    for (let i = 0; i < 40; i++) {
        AnimationState.particles.push({
            x: Math.random() * AnimationState.width,
            y: Math.random() * AnimationState.height,
            size: Math.random() * 2.5 + 0.8,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.6 + 0.3
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
    // Modern gradient background
    const gradient = ctx.createLinearGradient(0, 0, AnimationState.width, AnimationState.height);
    gradient.addColorStop(0, '#0a0e1a');
    gradient.addColorStop(0.5, '#1a1f3a');
    gradient.addColorStop(1, '#2a2f4a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, AnimationState.width, AnimationState.height);

    // Subtle geometric pattern
    ctx.save();
    ctx.globalAlpha = 0.04;
    const size = 80;
    for (let y = 0; y < AnimationState.height + size; y += size) {
        for (let x = 0; x < AnimationState.width + size; x += size) {
            ctx.strokeStyle = '#FFB800';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 3, 0, Math.PI * 2);
            ctx.stroke();
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
        ctx.fillStyle = `rgba(255, 184, 0, ${p.opacity * pulse})`;
        ctx.shadowColor = 'rgba(255, 184, 0, 0.6)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

function drawCulturalElements(ctx, elapsed) {
    const centerX = AnimationState.width / 2;
    const centerY = AnimationState.height / 2;

    // Simplified glowing accent
    ctx.save();
    ctx.translate(centerX, centerY + 180);
    ctx.shadowColor = 'rgba(255, 184, 0, 0.4)';
    ctx.shadowBlur = 30;
    ctx.fillStyle = 'rgba(255, 184, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 100, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Minimal floating icons
    drawMinimalIcon(ctx, centerX - 250 + Math.sin(elapsed) * 8, centerY - 150 + Math.cos(elapsed * 0.5) * 12, elapsed, 0);
    drawMinimalIcon(ctx, centerX + 250 + Math.sin(elapsed * 0.8) * 8, centerY - 140 + Math.cos(elapsed * 0.6) * 10, elapsed, 1);
    drawMinimalIcon(ctx, centerX + Math.cos(elapsed * 0.7) * 280, centerY + 160 + Math.sin(elapsed * 0.9) * 8, elapsed, 2);
}

function drawMinimalIcon(ctx, x, y, elapsed, type) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.25;

    if (type === 0) {
        // Circle
        ctx.strokeStyle = '#FFB800';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();
    } else if (type === 1) {
        // Triangle
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(-15, 15);
        ctx.lineTo(15, 15);
        ctx.closePath();
        ctx.fill();
    } else {
        // Diamond
        ctx.strokeStyle = '#FFB800';
        ctx.lineWidth = 2;
        ctx.rotate(elapsed * 0.2);
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(18, 0);
        ctx.lineTo(0, 18);
        ctx.lineTo(-18, 0);
        ctx.closePath();
        ctx.stroke();
    }

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
