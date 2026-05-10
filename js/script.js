/* ============================================
   ANIMEVERSE - JAVASCRIPT FUNCTIONALITY
   Premium Anime Streaming Platform
   ============================================ */

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initSidebar();
    initHeroSlider();
    initScrollAnimations();
    initBackToTop();
    initSearchFilter();
    initMobileNav();
    initToastSystem();
    initLibraryFilters();
    initHorizontalScroll();
    initScrollSpy();
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;

    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2200);
}

// ===== SIDEBAR =====
function initSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (!menuToggle || !sidebar) return;

    // Mobile Sidebar Bug Fix: Add close button dynamically
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.className = 'sidebar-close-btn';
    closeBtn.style.cssText = 'position:absolute; top:1.5rem; right:1.5rem; background:none; border:none; color:white; font-size:1.5rem; cursor:pointer; z-index:10001; display:none;';
    sidebar.appendChild(closeBtn);

    function toggleMenu(show) {
        if (show) {
            sidebar.classList.add('open');
            if (sidebarOverlay) sidebarOverlay.classList.add('active');
            // Prevent body scroll when menu is open on mobile
            if (window.innerWidth <= 1024) {
                document.body.style.overflow = 'hidden';
                closeBtn.style.display = 'block';
            }
        } else {
            sidebar.classList.remove('open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            // Restore body scroll
            document.body.style.overflow = '';
            closeBtn.style.display = 'none';
        }
    }

    menuToggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.contains('open');
        toggleMenu(!isOpen);
    });

    closeBtn.addEventListener('click', () => toggleMenu(false));

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => toggleMenu(false));
    }

    // Close sidebar when clicking nav items on mobile
    const navItems = sidebar.querySelectorAll('.sidebar-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 1024) toggleMenu(false);
        });
    });

    // Active nav item highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
            item.classList.add('active');
        }
    });
}

// ===== HERO SLIDER =====
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        if (dots.length > 0) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // Auto slide
    slideInterval = setInterval(nextSlide, 5000);

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });

    // Pause on hover
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== SEARCH FILTER =====
function initSearchFilter() {
    const searchInput = document.querySelector('.search-bar input');
    const animeCards = document.querySelectorAll('.anime-card[data-search]');
    const searchResultsInfo = document.querySelector('.search-results-info');
    const noResults = document.querySelector('.no-results');
    const animeGrid = document.querySelector('.anime-grid');

    if (!searchInput || animeCards.length === 0) return;

    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase().trim();

        searchTimeout = setTimeout(() => {
            let visibleCount = 0;

            animeCards.forEach(card => {
                const searchData = card.getAttribute('data-search').toLowerCase();
                const isMatch = searchData.includes(query);

                card.style.display = isMatch ? '' : 'none';
                if (isMatch) visibleCount++;
            });

            // Update results info
            if (searchResultsInfo) {
                if (query.length > 0) {
                    searchResultsInfo.innerHTML = `Found <span>${visibleCount}</span> results for "${query}"`;
                    searchResultsInfo.style.display = 'block';
                } else {
                    searchResultsInfo.style.display = 'none';
                }
            }

            // Show/hide no results message
            if (noResults) {
                noResults.style.display = (query.length > 0 && visibleCount === 0) ? 'block' : 'none';
            }

            // Adjust grid layout
            if (animeGrid) {
                const visibleCards = animeGrid.querySelectorAll('.anime-card[style=""]');
                if (visibleCards.length === 0 && query.length > 0) {
                    animeGrid.style.display = 'none';
                } else {
                    animeGrid.style.display = 'grid';
                }
            }
        }, 300);
    });
}

// ===== MOBILE NAV =====
function initMobileNav() {
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// ===== TOAST NOTIFICATIONS =====
function initToastSystem() {
    window.showToast = function(message, type = 'success') {
        let container = document.querySelector('.toast-container');

        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Add to list buttons
    document.querySelectorAll('.btn-add-list').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showToast('Added to your list!', 'success');
        });
    });

    // Watch now buttons
    document.querySelectorAll('.btn-watch').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Starting playback...', 'success');
        });
    });

    // Subscribe buttons
    document.querySelectorAll('.plan-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Redirecting to payment...', 'success');
        });
    });

    // Contact form
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message sent successfully!', 'success');
            contactForm.reset();
        });
    }

    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Subscribed successfully!', 'success');
            newsletterForm.reset();
        });
    }
}

// ===== LIBRARY FILTERS =====
function initLibraryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const animeCards = document.querySelectorAll('.anime-card[data-genre]');

    if (filterBtns.length === 0 || animeCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            animeCards.forEach(card => {
                const genres = card.getAttribute('data-genre').toLowerCase().split(',');

                if (filter === 'all' || genres.includes(filter.toLowerCase())) {
                    card.style.display = '';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== HORIZONTAL SCROLL =====
function initHorizontalScroll() {
    const scrollContainers = document.querySelectorAll('.scroll-container');

    scrollContainers.forEach(container => {
        const prevBtn = container.parentElement.querySelector('.scroll-prev');
        const nextBtn = container.parentElement.querySelector('.scroll-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                container.scrollBy({ left: -300, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                container.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== PARALLAX EFFECT FOR HERO =====
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const scrolled = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    if (scrolled < heroHeight) {
        const heroBg = heroSection.querySelector('.hero-slide-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.top-navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(11, 11, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = '';
        navbar.style.boxShadow = '';
    }
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Escape to close sidebar
    if (e.key === 'Escape') {
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
    }
});

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== PERFORMANCE: Debounce function =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== RESIZE HANDLER =====
const handleResize = debounce(() => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (window.innerWidth > 1024) {
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    }
}, 250);

window.addEventListener('resize', handleResize);

// ===== PREFERS REDUCED MOTION =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

// ===== SCROLL SPY =====
function initScrollSpy() {
    const sections = document.querySelectorAll('.hero-section, section[id]');
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    const indicator = document.querySelector('.nav-indicator');

    function updateIndicator(activeItem) {
        if (!indicator || !activeItem) return;
        indicator.style.top = activeItem.offsetTop + 'px';
        indicator.style.height = activeItem.offsetHeight + 'px';
        indicator.style.opacity = '1';
    }

    // Instantly highlight on click
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const href = this.getAttribute('href');
            if (href && (href === 'index.html' || href.includes('#'))) {
                navItems.forEach(nav => {
                    const navHref = nav.getAttribute('href');
                    if (navHref && (navHref === 'index.html' || navHref.includes('#'))) {
                        nav.classList.remove('active');
                    }
                });
                this.classList.add('active');
                updateIndicator(this);
            }
        });
    });

    // Update highlight on scroll
    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // If the section top is above the middle of the screen
            if (rect.top <= window.innerHeight / 2.5) {
                if(section.classList.contains('hero-section')) {
                    current = 'index.html';
                } else {
                    current = 'index.html#' + section.getAttribute('id');
                }
            }
        });

        if (current) {
            navItems.forEach(item => {
                const href = item.getAttribute('href');
                if (href && (href === 'index.html' || href.includes('#'))) {
                    item.classList.remove('active');
                    if (href === current) {
                        item.classList.add('active');
                        updateIndicator(item);
                    }
                }
            });
        }
    });

    // Handle initial state and resize
    const setInitialState = () => {
        window.dispatchEvent(new Event('scroll'));
        const initialActive = document.querySelector('.sidebar-nav-item.active');
        if (initialActive) updateIndicator(initialActive);
    };

    setTimeout(setInitialState, 100);
    window.addEventListener('resize', () => {
        const activeItem = document.querySelector('.sidebar-nav-item.active');
        if (activeItem) updateIndicator(activeItem);
    });
}
