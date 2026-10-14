// Three.js Enhanced 3D Background
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Clean dark background
        scene.background = new THREE.Color(0x0a0a0a);
        scene.fog = new THREE.FogExp2(0x0a0a0a, 0.004);

        // Warm ambient lighting
        const ambientLight = new THREE.AmbientLight(0xffaa55, 0.5);
        scene.add(ambientLight);

        // Main key light
        const keyLight = new THREE.DirectionalLight(0xffdd88, 0.8);
        keyLight.position.set(0, 20, 30);
        scene.add(keyLight);

        // Golden backlights
        const backLight1 = new THREE.PointLight(0xffd700, 1.8, 100);
        backLight1.position.set(0, 0, -40);
        scene.add(backLight1);

        const backLight2 = new THREE.PointLight(0xffed4e, 1.2, 80);
        backLight2.position.set(-20, 10, -35);
        scene.add(backLight2);

        const backLight3 = new THREE.PointLight(0xffa500, 1.0, 75);
        backLight3.position.set(20, -10, -35);
        scene.add(backLight3);

        // Rim lights
        const rimLight1 = new THREE.DirectionalLight(0xffcc66, 0.6);
        rimLight1.position.set(-25, 12, -12);
        scene.add(rimLight1);

        const rimLight2 = new THREE.DirectionalLight(0xffd700, 0.5);
        rimLight2.position.set(25, -8, -12);
        scene.add(rimLight2);

        const glowLayers = [backLight1, backLight2, backLight3];

        // Software logos - cleaner positioning
        const softwareLogos = [
{ name: 'Premiere Pro', image: 'logo/pr-new.png', pos: [-20, 6, -25], scale: 6 },
             { name: 'After Effects', image: 'logo/ae-new.png', pos: [22, -4, -28], scale: 5.5 },
             { name: 'CapCut', image: 'logo/Capcut-icon.png', pos: [-24, -10, -20], scale: 5 },
             { name: 'Photoshop', image: 'logo/ps-new.png', pos: [20, 12, -32], scale: 6 },
             { name: 'DaVinci', image: 'logo/davinci-new.png', pos: [-15, -15, -30], scale: 5.5 }
        ];

        // Create volumetric logo objects with depth
        function createVolumetricLogo(imagePath, position, scale) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(imagePath);

            const group = new THREE.Group();

            // Main logo plane with thickness
            const geometry = new THREE.PlaneGeometry(scale, scale);
            const material = new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
                opacity: 0.85,
                side: THREE.DoubleSide,
                metalness: 0.2,
                roughness: 0.5,
                emissive: 0xffd700,
                emissiveIntensity: 0.08
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);

            // Subtle glow effect
            const glowGeometry = new THREE.PlaneGeometry(scale * 1.08, scale * 1.08);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.12,
                side: THREE.DoubleSide
            });
            const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
            glowMesh.position.z = -0.2;
            group.add(glowMesh);

            group.position.set(position[0], position[1], position[2]);
            return group;
        }

        const logos = [];
        softwareLogos.forEach((software, index) => {
            const logo = createVolumetricLogo(software.image, software.pos, software.scale);

            logo.userData = {
                baseX: software.pos[0],
                baseY: software.pos[1],
                baseZ: software.pos[2],
                floatSpeed: 0.3 + Math.random() * 0.3,
                floatRangeY: 2 + Math.random() * 1.5,
                floatRangeX: 1 + Math.random() * 0.8,
                rotSpeedX: (Math.random() - 0.5) * 0.002,
                rotSpeedY: (Math.random() - 0.5) * 0.003,
                rotSpeedZ: (Math.random() - 0.5) * 0.0015,
                phaseOffset: index * 1.2,
                orbitRadius: 1.5 + Math.random() * 2,
                orbitSpeed: 0.15 + Math.random() * 0.2
            };

            logos.push(logo);
            scene.add(logo);
        });

        // Connection lines - fewer for cleaner look
        const connectionLines = [];
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0.25,
            linewidth: 1
        });

        // Strategic connections only
        const connections = [
            [0, 1], // Premiere to After Effects
            [0, 2], // Premiere to CapCut
            [1, 3], // After Effects to Photoshop
            [2, 4], // CapCut to DaVinci
            [3, 4]  // Photoshop to DaVinci
        ];

        connections.forEach(([startIdx, endIdx]) => {
            const lineGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(6); // 2 points × 3 coordinates
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const line = new THREE.Line(lineGeometry, connectionMaterial.clone());
            line.userData = {
                startIdx,
                endIdx,
                baseOpacity: 0.2 + Math.random() * 0.15
            };
            connectionLines.push(line);
            scene.add(line);
        });

        // Subtle glowing nodes
        const nodeGeometry = new THREE.SphereGeometry(0.25, 12, 12);
        const nodes = [];

        logos.forEach((logo, index) => {
            const nodeMat = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.7
            });
            const node = new THREE.Mesh(nodeGeometry, nodeMat);
            node.userData = { logoIndex: index };
            nodes.push(node);
            scene.add(node);

            // Subtle glow
            const glowGeo = new THREE.SphereGeometry(0.45, 12, 12);
            const glowMat = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.15,
                side: THREE.BackSide
            });
            const glowSphere = new THREE.Mesh(glowGeo, glowMat);
            node.add(glowSphere);
        });

        // Subtle energy particles
        const energyParticles = [];
        connections.forEach((conn, idx) => {
            if (idx % 2 === 0) {
                const particleGeo = new THREE.SphereGeometry(0.15, 8, 8);
                const particleMat = new THREE.MeshBasicMaterial({
                    color: 0xffd700,
                    transparent: true,
                    opacity: 0.8
                });
                const particle = new THREE.Mesh(particleGeo, particleMat);
                particle.userData = {
                    connectionIdx: idx,
                    progress: Math.random()
                };
                energyParticles.push(particle);
                scene.add(particle);
            }
        });

        // Minimal geometric elements
        const supportElements = [];

        // Subtle glass panels
        for(let i = 0; i < 2; i++) {
            const panelGeo = new THREE.PlaneGeometry(5, 8);
            const panelMat = new THREE.MeshPhysicalMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.05,
                metalness: 0.8,
                roughness: 0.2,
                side: THREE.DoubleSide
            });
            const panel = new THREE.Mesh(panelGeo, panelMat);
            panel.position.set(
                (Math.random() - 0.5) * 45,
                (Math.random() - 0.5) * 35,
                -35 - Math.random() * 15
            );
            panel.rotation.y = Math.random() * Math.PI;
            panel.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.0008
            };
            supportElements.push(panel);
            scene.add(panel);
        }

        // Wireframe cubes - fewer and smaller
        for(let i = 0; i < 3; i++) {
            const size = 1.5 + Math.random() * 2;
            const cubeGeo = new THREE.BoxGeometry(size, size, size);
            const cubeMat = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                wireframe: true,
                transparent: true,
                opacity: 0.12
            });
            const cube = new THREE.Mesh(cubeGeo, cubeMat);
            cube.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 40,
                -25 - Math.random() * 25
            );
            cube.userData = {
                rotSpeedX: (Math.random() - 0.5) * 0.002,
                rotSpeedY: (Math.random() - 0.5) * 0.002
            };
            supportElements.push(cube);
            scene.add(cube);
        }

        // Elegant particle system
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1800;
        const posArray = new Float32Array(particlesCount * 3);
        const sizeArray = new Float32Array(particlesCount);
        const velocityArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount; i++) {
            posArray[i * 3] = (Math.random() - 0.5) * 120;
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 80;
            posArray[i * 3 + 2] = -Math.random() * 70;

            sizeArray[i] = Math.random() * 0.06 + 0.02;

            velocityArray[i * 3] = (Math.random() - 0.5) * 0.008;
            velocityArray[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
            velocityArray[i * 3 + 2] = Math.random() * 0.015 + 0.008;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
        particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.04,
            color: 0xffdd88,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.set(0, 0, 35);

        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;
        let isTabActive = true;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        document.addEventListener('mousemove', (event) => {
            targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
            targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        document.addEventListener('visibilitychange', () => {
            isTabActive = !document.hidden;
        });

        const clock = new THREE.Clock();

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        function animate() {
            requestAnimationFrame(animate);

            if (!isTabActive || prefersReducedMotion) {
                renderer.render(scene, camera);
                return;
            }

            const time = clock.getElapsedTime();
            const delta = clock.getDelta();

            // Smooth mouse parallax with easing
            mouseX += (targetMouseX - mouseX) * 0.03;
            mouseY += (targetMouseY - mouseY) * 0.03;

            // Smoother logo animation
            logos.forEach((logo, index) => {
                // Gentle orbital motion
                const orbitAngle = time * 0.06 + logo.userData.phaseOffset;
                const orbitRadiusX = 25;
                const orbitRadiusZ = 12;
                
                const orbitX = Math.cos(orbitAngle) * orbitRadiusX;
                const orbitZ = Math.sin(orbitAngle) * orbitRadiusZ;
                
                // Smooth vertical float
                const floatY = Math.sin(time * logo.userData.floatSpeed + logo.userData.phaseOffset) * logo.userData.floatRangeY;

                // Subtle horizontal drift
                const driftX = Math.sin(time * logo.userData.floatSpeed * 0.6 + logo.userData.phaseOffset) * logo.userData.floatRangeX;

                // Final position
                logo.position.x = orbitX + driftX;
                logo.position.y = logo.userData.baseY + floatY;
                logo.position.z = logo.userData.baseZ + orbitZ;

                // Gentle rotation
                logo.rotation.x += logo.userData.rotSpeedX;
                logo.rotation.y += logo.userData.rotSpeedY;
                logo.rotation.z += logo.userData.rotSpeedZ;

                // Smooth opacity based on depth
                const distance = camera.position.distanceTo(logo.position);
                const opacity = THREE.MathUtils.clamp(1 - (distance - 20) / 45, 0.4, 0.85);
                logo.children[0].material.opacity = opacity;

                // Subtle breathing scale
                const scale = 1 + Math.sin(time * 0.5 + index) * 0.04;
                logo.scale.set(scale, scale, scale);

                // Update nodes
                if (nodes[index]) {
                    nodes[index].position.copy(logo.position);
                    const nodePulse = 1 + Math.sin(time * 1.5 + index * 0.5) * 0.15;
                    nodes[index].scale.set(nodePulse, nodePulse, nodePulse);
                }
            });

            // Update connection lines
            connectionLines.forEach(line => {
                const startLogo = logos[line.userData.startIdx];
                const endLogo = logos[line.userData.endIdx];

                if (startLogo && endLogo) {
                    const positions = line.geometry.attributes.position.array;
                    positions[0] = startLogo.position.x;
                    positions[1] = startLogo.position.y;
                    positions[2] = startLogo.position.z;
                    positions[3] = endLogo.position.x;
                    positions[4] = endLogo.position.y;
                    positions[5] = endLogo.position.z;
                    line.geometry.attributes.position.needsUpdate = true;

                    // Subtle pulsing opacity
                    line.material.opacity = 0.12 + Math.sin(time * 0.25 + line.userData.startIdx) * 0.08;
                }
            });

            // Smooth energy particles
            energyParticles.forEach(particle => {
                particle.userData.progress += delta * 0.08;
                if (particle.userData.progress > 1) {
                    particle.userData.progress = 0;
                }

                const connIdx = particle.userData.connectionIdx;
                const conn = connections[connIdx];
                if (conn) {
                    const startLogo = logos[conn[0]];
                    const endLogo = logos[conn[1]];
                    if (startLogo && endLogo) {
                        const t = particle.userData.progress;
                        particle.position.lerpVectors(startLogo.position, endLogo.position, t);
                        particle.material.opacity = Math.sin(t * Math.PI) * 0.5;
                    }
                }
            });

            // Subtle light pulsing
            glowLayers.forEach((light, idx) => {
                const baseIntensity = idx === 0 ? 1.8 : (idx === 1 ? 1.2 : 1.0);
                light.intensity = baseIntensity + Math.sin(time * 0.18 + idx) * 0.12;
            });

            // Support elements
            supportElements.forEach(el => {
                if (el.userData.rotSpeed) {
                    el.rotation.y += el.userData.rotSpeed;
                }
                if (el.userData.rotSpeedX) {
                    el.rotation.x += el.userData.rotSpeedX;
                    el.rotation.y += el.userData.rotSpeedY;
                }
            });

            // Smooth particle movement
            const positions = particlesGeometry.attributes.position.array;
            const velocities = particlesGeometry.attributes.velocity.array;

            for(let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;

                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];

                // Gentle wave
                positions[i3 + 1] += Math.sin(time * 0.25 + i * 0.015) * 0.0015;

                // Smooth respawn
                const margin = 8;

                if (positions[i3] > 60 + margin) {
                    positions[i3] = -60 - margin;
                    positions[i3 + 1] = (Math.random() - 0.5) * 80;
                    positions[i3 + 2] = -Math.random() * 70;
                } else if (positions[i3] < -60 - margin) {
                    positions[i3] = 60 + margin;
                    positions[i3 + 1] = (Math.random() - 0.5) * 80;
                    positions[i3 + 2] = -Math.random() * 70;
                }

                if (positions[i3 + 1] > 40 + margin) {
                    positions[i3 + 1] = -40 - margin;
                    positions[i3] = (Math.random() - 0.5) * 120;
                    positions[i3 + 2] = -Math.random() * 70;
                } else if (positions[i3 + 1] < -40 - margin) {
                    positions[i3 + 1] = 40 + margin;
                    positions[i3] = (Math.random() - 0.5) * 120;
                    positions[i3 + 2] = -Math.random() * 70;
                }

                if (positions[i3 + 2] > 8) {
                    positions[i3 + 2] = -70;
                    positions[i3] = (Math.random() - 0.5) * 120;
                    positions[i3 + 1] = (Math.random() - 0.5) * 80;
                }
            }

            particlesGeometry.attributes.position.needsUpdate = true;

            // Gentle camera parallax
            camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.015;
            camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.015;

            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        // Hide loading screen after everything loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                loadingScreen.classList.add('hidden');
            }, 2000); // 2 seconds minimum display time
        });

        // Fallback: hide after 3 seconds if load event doesn't fire
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (!loadingScreen.classList.contains('hidden')) {
                loadingScreen.classList.add('hidden');
            }
        }, 3000);

        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', !isExpanded);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Smooth scroll for nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu after click
                if (menuToggle && navLinks) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Portfolio filter
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    if (filter === 'all') {
                        item.classList.remove('hidden');
                    } else {
                        const category = item.getAttribute('data-category');
                        if (category === filter) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    }
                });
            });
        });

        // Portfolio hover and modal interactions
         portfolioItems.forEach(item => {
            const iframe = item.querySelector('iframe');
            const videoId = item.getAttribute('data-video');
            const platform = item.getAttribute('data-platform') || 'youtube';

            if (platform === 'youtube') {
                const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1`;

                item.addEventListener('mouseenter', () => {
                    iframe.src = embedUrl;
                    item.classList.add('playing');
                });

                item.addEventListener('mouseleave', () => {
                    iframe.src = '';
                    item.classList.remove('playing');
                });
            }

            item.addEventListener('click', (e) => {
                const startParam = videoId === '_VPNTwxWy8w' ? '?autoplay=1&start=38' : '?autoplay=1';
                videoFrame.src = `https://www.youtube.com/embed/${videoId}${startParam}`;
                videoModal.classList.add('active');
                if (platform === 'youtube') {
                    iframe.src = '';
                    item.classList.remove('playing');
                }
            });
        });

        // Video modal
        const videoModal = document.getElementById('videoModal');
        const videoFrame = document.getElementById('videoFrame');
        const closeModal = document.getElementById('closeModal');

        closeModal.addEventListener('click', (e) => {
            e.stopPropagation();
            videoModal.classList.remove('active');
            videoFrame.src = '';
        });

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.classList.remove('active');
                videoFrame.src = '';
            }
        });
