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
        scene.background = new THREE.Color(0x0d0d0d);
        scene.fog = new THREE.FogExp2(0x0d0d0d, 0.006);

        // Consistent ambient lighting for all logos
        const ambientLight = new THREE.AmbientLight(0x6688aa, 0.6);
        scene.add(ambientLight);

        // Main key light for uniform illumination
        const keyLight = new THREE.DirectionalLight(0x88aacc, 1.0);
        keyLight.position.set(0, 20, 30);
        scene.add(keyLight);

        // Backlights for depth and glow
        const backLight1 = new THREE.PointLight(0x4ecdc4, 2.0, 120);
        backLight1.position.set(0, 0, -45);
        scene.add(backLight1);

        const backLight2 = new THREE.PointLight(0x6699bb, 1.5, 100);
        backLight2.position.set(-25, 10, -40);
        scene.add(backLight2);

        const backLight3 = new THREE.PointLight(0xff6b6b, 1.2, 90);
        backLight3.position.set(25, -10, -40);
        scene.add(backLight3);

        // Rim lights for consistent edge definition
        const rimLight1 = new THREE.DirectionalLight(0x99bbcc, 0.8);
        rimLight1.position.set(-30, 15, -15);
        scene.add(rimLight1);

        const rimLight2 = new THREE.DirectionalLight(0x4ecdc4, 0.6);
        rimLight2.position.set(30, -10, -15);
        scene.add(rimLight2);

        const glowLayers = [backLight1, backLight2, backLight3];

        // Software logos spread across scene like before
        const softwareLogos = [
{ name: 'Premiere Pro', image: 'logo/pr-new.png', pos: [-25, 8, -20], scale: 7 },
             { name: 'After Effects', image: 'logo/ae-new.png', pos: [28, -5, -25], scale: 6.5 },
             { name: 'CapCut', image: 'logo/Capcut-icon.png', pos: [-30, -12, -15], scale: 5.5 },
             { name: 'Photoshop', image: 'logo/ps-new.png', pos: [25, 15, -30], scale: 6.8 },
             { name: 'DaVinci', image: 'logo/davinci-new.png', pos: [-18, -18, -35], scale: 6 }
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
                opacity: 0.9,
                side: THREE.DoubleSide,
                metalness: 0.3,
                roughness: 0.4,
                emissive: 0x4ecdc4,
                emissiveIntensity: 0.1
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);

            // Back layer for depth effect
            const backMaterial = material.clone();
            backMaterial.opacity = 0.3;
            backMaterial.emissiveIntensity = 0.05;
            const backMesh = new THREE.Mesh(geometry, backMaterial);
            backMesh.position.z = -0.3;
            group.add(backMesh);

            // Rim glow effect
            const glowGeometry = new THREE.PlaneGeometry(scale * 1.1, scale * 1.1);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x4ecdc4,
                transparent: true,
                opacity: 0.1,
                side: THREE.DoubleSide
            });
            const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
            glowMesh.position.z = -0.5;
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
                floatSpeed: 0.4 + Math.random() * 0.5,
                floatRangeY: 3 + Math.random() * 2,
                floatRangeX: 1.5 + Math.random() * 1,
                driftSpeedX: (Math.random() - 0.5) * 0.015,
                driftSpeedZ: (Math.random() - 0.5) * 0.01,
                rotSpeedX: (Math.random() - 0.5) * 0.003,
                rotSpeedY: (Math.random() - 0.5) * 0.004,
                rotSpeedZ: (Math.random() - 0.5) * 0.002,
                phaseOffset: index * 1.5,
                orbitRadius: 2 + Math.random() * 3,
                orbitSpeed: 0.2 + Math.random() * 0.3
            };

            logos.push(logo);
            scene.add(logo);
        });

        // More connection lines between logos
        const connectionLines = [];
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0x4ecdc4,
            transparent: true,
            opacity: 0.35,
            linewidth: 1
        });

        // More connections for better network effect
        const connections = [
            [0, 1], // Premiere to After Effects
            [0, 2], // Premiere to CapCut
            [0, 4], // Premiere to DaVinci
            [1, 3], // After Effects to Photoshop
            [1, 4], // After Effects to DaVinci
            [2, 3], // CapCut to Photoshop
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
                baseOpacity: 0.3 + Math.random() * 0.3
            };
            connectionLines.push(line);
            scene.add(line);
        });

        // Glowing nodes at logo positions
        const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const nodes = [];

        logos.forEach((logo, index) => {
            const nodeMat = new THREE.MeshBasicMaterial({
                color: 0x4ecdc4,
                transparent: true,
                opacity: 0.8
            });
            const node = new THREE.Mesh(nodeGeometry, nodeMat);
            node.userData = { logoIndex: index };
            nodes.push(node);
            scene.add(node);

            // Add glow sphere around node
            const glowGeo = new THREE.SphereGeometry(0.6, 16, 16);
            const glowMat = new THREE.MeshBasicMaterial({
                color: 0x4ecdc4,
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
            });
            const glowSphere = new THREE.Mesh(glowGeo, glowMat);
            node.add(glowSphere);
        });

        // Energy particles moving along lines
        const energyParticles = [];
        connections.forEach((conn, idx) => {
            if (idx % 2 === 0) { // Only on some lines
                const particleGeo = new THREE.SphereGeometry(0.2, 8, 8);
                const particleMat = new THREE.MeshBasicMaterial({
                    color: idx % 3 === 0 ? 0xff6b6b : 0x4ecdc4,
                    transparent: true,
                    opacity: 0.9
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

        // Supporting geometric elements
        const supportElements = [];

        // Glass panels
        for(let i = 0; i < 3; i++) {
            const panelGeo = new THREE.PlaneGeometry(6, 10);
            const panelMat = new THREE.MeshPhysicalMaterial({
                color: 0x4ecdc4,
                transparent: true,
                opacity: 0.08,
                metalness: 0.9,
                roughness: 0.1,
                side: THREE.DoubleSide
            });
            const panel = new THREE.Mesh(panelGeo, panelMat);
            panel.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 40,
                -40 - Math.random() * 20
            );
            panel.rotation.y = Math.random() * Math.PI;
            panel.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.001
            };
            supportElements.push(panel);
            scene.add(panel);
        }

        // Wireframe cubes
        for(let i = 0; i < 4; i++) {
            const size = 2 + Math.random() * 3;
            const cubeGeo = new THREE.BoxGeometry(size, size, size);
            const cubeMat = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x4ecdc4 : 0xff6b6b,
                wireframe: true,
                transparent: true,
                opacity: 0.15
            });
            const cube = new THREE.Mesh(cubeGeo, cubeMat);
            cube.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 50,
                -20 - Math.random() * 30
            );
            cube.userData = {
                rotSpeedX: (Math.random() - 0.5) * 0.003,
                rotSpeedY: (Math.random() - 0.5) * 0.003
            };
            supportElements.push(cube);
            scene.add(cube);
        }

        // Dense particles covering entire screen - much more for full coverage
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2500;
        const posArray = new Float32Array(particlesCount * 3);
        const sizeArray = new Float32Array(particlesCount);
        const velocityArray = new Float32Array(particlesCount * 3);

        // Fill entire viewport space with dense particles
        for(let i = 0; i < particlesCount; i++) {
            // Full coverage - extra wide to cover all screen sizes
            posArray[i * 3] = (Math.random() - 0.5) * 150;
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 100;
            posArray[i * 3 + 2] = -Math.random() * 80;

            sizeArray[i] = Math.random() * 0.07 + 0.03;

            // Random velocity for continuous movement
            velocityArray[i * 3] = (Math.random() - 0.5) * 0.01;
            velocityArray[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
            velocityArray[i * 3 + 2] = Math.random() * 0.02 + 0.01;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
        particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xdddddd,
            transparent: true,
            opacity: 0.6,
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

            // Animate logos with dynamic orbital motion
            logos.forEach((logo, index) => {
                // Solar system orbital rotation around center
                const solarOrbitAngle = time * 0.08 + logo.userData.phaseOffset; // Slow orbit speed
                const solarRadiusX = 30; // Distance from center (increased)
                const solarRadiusZ = 15; // Depth (increased)
                
                const solarOrbitX = Math.cos(solarOrbitAngle) * solarRadiusX;
                const solarOrbitZ = Math.sin(solarOrbitAngle) * solarRadiusZ;
                
                // Vertical floating
                const floatY = Math.sin(time * logo.userData.floatSpeed + logo.userData.phaseOffset) * logo.userData.floatRangeY;

                // Horizontal wave drift (smaller now)
                const driftX = Math.sin(time * logo.userData.floatSpeed * 0.7 + logo.userData.phaseOffset) * (logo.userData.floatRangeX * 0.3);

                // Small local circular orbital motion
                const orbitAngle = time * logo.userData.orbitSpeed + logo.userData.phaseOffset;
                const orbitX = Math.cos(orbitAngle) * logo.userData.orbitRadius;
                const orbitZ = Math.sin(orbitAngle) * (logo.userData.orbitRadius * 0.5);

                // Combine solar system orbit + local movement
                logo.position.x = solarOrbitX + driftX + orbitX;
                logo.position.y = logo.userData.baseY + floatY;
                logo.position.z = logo.userData.baseZ + solarOrbitZ + orbitZ;

                // Dynamic 3D rotation
                logo.rotation.x += logo.userData.rotSpeedX;
                logo.rotation.y += logo.userData.rotSpeedY;
                logo.rotation.z += logo.userData.rotSpeedZ;

            // Depth-based opacity
                const distance = camera.position.distanceTo(logo.position);
                const opacity = THREE.MathUtils.clamp(1 - (distance - 20) / 40, 0.3, 1);
                logo.children[0].material.opacity = opacity * 0.9;



                // Dynamic scale with breathing
                const scale = 1 + Math.sin(time * 0.6 + index) * 0.05;
                logo.scale.set(scale, scale, scale);

                // Update node positions to follow logos
                if (nodes[index]) {
                    nodes[index].position.copy(logo.position);
                    // Node pulse
                    const nodePulse = 1 + Math.sin(time * 2 + index * 0.5) * 0.2;
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

                    // Subtle opacity
                    line.material.opacity = 0.15 + Math.sin(time * 0.3 + line.userData.startIdx) * 0.05;
                }
            });

            // Animate energy particles
            energyParticles.forEach(particle => {
                particle.userData.progress += delta * 0.1;
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
                        particle.material.opacity = Math.sin(t * Math.PI) * 0.6;
                    }
                }
            });

            // Minimal light variation
            glowLayers.forEach((light, idx) => {
                const baseIntensity = idx === 0 ? 1.5 : 0.8;
                light.intensity = baseIntensity + Math.sin(time * 0.2 + idx) * 0.1;
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

            // Continuous particle movement with aggressive respawn
            const positions = particlesGeometry.attributes.position.array;
            const velocities = particlesGeometry.attributes.velocity.array;

            for(let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;

                // Apply velocity
                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];

                // Add gentle wave motion
                positions[i3 + 1] += Math.sin(time * 0.3 + i * 0.02) * 0.002;

                // Aggressive respawn to maintain full coverage
                const respawnMargin = 10;

                // X bounds - respawn from opposite side
                if (positions[i3] > 75 + respawnMargin) {
                    positions[i3] = -75 - respawnMargin;
                    positions[i3 + 1] = (Math.random() - 0.5) * 100;
                    positions[i3 + 2] = -Math.random() * 80;
                } else if (positions[i3] < -75 - respawnMargin) {
                    positions[i3] = 75 + respawnMargin;
                    positions[i3 + 1] = (Math.random() - 0.5) * 100;
                    positions[i3 + 2] = -Math.random() * 80;
                }

                // Y bounds - respawn from opposite side
                if (positions[i3 + 1] > 50 + respawnMargin) {
                    positions[i3 + 1] = -50 - respawnMargin;
                    positions[i3] = (Math.random() - 0.5) * 150;
                    positions[i3 + 2] = -Math.random() * 80;
                } else if (positions[i3 + 1] < -50 - respawnMargin) {
                    positions[i3 + 1] = 50 + respawnMargin;
                    positions[i3] = (Math.random() - 0.5) * 150;
                    positions[i3 + 2] = -Math.random() * 80;
                }

                // Z bounds - respawn from back
                if (positions[i3 + 2] > 10) {
                    positions[i3 + 2] = -80;
                    positions[i3] = (Math.random() - 0.5) * 150;
                    positions[i3 + 1] = (Math.random() - 0.5) * 100;
                }
            }

            particlesGeometry.attributes.position.needsUpdate = true;

            // Subtle camera parallax
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
            camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;

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

        // Smooth scroll for nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
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
