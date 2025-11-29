// ===== USER INTERACTIONS MODULE =====

window.interactionsInitialized = false;

// Madurese vocabulary data
const madureseVocabulary = [
    { madura: 'Bhunne', indonesia: 'Ibu' },
    { madura: 'Taretan', indonesia: 'Saudara' },
    { madura: 'Oreng', indonesia: 'Orang' },
    { madura: 'Lare', indonesia: 'Anak' },
    { madura: 'Sakola', indonesia: 'Sekolah' },
    { madura: 'Bassa', indonesia: 'Bahasa' },
    { madura: 'Rajâ', indonesia: 'Raja' },
    { madura: 'Dâlem', indonesia: 'Rumah' }
];

let currentHoveredIsland = null;

// Initialize interactions
function initInteractions() {
    if (window.interactionsInitialized) return;

    const canvas = document.getElementById('mainCanvas');

    // Mouse move handler
    canvas.addEventListener('mousemove', handleMouseMove);

    // Click handler
    canvas.addEventListener('click', handleClick);

    // Skip button
    const skipBtn = document.getElementById('skipBtn');
    skipBtn.addEventListener('click', handleSkip);

    window.interactionsInitialized = true;
}

// Handle mouse movement
function handleMouseMove(event) {
    if (!AnimationState.isInteractive) return;

    const rect = AnimationState.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if hovering over any island
    const hoveredIsland = checkIslandHover(mouseX, mouseY);

    if (hoveredIsland !== currentHoveredIsland) {
        currentHoveredIsland = hoveredIsland;

        if (hoveredIsland) {
            showIslandLabel(hoveredIsland, event.clientX, event.clientY);
            AnimationState.canvas.style.cursor = 'pointer';
        } else {
            hideIslandLabel();
            AnimationState.canvas.style.cursor = 'default';
        }
    }
}

// Check if mouse is over an island
function checkIslandHover(x, y) {
    if (!window.islandBounds) return null;

    for (const name in window.islandBounds) {
        const island = window.islandBounds[name];

        if (isPointInPolygon(x, y, island.points)) {
            return name;
        }
    }

    return null;
}

// Point in polygon check (ray casting algorithm)
function isPointInPolygon(x, y, points) {
    let inside = false;

    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x, yi = points[i].y;
        const xj = points[j].x, yj = points[j].y;

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
}

// Show island name label
function showIslandLabel(islandName, x, y) {
    const label = document.getElementById('islandLabel');

    // Don't show label for Madura (will show tooltip instead)
    if (islandName === 'Madura') {
        label.classList.add('hidden');
        return;
    }

    label.textContent = islandName;
    label.style.left = `${x + 15}px`;
    label.style.top = `${y - 10}px`;
    label.classList.remove('hidden');
}

// Hide island label
function hideIslandLabel() {
    const label = document.getElementById('islandLabel');
    label.classList.add('hidden');
}

// Handle click events
function handleClick(event) {
    if (!AnimationState.isInteractive) return;

    const rect = AnimationState.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedIsland = checkIslandHover(mouseX, mouseY);

    if (clickedIsland === 'Madura') {
        showMaduraTooltip(event.clientX, event.clientY);
    } else {
        hideMaduraTooltip();
    }
}

// Show Madura vocabulary tooltip
function showMaduraTooltip(x, y) {
    const tooltip = document.getElementById('tooltip');
    const content = document.getElementById('tooltipContent');

    // Clear previous content
    content.innerHTML = '';

    // Add vocabulary items
    madureseVocabulary.forEach(vocab => {
        const item = document.createElement('div');
        item.className = 'vocab-item';
        item.innerHTML = `
            <span class="vocab-madura">${vocab.madura}</span>
            <span class="vocab-arrow">→</span>
            <span class="vocab-indo">${vocab.indonesia}</span>
        `;
        content.appendChild(item);
    });

    // Position tooltip
    const tooltipWidth = 350;
    const tooltipHeight = 400;

    let posX = x + 15;
    let posY = y - tooltipHeight / 2;

    // Keep tooltip on screen
    if (posX + tooltipWidth > window.innerWidth) {
        posX = x - tooltipWidth - 15;
    }
    if (posY < 0) posY = 10;
    if (posY + tooltipHeight > window.innerHeight) {
        posY = window.innerHeight - tooltipHeight - 10;
    }

    tooltip.style.left = `${posX}px`;
    tooltip.style.top = `${posY}px`;
    tooltip.classList.remove('hidden');

    // Hide label
    hideIslandLabel();
}

// Hide Madura tooltip
function hideMaduraTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.add('hidden');
}

// Handle skip button
function handleSkip() {
    // Transition directly to closing scene
    AnimationState.currentScene = SCENES.CLOSING;
    AnimationState.sceneStartTime = (Date.now() - AnimationState.animationStartTime) / 1000;

    // Hide skip button
    document.getElementById('skipBtn').classList.add('hidden');

    // Show closing text
    setTimeout(() => {
        document.getElementById('closingText').classList.remove('hidden');
    }, 500);
}

// Close tooltip when clicking outside
document.addEventListener('click', (event) => {
    const tooltip = document.getElementById('tooltip');
    const canvas = document.getElementById('mainCanvas');

    if (!tooltip.classList.contains('hidden') &&
        event.target !== canvas &&
        !tooltip.contains(event.target)) {
        hideMaduraTooltip();
    }
});

// Export
window.initInteractions = initInteractions;
window.madureseVocabulary = madureseVocabulary;
window.showMaduraTooltip = showMaduraTooltip;
window.hideMaduraTooltip = hideMaduraTooltip;
