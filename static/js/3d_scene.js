// Enhanced 3D Scene with Madura Cultural Elements
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xD4AF37, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Cultural Elements Group
    const culturalElements = new THREE.Group();
    scene.add(culturalElements);

    // 1. Madura Island Map (Enhanced)
    const islandGeometry = new THREE.BufferGeometry();
    const islandCount = 2000;
    const islandPosArray = new Float32Array(islandCount * 3);

    for (let i = 0; i < islandCount * 3; i += 3) {
        // Create elongated Madura-shaped particle cloud
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 3 * Math.cos(x * 0.3);
        const z = (Math.random() - 0.5) * 1;

        islandPosArray[i] = x;
        islandPosArray[i + 1] = y;
        islandPosArray[i + 2] = z;
    }

    islandGeometry.setAttribute('position', new THREE.BufferAttribute(islandPosArray, 3));
    
    const islandMaterial = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const maduraIsland = new THREE.Points(islandGeometry, islandMaterial);
    culturalElements.add(maduraIsland);

    // 2. Traditional Boat (Simplified)
    function createTraditionalBoat() {
        const boatGroup = new THREE.Group();
        
        // Boat hull (simplified as curved shape)
        const hullGeometry = new THREE.CylinderGeometry(0.5, 0.8, 2, 8, 1, true);
        const hullMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8B4513,
            shininess: 30
        });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        hull.rotation.z = Math.PI / 2;
        boatGroup.add(hull);

        // Sail
        const sailGeometry = new THREE.PlaneGeometry(1.5, 2);
        const sailMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        const sail = new THREE.Mesh(sailGeometry, sailMaterial);
        sail.position.set(0, 1, 0);
        sail.rotation.y = Math.PI / 4;
        boatGroup.add(sail);

        boatGroup.position.set(3, 2, 0);
        boatGroup.scale.set(0.8, 0.8, 0.8);
        
        return boatGroup;
    }

    const traditionalBoat = createTraditionalBoat();
    culturalElements.add(traditionalBoat);

    // 3. Batik Pattern Particles
    const batikGeometry = new THREE.BufferGeometry();
    const batikCount = 500;
    const batikPosArray = new Float32Array(batikCount * 3);

    for (let i = 0; i < batikCount * 3; i += 3) {
        // Create circular batik-like pattern
        const radius = 3 + Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 2;

        batikPosArray[i] = x;
        batikPosArray[i + 1] = y;
        batikPosArray[i + 2] = z;
    }

    batikGeometry.setAttribute('position', new THREE.BufferAttribute(batikPosArray, 3));
    
    const batikMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x8B0000,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const batikPattern = new THREE.Points(batikGeometry, batikMaterial);
    culturalElements.add(batikPattern);

    // 4. Ambient Cultural Particles
    const culturalParticlesGeometry = new THREE.BufferGeometry();
    const culturalParticlesCount = 800;
    const culturalParticlesPos = new Float32Array(culturalParticlesCount * 3);
    
    for (let i = 0; i < culturalParticlesCount * 3; i++) {
        culturalParticlesPos[i] = (Math.random() - 0.5) * 15;
    }
    
    culturalParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(culturalParticlesPos, 3));
    
    const culturalParticlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x006400,
        transparent: true,
        opacity: 0.4
    });
    
    const culturalParticles = new THREE.Points(culturalParticlesGeometry, culturalParticlesMaterial);
    scene.add(culturalParticles);

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
        time += 0.01;

        // Gentle rotation for cultural elements
        culturalElements.rotation.y += 0.002;

        // Interactive rotation based on mouse
        culturalElements.rotation.x += (mouseY * 0.3 - culturalElements.rotation.x) * 0.05;
        culturalElements.rotation.y += (mouseX * 0.3 - (culturalElements.rotation.y % (Math.PI * 2))) * 0.05;

        // Boat floating animation
        traditionalBoat.position.y = 2 + Math.sin(time * 2) * 0.3;
        traditionalBoat.rotation.z = Math.sin(time) * 0.1;

        // Batik pattern rotation
        batikPattern.rotation.z += 0.001;

        // Pulse effect for Madura island
        const pulseScale = 1 + Math.sin(time * 1.5) * 0.05;
        maduraIsland.scale.setScalar(pulseScale);

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