// ===== INDONESIAN ARCHIPELAGO MAP =====

// Island data with more realistic coordinates - CENTERED and PROPORTIONAL
const ISLANDS = {
    sumatra: {
        name: 'Sumatra',
        points: [
            { x: 0.22, y: 0.28 },
            { x: 0.24, y: 0.20 },
            { x: 0.26, y: 0.18 },
            { x: 0.28, y: 0.22 },
            { x: 0.30, y: 0.30 },
            { x: 0.32, y: 0.42 },
            { x: 0.31, y: 0.52 },
            { x: 0.29, y: 0.58 },
            { x: 0.26, y: 0.62 },
            { x: 0.23, y: 0.63 },
            { x: 0.21, y: 0.60 },
            { x: 0.20, y: 0.50 },
            { x: 0.19, y: 0.40 },
            { x: 0.20, y: 0.32 }
        ],
        color: '#2d5016'
    },
    java: {
        name: 'Jawa',
        points: [
            { x: 0.38, y: 0.62 },
            { x: 0.42, y: 0.61 },
            { x: 0.46, y: 0.61 },
            { x: 0.50, y: 0.62 },
            { x: 0.54, y: 0.64 },
            { x: 0.56, y: 0.66 },
            { x: 0.54, y: 0.68 },
            { x: 0.50, y: 0.68 },
            { x: 0.46, y: 0.67 },
            { x: 0.42, y: 0.66 },
            { x: 0.38, y: 0.65 }
        ],
        color: '#2d5016'
    },
    kalimantan: {
        name: 'Kalimantan',
        points: [
            { x: 0.40, y: 0.25 },
            { x: 0.44, y: 0.18 },
            { x: 0.48, y: 0.16 },
            { x: 0.52, y: 0.18 },
            { x: 0.56, y: 0.22 },
            { x: 0.59, y: 0.28 },
            { x: 0.60, y: 0.35 },
            { x: 0.60, y: 0.42 },
            { x: 0.58, y: 0.50 },
            { x: 0.54, y: 0.56 },
            { x: 0.50, y: 0.58 },
            { x: 0.46, y: 0.56 },
            { x: 0.42, y: 0.52 },
            { x: 0.39, y: 0.46 },
            { x: 0.38, y: 0.38 },
            { x: 0.38, y: 0.30 }
        ],
        color: '#2d5016'
    },
    sulawesi: {
        name: 'Sulawesi',
        points: [
            { x: 0.62, y: 0.30 },
            { x: 0.64, y: 0.26 },
            { x: 0.66, y: 0.24 },
            { x: 0.68, y: 0.26 },
            { x: 0.70, y: 0.30 },
            { x: 0.71, y: 0.35 },
            { x: 0.70, y: 0.40 },
            { x: 0.72, y: 0.44 },
            { x: 0.72, y: 0.50 },
            { x: 0.70, y: 0.55 },
            { x: 0.67, y: 0.58 },
            { x: 0.64, y: 0.56 },
            { x: 0.62, y: 0.52 },
            { x: 0.61, y: 0.46 },
            { x: 0.60, y: 0.40 },
            { x: 0.60, y: 0.35 }
        ],
        color: '#2d5016'
    },
    papua: {
        name: 'Papua',
        points: [
            { x: 0.76, y: 0.42 },
            { x: 0.80, y: 0.38 },
            { x: 0.84, y: 0.36 },
            { x: 0.88, y: 0.38 },
            { x: 0.90, y: 0.42 },
            { x: 0.91, y: 0.48 },
            { x: 0.90, y: 0.54 },
            { x: 0.87, y: 0.58 },
            { x: 0.83, y: 0.60 },
            { x: 0.79, y: 0.58 },
            { x: 0.76, y: 0.54 },
            { x: 0.74, y: 0.48 }
        ],
        color: '#2d5016'
    },
    madura: {
        name: 'Madura',
        points: [
            { x: 0.555, y: 0.640 },
            { x: 0.575, y: 0.638 },
            { x: 0.582, y: 0.642 },
            { x: 0.580, y: 0.648 },
            { x: 0.570, y: 0.652 },
            { x: 0.558, y: 0.650 },
            { x: 0.552, y: 0.645 }
        ],
        color: '#FFD700',
        isSpecial: true
    },
    bali: {
        name: 'Bali',
        points: [
            { x: 0.560, y: 0.670 },
            { x: 0.568, y: 0.668 },
            { x: 0.572, y: 0.674 },
            { x: 0.568, y: 0.678 },
            { x: 0.562, y: 0.676 }
        ],
        color: '#2d5016'
    },
    ntt: {
        name: 'Nusa Tenggara',
        points: [
            { x: 0.575, y: 0.675 },
            { x: 0.590, y: 0.673 },
            { x: 0.605, y: 0.676 },
            { x: 0.615, y: 0.680 },
            { x: 0.612, y: 0.685 },
            { x: 0.600, y: 0.686 },
            { x: 0.585, y: 0.683 },
            { x: 0.573, y: 0.680 }
        ],
        color: '#2d5016'
    }
};

// Draw the entire archipelago
function drawArchipelago(ctx, zoomLevel, elapsed, showMadura) {
    const centerX = AnimationState.width / 2;
    const centerY = AnimationState.height / 2;

    // Calculate scale and offset based on zoom
    const baseScale = Math.min(AnimationState.width, AnimationState.height) * 0.8;
    const scale = baseScale * zoomLevel;
    const offsetX = centerX - (AnimationState.width * 0.5 * zoomLevel);
    const offsetY = centerY - (AnimationState.height * 0.5 * zoomLevel);

    // Draw each island
    Object.keys(ISLANDS).forEach(key => {
        const island = ISLANDS[key];

        // Skip Madura if not ready to show
        if (key === 'madura' && !showMadura) return;

        drawIsland(ctx, island, scale, offsetX, offsetY, key === 'madura');
    });
}

// Draw a single island
function drawIsland(ctx, island, scale, offsetX, offsetY, isMadura) {
    ctx.save();

    // Create path
    ctx.beginPath();
    island.points.forEach((point, i) => {
        const x = point.x * scale + offsetX;
        const y = point.y * scale + offsetY;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();

    // Special rendering for Madura
    if (isMadura) {
        // Shadow/glow
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.shadowBlur = 30;
        ctx.fillStyle = island.color;
        ctx.fill();

        // Border
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 3;
        ctx.stroke();
    } else {
        // Normal island
        ctx.fillStyle = island.color;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    ctx.restore();

    // Store island bounds for interaction
    if (!window.islandBounds) window.islandBounds = {};
    window.islandBounds[island.name] = {
        points: island.points.map(p => ({
            x: p.x * scale + offsetX,
            y: p.y * scale + offsetY
        })),
        center: {
            x: island.points.reduce((sum, p) => sum + p.x, 0) / island.points.length * scale + offsetX,
            y: island.points.reduce((sum, p) => sum + p.y, 0) / island.points.length * scale + offsetY
        },
        isMadura: isMadura
    };
}

// Draw Madura glow effect
function drawMaduraGlow(ctx, intensity) {
    if (!window.islandBounds || !window.islandBounds['Madura']) return;

    const madura = window.islandBounds['Madura'];
    const centerX = madura.center.x;
    const centerY = madura.center.y;

    // Pulsing glow
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80 * intensity);
    gradient.addColorStop(0, `rgba(255, 215, 0, ${0.6 * intensity})`);
    gradient.addColorStop(0.5, `rgba(255, 165, 0, ${0.3 * intensity})`);
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100 * intensity, 0, Math.PI * 2);
    ctx.fill();

    // Particles around Madura
    if (AnimationState.isInteractive && Math.random() > 0.9) {
        createMaduraParticle(centerX, centerY);
    }

    // Draw particles
    updateMaduraParticles(ctx);
}

// Ocean rendering
function drawOcean(ctx, elapsed) {
    const waveOffset = elapsed * 20;

    // Ocean layer
    ctx.fillStyle = 'rgba(30, 58, 138, 0.2)';

    // Draw waves
    for (let y = 0; y < AnimationState.height; y += 40) {
        ctx.save();
        ctx.globalAlpha = 0.1;

        ctx.beginPath();
        for (let x = 0; x <= AnimationState.width; x += 20) {
            const waveY = y + Math.sin((x + waveOffset) * 0.01) * 10;
            if (x === 0) {
                ctx.moveTo(x, waveY);
            } else {
                ctx.lineTo(x, waveY);
            }
        }
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}

// Madura particles
const maduraParticles = [];

function createMaduraParticle(x, y) {
    maduraParticles.push({
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        size: Math.random() * 3 + 1
    });

    // Limit particles
    if (maduraParticles.length > 30) {
        maduraParticles.shift();
    }
}

function updateMaduraParticles(ctx) {
    for (let i = maduraParticles.length - 1; i >= 0; i--) {
        const p = maduraParticles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;

        if (p.life <= 0) {
            maduraParticles.splice(i, 1);
            continue;
        }

        ctx.fillStyle = `rgba(255, 215, 0, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Export
window.drawArchipelago = drawArchipelago;
window.drawOcean = drawOcean;
window.drawMaduraGlow = drawMaduraGlow;
window.ISLANDS = ISLANDS;
