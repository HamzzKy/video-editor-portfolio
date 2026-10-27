// UI Interactions and Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle - light / dark
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            themeToggle.textContent = next === 'light' ? '🌙' : '☀️';
        });
    }

    // Hide loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) loadingScreen.classList.add('hidden');
        }, 1500);
    });

    // Fallback: hide after 3 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
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

    // Highlight current navigation section while scrolling
    const navAnchors = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    // Home active on load
    if (navAnchors.length > 0) {
        navAnchors[0].classList.add('active');
    }

    // Darken background the further down the page
    const bgShade = document.querySelector('.bg-shade');
    function updateShade() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        if (bgShade) bgShade.style.opacity = (progress * 0.8).toFixed(3);
        window.__particleDim = 1 - progress * 0.7;
    }

    // Active nav based on scroll position
    function updateActiveNav() {
        const marker = window.scrollY + window.innerHeight * 0.35;
        let currentSection = sections[0];
        sections.forEach(section => {
            if (section.offsetTop <= marker) currentSection = section;
        });
        navAnchors.forEach(anchor => {
            anchor.classList.toggle('active', anchor.getAttribute('href') === `#${currentSection.id}`);
        });
        updateShade();
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // Portfolio filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.getElementById('portfolioGrid');
    const originalPortfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
    if (portfolioGrid && originalPortfolioItems.length) {
        portfolioGrid.innerHTML = '';
        const columnCount = window.innerWidth < 600 ? 2 : window.innerWidth < 900 ? 3 : 5;
        const cardsPerColumn = 10;

        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            const column = document.createElement('div');
            column.className = `portfolio-column ${columnIndex % 2 === 0 ? 'column-up' : 'column-down'}`;
            const track = document.createElement('div');
            track.className = 'portfolio-column-track';

            for (let copy = 0; copy < cardsPerColumn * 2; copy++) {
                const source = originalPortfolioItems[(copy + columnIndex) % originalPortfolioItems.length];
                track.appendChild(source.cloneNode(true));
            }

            column.appendChild(track);
            portfolioGrid.appendChild(column);
        }
    }
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

    // Static corner glows - always visible in home, no JS needed

    // Certificate-style portfolio wall: a tilted, continuously moving archive.
    const viewport = document.getElementById('portfolioViewport');
    const grid = document.getElementById('portfolioGrid');
    let wallTarget = 0;
    let wallCurrent = 0;
    let wallDirection = -1;

    function wallMaxScroll() {
        if (!viewport || !grid) return 0;
        return Math.max(grid.offsetHeight - viewport.offsetHeight, 0);
    }

    function wallClamp() {
        const max = wallMaxScroll();
        if (wallTarget > 0) wallTarget = 0;
        if (wallTarget < -max) wallTarget = -max;
        if (wallCurrent > 0) wallCurrent = 0;
        if (wallCurrent < -max) wallCurrent = -max;
    }

    function wallCenter() {
        wallTarget = -wallMaxScroll() * 0.28;
        wallClamp();
    }

    if (viewport && grid) {
        wallCenter();

        viewport.addEventListener('mouseenter', () => { wallDirection = 0; });
        viewport.addEventListener('mouseleave', () => { wallDirection = -1; });
        viewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            wallTarget -= e.deltaY * 0.45;
            wallClamp();
        }, { passive: false });

        filterBtns.forEach(btn => btn.addEventListener('click', () => {
            setTimeout(wallClamp, 60);
        }));
        window.addEventListener('resize', wallClamp);
        window.addEventListener('load', wallCenter);

        (function wallLoop() {
            const visible = viewport.getBoundingClientRect().bottom > 0 &&
                viewport.getBoundingClientRect().top < window.innerHeight;
            if (visible && window.innerWidth >= 768) {
                const vRect = viewport.getBoundingClientRect();
                const midY = vRect.top + vRect.height / 2;
                portfolioItems.forEach(item => {
                    if (item.classList.contains('hidden')) return;
                    const r = item.getBoundingClientRect();
                    const norm = Math.max(-1.2, Math.min(1.2, (r.top + r.height / 2 - midY) / (vRect.height / 2)));
                    const c = Math.max(-1, Math.min(1, norm));
                    const hovered = item.matches(':hover');
                    const scale = ((hovered ? 1.04 : 1) - Math.abs(c) * 0.08).toFixed(3);
                    item.style.transform = `translateZ(${(Math.abs(c) * -20).toFixed(1)}px) scale(${scale})`;
                    item.style.zIndex = String(100 - Math.round(Math.abs(c) * 50));
                    item.style.opacity = (1 - Math.abs(c) * 0.2).toFixed(3);
                });
            } else if (window.innerWidth < 768) {
                portfolioItems.forEach(item => {
                    item.style.transform = '';
                    item.style.opacity = '';
                    item.style.zIndex = '';
                });
            }
            requestAnimationFrame(wallLoop);
        })();
    }
});
