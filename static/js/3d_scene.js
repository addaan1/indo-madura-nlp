// Simplified Modern 3D Scene
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFB800, 1.5);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    // Main Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Minimal Particle Field
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 800;
    const particlePosArray = new Float32Array(particleCount * 3);
    const particleColorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Create scattered particle field
        particlePosArray[i] = (Math.random() - 0.5) * 12;
        particlePosArray[i + 1] = (Math.random() - 0.5) * 12;
        particlePosArray[i + 2] = (Math.random() - 0.5) * 12;

        // Color variation between gold and coral
        const colorChoice = Math.random();
        if (colorChoice > 0.5) {
            particleColorArray[i] = 1.0;     // R
            particleColorArray[i + 1] = 0.72; // G
            particleColorArray[i + 2] = 0.0;  // B (Gold)
        } else {
            particleColorArray[i] = 1.0;     // R
            particleColorArray[i + 1] = 0.42; // G
            particleColorArray[i + 2] = 0.42; // B (Coral)
        }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePosArray, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColorArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particles);

    // 2. Geometric Rings
    function createRing(radius, color, thickness = 0.02) {
        const geometry = new THREE.TorusGeometry(radius, thickness, 16, 100);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
            shininess: 100
        });
        return new THREE.Mesh(geometry, material);
    }

    const ring1 = createRing(1.5, 0xFFB800, 0.015);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2 = createRing(2.2, 0xFF6B6B, 0.012);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    const ring3 = createRing(2.8, 0xFFC107, 0.01);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.y = Math.PI / 3;
    mainGroup.add(ring3);

    // 3. Central Accent Sphere
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFB800,
        transparent: true,
        opacity: 0.6,
        shininess: 100,
        emissive: 0xFFB800,
        emissiveIntensity: 0.3
    });
    const centralSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mainGroup.add(centralSphere);

    // Animation Variables
    let mouseX = 0;
    let mouseY = 0;
    let time = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        time += 0.005;

        // Gentle rotation for main group
        mainGroup.rotation.y += 0.001;

        // Interactive rotation based on mouse (subtle)
        mainGroup.rotation.x += (mouseY * 0.2 - mainGroup.rotation.x) * 0.03;
        mainGroup.rotation.y += (mouseX * 0.2 - (mainGroup.rotation.y % (Math.PI * 2))) * 0.03;

        // Animate rings independently
        ring1.rotation.z += 0.002;
        ring2.rotation.z -= 0.0015;
        ring3.rotation.z += 0.001;

        // Pulse effect for central sphere
        const pulseScale = 1 + Math.sin(time * 2) * 0.1;
        centralSphere.scale.setScalar(pulseScale);

        // Gentle wave motion for particles
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time * 2 + positions[i]) * 0.001;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});