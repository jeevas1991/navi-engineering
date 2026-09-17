/**
 * Navi Engineers and Consultants - Main JavaScript
 * Brand theme: Navy (#0F2A5C) + Amber (#E8873A)
 * Handles hero slider, mobile navigation, scroll animations
 */

(function() {
    'use strict';

    // ===== HERO SLIDER =====
    const track = document.getElementById('sliderTrack');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    if (track && dots.length > 0) {
        let currentIndex = 0;
        const totalSlides = dots.length;
        let autoPlayInterval;

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function nextSlide() { goToSlide(currentIndex + 1); }
        function prevSlide() { goToSlide(currentIndex - 1); }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoPlay();
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5500);
        }
        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        const slider = document.getElementById('heroSlider');
        if (slider) {
            slider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            slider.addEventListener('mouseleave', startAutoPlay);
        }

        goToSlide(0);
        startAutoPlay();
    }

    // ===== SCROLL ANIMATIONS (Intersection Observer) =====
    const slideElements = document.querySelectorAll('.scroll-slide');
    if (slideElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -20px 0px'
        });
        slideElements.forEach(el => observer.observe(el));
    }

    // ===== NAVBAR SCROLL EFFECT (Navy brand theme) =====
    const navbar = document.getElementById('mainNav');
    if (navbar) {
        const NAVY_DARK = 'rgba(8, 26, 61, 0.98)';
        const NAVY_MAIN = 'rgba(15, 42, 92, 0.96)';

        function updateNavbar() {
            if (window.scrollY > 50) {
                navbar.style.background = NAVY_DARK;
            } else {
                navbar.style.background = NAVY_MAIN;
            }
        }
        window.addEventListener('scroll', updateNavbar);
        updateNavbar();
    }

    // ===== MOBILE NAV: AUTO-CLOSE ON LINK CLICK =====
    // Closes the Bootstrap collapse menu when a nav-link or the CTA is clicked
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        const navLinks = navMenu.querySelectorAll('.nav-link, .btn-nav-cta');
        const collapseInstance = () => bootstrap.Collapse.getInstance(navMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Only act on mobile where the menu is collapsed
                if (window.innerWidth < 992) {
                    const bsCollapse =
                        bootstrap.Collapse.getInstance(navMenu) ||
                        new bootstrap.Collapse(navMenu, { toggle: false });
                    if (navMenu.classList.contains('show')) {
                        bsCollapse.hide();
                    }
                }
            });
        });
    }

    // ===== NAVBAR TOGGLER ICON ANIMATION =====
    // Optional: swap ☰ icon to ✕ when menu is open
    const navMenuEl = document.getElementById('navMenu');
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navMenuEl && navbarToggler) {
        navMenuEl.addEventListener('show.bs.collapse', () => {
            navbarToggler.setAttribute('aria-expanded', 'true');
        });
        navMenuEl.addEventListener('hide.bs.collapse', () => {
            navbarToggler.setAttribute('aria-expanded', 'false');
        });
    }

    // ===== FILE UPLOAD PREVIEW =====
    const fileUpload = document.querySelector('.file-upload');
    if (fileUpload) {
        const fileInput = fileUpload.querySelector('input[type="file"]');
        if (fileInput) {
            fileUpload.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                const fileName = e.target.files[0]?.name;
                if (fileName) {
                    const label = fileUpload.querySelector('.file-upload-label');
                    if (label) {
                        label.textContent = `Selected: ${fileName}`;
                    } else {
                        const p = fileUpload.querySelector('p');
                        if (p) p.textContent = `Selected: ${fileName}`;
                    }
                }
            });
        }
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

})();