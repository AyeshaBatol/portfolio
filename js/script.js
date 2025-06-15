document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with error handling
    try {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: 'mobile' // Disable animations on mobile for better performance
        });
    } catch (error) {
        console.error('AOS initialization failed:', error);
    }

    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.5,
                onComplete: function() {
                    preloader.style.display = 'none';
                }
            });
        }
    });

    //logo animation
    
    
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
            navList.setAttribute('aria-expanded', navList.classList.contains('active'));
            
            const bars = document.querySelectorAll('.bar');
            if (this.classList.contains('active')) {
                gsap.to(bars[0], { y: 8, rotate: 45, duration: 0.3 });
                gsap.to(bars[1], { opacity: 0, duration: 0.3 });
                gsap.to(bars[2], { y: -8, rotate: -45, duration: 0.3 });
            } else {
                gsap.to(bars[0], { y: 0, rotate: 0, duration: 0.3 });
                gsap.to(bars[1], { opacity: 1, duration: 0.3 });
                gsap.to(bars[2], { y: 0, rotate: 0, duration: 0.3 });
            }
        });
    }

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navList?.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navList.classList.remove('active');
                navList.setAttribute('aria-expanded', 'false');
                
                const bars = document.querySelectorAll('.bar');
                gsap.to(bars[0], { y: 0, rotate: 0, duration: 0.3 });
                gsap.to(bars[1], { opacity: 1, duration: 0.3 });
                gsap.to(bars[2], { y: 0, rotate: 0, duration: 0.3 });
            }
        });
    });

    // Debounce function for scroll events
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Navbar scroll effect
    const handleScroll = debounce(function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }, 50);

    window.addEventListener('scroll', handleScroll);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    gsap.from('.hero h1', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.hero .subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-btns', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
    });
    
    gsap.from('.image-container', {
        opacity: 0,
        x: 100,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    // Contact form animation
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        x: 100,
        duration: 1,
        ease: 'power3.out'
    });

    // Floating animation
    const floatElements = document.querySelectorAll('.image-container');
    floatElements.forEach(el => {
        gsap.to(el, {
            y: 20,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });

    // Dynamic Portfolio
    const portfolioGrid = document.getElementById('portfolio-grid');
    const viewAllBtn = document.getElementById('view-all-btn');
    const mediaItems = [];
    
    // Load images (1.jpg to 20.jpg)
    for (let i = 1; i <= 20; i++) {
        mediaItems.push({
            type: 'image',
            src: `images/${i}.jpg`,
            title: `Design ${i}`,
            category: ['Branding', 'Editorial', 'Poster', 'Web UI'][Math.floor(Math.random() * 4)]
        });
    }
    
    // Load videos (21.mp4 to 25.mp4)
    for (let i = 21; i <= 25; i++) {
        mediaItems.push({
            type: 'video',
            src: `videos/${i}.mp4`,
            title: `Video ${i - 20}`,
            category: 'Motion Design'
        });
    }

    // Check if media file exists
    const checkMediaExists = (src, type) => {
        return new Promise((resolve) => {
            if (type === 'image') {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
            } else {
                const video = document.createElement('video');
                video.src = src;
                video.onloadedmetadata = () => resolve(true);
                video.onerror = () => resolve(false);
            }
        });
    };

    // Populate Portfolio
    async function populatePortfolio() {
        const validItems = [];
        for (const item of mediaItems) {
            const exists = await checkMediaExists(item.src, item.type);
            if (exists) {
                validItems.push(item);
            }
        }

        if (validItems.length === 0) {
            portfolioGrid.innerHTML = '<p>No media available.</p>';
            viewAllBtn.style.display = 'none';
            return;
        }

        // Shuffle array
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const shuffledItems = shuffleArray([...validItems]);

        // Create portfolio items
        shuffledItems.forEach((item, index) => {
            const workItem = document.createElement('div');
            workItem.classList.add('work-item');
            if (index >= 6) workItem.classList.add('hidden');
            workItem.dataset.index = index;
            workItem.dataset.src = item.src;
            workItem.dataset.type = item.type;
            workItem.setAttribute('role', 'button');
            workItem.setAttribute('aria-label', `View ${item.title}`);
            
            const mediaElement = item.type === 'image' 
                ? `<img src="${item.src}" alt="${item.title}" loading="lazy">`
                : `<video muted playsinline><source src="${item.src}" type="video/mp4"></video>`;
            
            workItem.innerHTML = `
                <div class="work-img">
                    ${mediaElement}
                </div>
                <div class="work-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.category}</p>
                    <a href="#" class="view-btn" aria-label="View ${item.title} details">View</a>
                </div>
            `;
            portfolioGrid.appendChild(workItem);
        });

        // View All Work Button
        if (shuffledItems.length <= 6) {
            viewAllBtn.style.display = 'none';
        } else {
            viewAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const hiddenItems = document.querySelectorAll('.work-item.hidden');
                hiddenItems.forEach((item, i) => {
                    item.classList.remove('hidden');
                    gsap.from(item, {
                        opacity: 0,
                        y: 50,
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: 'power3.out'
                    });
                });
                gsap.to(viewAllBtn, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => viewAllBtn.style.display = 'none'
                });
            });
        }

        // Work item animations
        const workItems = document.querySelectorAll('.work-item:not(.hidden)');
        workItems.forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        // Hover effects for work items
        document.querySelectorAll('.work-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            item.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Image/Video Overlay Functionality
        const overlay = document.getElementById('imageOverlay');
        const overlayImage = document.getElementById('overlayImage');
        const overlayVideo = document.getElementById('overlayVideo');
        const closeOverlay = document.getElementById('closeOverlay');
        const prevImage = document.getElementById('prevImage');
        const nextImage = document.getElementById('nextImage');
        let currentIndex = -1;
        let isTransitioning = false;

        const resetMedia = () => {
            overlayImage.src = '';
            overlayImage.style.display = 'none';
            overlayVideo.src = '';
            overlayVideo.pause();
            overlayVideo.style.display = 'none';
        };

        const openOverlay = (src, type, index) => {
            if (isTransitioning) return;
            currentIndex = parseInt(index);
            
            resetMedia();
            
            if (type === 'image') {
                overlayImage.src = src;
                overlayImage.style.display = 'block';
                overlayImage.style.opacity = '0';
                overlayImage.onload = () => {
                    gsap.to(overlayImage, { opacity: 1, duration: 0.3, ease: 'power2.out' });
                };
            } else {
                overlayVideo.src = src;
                overlayVideo.style.display = 'block';
                overlayVideo.style.opacity = '0';
                overlayVideo.load();
                overlayVideo.onloadeddata = () => {
                    overlayVideo.play().catch(() => {});
                    gsap.to(overlayVideo, { opacity: 1, duration: 0.3, ease: 'power2.out' });
                };
            }
            
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            gsap.to(overlay, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        const updateOverlay = (direction) => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            const items = document.querySelectorAll('.work-item');
            currentIndex = (currentIndex + direction + items.length) % items.length;
            
            const item = items[currentIndex];
            const src = item.dataset.src;
            const type = item.dataset.type;
            
            gsap.to('.overlay-content', {
                opacity: 0,
                x: direction > 0 ? -50 : 50,
                duration: 0.15,
                ease: 'power2.out',
                onComplete: () => {
                    resetMedia();
                    
                    if (type === 'image') {
                        overlayImage.src = src;
                        overlayImage.style.display = 'block';
                        overlayImage.onload = () => {
                            gsap.fromTo('.overlay-content', 
                                { opacity: 0, x: direction > 0 ? 50 : -50 },
                                { opacity: 1, x: 0, duration: 0.15, ease: 'power2.out', onComplete: () => isTransitioning = false }
                            );
                        };
                    } else {
                        overlayVideo.src = src;
                        overlayVideo.style.display = 'block';
                        overlayVideo.load();
                        overlayVideo.onloadeddata = () => {
                            overlayVideo.play().catch(() => {});
                            gsap.fromTo('.overlay-content', 
                                { opacity: 0, x: direction > 0 ? 50 : -50 },
                                { opacity: 1, x: 0, duration: 0.15, ease: 'power2.out', onComplete: () => isTransitioning = false }
                            );
                        };
                    }
                }
            });
        };

        const closeOverlayFn = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                    overlay.classList.remove('active');
                    overlay.setAttribute('aria-hidden', 'true');
                    resetMedia();
                    document.body.style.overflow = '';
                    isTransitioning = false;
                }
            });
        };

        document.querySelectorAll('.work-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const src = this.dataset.src;
                const type = this.dataset.type;
                const index = this.dataset.index;
                openOverlay(src, type, index);
            });
        });

        if (closeOverlay && prevImage && nextImage) {
            closeOverlay.addEventListener('click', closeOverlayFn);
            prevImage.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from reaching overlay
                updateOverlay(-1);
            });
            nextImage.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from reaching overlay
                updateOverlay(1);
            });
        }

        // Close when clicking on overlay background (outside content)
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeOverlayFn();
                }
            });
        }

        // Prevent clicks on the content from closing the overlay
        const overlayContent = document.querySelector('.overlay-content');
        if (overlayContent) {
            overlayContent.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from bubbling up to overlay
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (overlay?.classList.contains('active') && !isTransitioning) {
                if (e.key === 'ArrowLeft') updateOverlay(-1);
                if (e.key === 'ArrowRight') updateOverlay(1);
                if (e.key === 'Escape') closeOverlayFn();
            }
        });

        // Mobile touch swipe
        let touchStartX = 0;
        let touchEndX = 0;

        if (overlay) {
            overlay.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            overlay.addEventListener('touchend', (e) => {
                if (isTransitioning) return;
                touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchEndX - touchStartX;
                if (Math.abs(swipeDistance) > 50) {
                    if (swipeDistance > 0) updateOverlay(-1);
                    else updateOverlay(1);
                }
            });
        }
    }

    // Initialize portfolio
    populatePortfolio();
});