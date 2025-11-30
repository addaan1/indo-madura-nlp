// Additional Animations & Interactivity

document.addEventListener('DOMContentLoaded', () => {
    // 1. Parallax effect for the "Lock" orbit container
    const appSection = document.getElementById('app-section');
    const orbitContainer = document.querySelector('.orbit-container');

    if (appSection && orbitContainer) {
        appSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;

            orbitContainer.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });

        appSection.addEventListener('mouseleave', () => {
            orbitContainer.style.transform = `translate(-50%, -50%)`;
        });
    }

    // 2. Scroll Reveal for About Cards
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);

    const rows = document.querySelectorAll('.about-row');
    rows.forEach((row, index) => {
        const text = row.querySelector('.about-text');
        const visual = row.querySelector('.about-visual');

        // Initial State
        text.style.opacity = '0';
        text.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
        text.style.transition = 'all 0.8s ease-out';

        visual.style.opacity = '0';
        visual.style.transform = 'scale(0.8)';
        visual.style.transition = 'all 0.8s ease-out 0.2s';

        observer.observe(text);
        observer.observe(visual);
    });

    // 3. Floating Cipher/Matrix Effect
    const cipherContainer = document.getElementById('cipher-container');
    if (cipherContainer) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";

        function createCipherChar() {
            const el = document.createElement('div');
            el.classList.add('cipher-text');
            el.textContent = chars[Math.floor(Math.random() * chars.length)];

            // Random Position within the orbit container
            const angle = Math.random() * Math.PI * 2;
            const radius = 150 + Math.random() * 250;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            el.style.left = `calc(50% + ${x}px)`;
            el.style.top = `calc(50% + ${y}px)`;

            // Random Size
            el.style.fontSize = `${Math.random() * 1 + 0.5}rem`;

            cipherContainer.appendChild(el);

            // Remove after animation
            setTimeout(() => {
                el.remove();
            }, 4000);
        }

        // Create characters periodically
        setInterval(createCipherChar, 100);
    }
});
