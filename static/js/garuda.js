// ===== GARUDA ANIMATION MODULE =====

const GarudaState = {
    wingFrame: 0,
    particles: []
};

// Draw Garuda in different states
function drawGaruda(ctx, sceneTime, state) {
    const centerX = AnimationState.width / 2;
    const centerY = AnimationState.height / 2;

    switch (state) {
        case 'entrance':
            drawGarudaEntrance(ctx, centerX, centerY, sceneTime);
            break;
        case 'flying':
            drawGarudaFlying(ctx, centerX, centerY - 150, sceneTime);
            break;
        case 'embrace':
            drawGarudaEmbrace(ctx, centerX, centerY, sceneTime);
            break;
    }

    // Update and draw particles
    updateGarudaParticles(ctx);
}

// Garuda entrance animation
function drawGarudaEntrance(ctx, x, y, time) {
    const scale = Math.min(time / 2, 1); // Scale from 0 to 1 over 2 seconds
    const alpha = Math.min(time / 1.5, 1);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    drawGarudaBody(ctx, time);

    ctx.restore();

    // Spawn entrance particles
    if (Math.random() > 0.8) {
        createGarudaParticle(x, y);
    }
}

// Garuda flying animation
function drawGarudaFlying(ctx, x, y, time) {
    ctx.save();
    ctx.translate(x, y);

    // Slight bobbing motion
    const bobbing = Math.sin(time * 2) * 10;
    ctx.translate(0, bobbing);

    drawGarudaBody(ctx, time);

    ctx.restore();

    // Flying particles
    if (Math.random() > 0.85) {
        createGarudaParticle(x + (Math.random() - 0.5) * 100, y + bobbing);
    }
}

// Garuda embrace (closing)
function drawGarudaEmbrace(ctx, x, y, time) {
    const spreadWings = Math.min(time / 2, 1);

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.7;

    // Draw body
    drawGarudaBody(ctx, time);

    // Wings spreading wide
    ctx.save();
    ctx.scale(1 + spreadWings, 1 + spreadWings * 0.5);
    drawGarudaWings(ctx, time, spreadWings * 60);
    ctx.restore();

    ctx.restore();
}

// Draw Garuda body (simplified silhouette)
function drawGarudaBody(ctx, time) {
    // Update wing animation
    if (Math.floor(time * 4) % 3 !== GarudaState.wingFrame) {
        GarudaState.wingFrame = Math.floor(time * 4) % 3;
    }

    // Head
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, -40, 20, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(15, -40);
    ctx.lineTo(30, -40);
    ctx.lineTo(20, -35);
    ctx.closePath();
    ctx.fill();

    // Body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(0, 0, 35, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    drawGarudaWings(ctx, time, 0);

    // Tail feathers
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.moveTo(-10, 40);
    ctx.lineTo(0, 80);
    ctx.lineTo(10, 40);
    ctx.closePath();
    ctx.fill();

    // Crown
    for (let i = 0; i < 5; i++) {
        const angle = (i - 2) * 0.3;
        const crownX = Math.sin(angle) * 15;
        const crownY = -50 - Math.cos(angle) * 10;

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(crownX, crownY);
        ctx.lineTo(crownX - 3, crownY - 10);
        ctx.lineTo(crownX + 3, crownY - 10);
        ctx.closePath();
        ctx.fill();
    }
}

// Draw animated wings
function drawGarudaWings(ctx, time, extraSpread = 0) {
    const wingAngle = Math.sin(time * 4) * 0.3 + extraSpread * (Math.PI / 180);

    // Left wing
    ctx.save();
    ctx.rotate(-wingAngle);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(-60, 0, 50, 30, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Wing details (feathers)
    ctx.strokeStyle = '#DC143C';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(-40, -15 + i * 7);
        ctx.lineTo(-90, -20 + i * 8);
        ctx.stroke();
    }
    ctx.restore();

    // Right wing
    ctx.save();
    ctx.rotate(wingAngle);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(60, 0, 50, 30, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Wing details (feathers)
    ctx.strokeStyle = '#DC143C';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(40, -15 + i * 7);
        ctx.lineTo(90, -20 + i * 8);
        ctx.stroke();
    }
    ctx.restore();
}

// Garuda particle system
function createGarudaParticle(x, y) {
    GarudaState.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 1,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.5 ? '#FFD700' : '#FFA500'
    });

    // Limit particles
    if (GarudaState.particles.length > 50) {
        GarudaState.particles.shift();
    }
}

function updateGarudaParticles(ctx) {
    for (let i = GarudaState.particles.length - 1; i >= 0; i--) {
        const p = GarudaState.particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravity
        p.life -= 0.02;

        if (p.life <= 0) {
            GarudaState.particles.splice(i, 1);
            continue;
        }

        ctx.fillStyle = p.color.replace(')', `, ${p.life})`).replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        if (p.life > 0.5) {
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
}

// Export
window.drawGaruda = drawGaruda;
window.GarudaState = GarudaState;
