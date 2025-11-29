// ===== BATIK MADURA PATTERNS MODULE =====

const BatikPatterns = {
    canvas: null,
    ctx: null,
    patternCache: null
};

// Initialize batik pattern
function initBatik() {
    // Create off-screen canvas for pattern
    BatikPatterns.canvas = document.createElement('canvas');
    BatikPatterns.canvas.width = 200;
    BatikPatterns.canvas.height = 200;
    BatikPatterns.ctx = BatikPatterns.canvas.getContext('2d');

    generateBatikPattern();
}

// Generate traditional Madura batik pattern
function generateBatikPattern() {
    const ctx = BatikPatterns.ctx;
    const size = 200;

    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, size, size);

    // Pattern colors (Madura traditional)
    const colors = ['#DC143C', '#FFD700', '#FFFFFF'];

    // Draw geometric patterns
    drawBatikGeometry(ctx, size, colors);

    // Create pattern
    BatikPatterns.patternCache = AnimationState.ctx.createPattern(BatikPatterns.canvas, 'repeat');
}

// Draw batik geometric patterns
function drawBatikGeometry(ctx, size, colors) {
    // Diamond patterns
    for (let y = 0; y < size; y += 40) {
        for (let x = 0; x < size; x += 40) {
            // Diamond
            ctx.strokeStyle = colors[0];
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 20, y);
            ctx.lineTo(x + 40, y + 20);
            ctx.lineTo(x + 20, y + 40);
            ctx.lineTo(x, y + 20);
            ctx.closePath();
            ctx.stroke();

            // Inner decoration
            ctx.fillStyle = colors[1];
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(x + 20, y + 20, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // Dots pattern
    for (let y = 20; y < size; y += 40) {
        for (let x = 20; x < size; x += 40) {
            ctx.fillStyle = colors[2];
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Lines pattern
    ctx.strokeStyle = colors[1];
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < size; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(0, i);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(size - i, size);
        ctx.lineTo(size, size - i);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}

// Draw batik transition overlay
function drawBatikTransition(ctx, progress, direction = 'right') {
    if (!BatikPatterns.patternCache) {
        initBatik();
    }

    ctx.save();

    // Calculate slide position
    let x = 0;
    if (direction === 'right') {
        x = -AnimationState.width + (AnimationState.width * progress);
    } else if (direction === 'left') {
        x = AnimationState.width * (1 - progress);
    }

    // Draw pattern overlay
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = BatikPatterns.patternCache;
    ctx.fillRect(x, 0, AnimationState.width, AnimationState.height);

    // Add gradient fade
    const gradient = ctx.createLinearGradient(x, 0, x + AnimationState.width, 0);
    if (direction === 'right') {
        gradient.addColorStop(0, 'rgba(220, 20, 60, 0)');
        gradient.addColorStop(0.5, 'rgba(220, 20, 60, 0.5)');
        gradient.addColorStop(1, 'rgba(220, 20, 60, 0.8)');
    } else {
        gradient.addColorStop(0, 'rgba(220, 20, 60, 0.8)');
        gradient.addColorStop(0.5, 'rgba(220, 20, 60, 0.5)');
        gradient.addColorStop(1, 'rgba(220, 20, 60, 0)');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(x, 0, AnimationState.width, AnimationState.height);

    ctx.restore();
}

// Draw batik border decoration
function drawBatikBorder(ctx) {
    if (!BatikPatterns.patternCache) {
        initBatik();
    }

    const borderWidth = 30;

    ctx.save();
    ctx.globalAlpha = 0.5;

    // Top border
    ctx.fillStyle = BatikPatterns.patternCache;
    ctx.fillRect(0, 0, AnimationState.width, borderWidth);

    // Bottom border
    ctx.fillRect(0, AnimationState.height - borderWidth, AnimationState.width, borderWidth);

    // Left border
    ctx.fillRect(0, 0, borderWidth, AnimationState.height);

    // Right border
    ctx.fillRect(AnimationState.width - borderWidth, 0, borderWidth, AnimationState.height);

    // Corner decorations
    const cornerSize = 60;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;

    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(borderWidth, borderWidth);
    ctx.lineTo(cornerSize, borderWidth);
    ctx.lineTo(borderWidth, cornerSize);
    ctx.closePath();
    ctx.stroke();

    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(AnimationState.width - borderWidth, borderWidth);
    ctx.lineTo(AnimationState.width - cornerSize, borderWidth);
    ctx.lineTo(AnimationState.width - borderWidth, cornerSize);
    ctx.closePath();
    ctx.stroke();

    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(borderWidth, AnimationState.height - borderWidth);
    ctx.lineTo(cornerSize, AnimationState.height - borderWidth);
    ctx.lineTo(borderWidth, AnimationState.height - cornerSize);
    ctx.closePath();
    ctx.stroke();

    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(AnimationState.width - borderWidth, AnimationState.height - borderWidth);
    ctx.lineTo(AnimationState.width - cornerSize, AnimationState.height - borderWidth);
    ctx.lineTo(AnimationState.width - borderWidth, AnimationState.height - cornerSize);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}

// Export
window.initBatik = initBatik;
window.drawBatikTransition = drawBatikTransition;
window.drawBatikBorder = drawBatikBorder;
window.BatikPatterns = BatikPatterns;

// Auto-initialize
if (typeof AnimationState !== 'undefined') {
    initBatik();
}
