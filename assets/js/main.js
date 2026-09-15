/**
 * Navi Engineers and Consultants - Main JavaScript
 * Handles hero slider, mobile navigation, and scroll animations
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
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
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

    // ===== MOBILE NAV TOGGLE (handled by Bootstrap, but keeping for compatibility) =====
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });
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

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('mainNav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(20, 20, 20, 0.98)';
            } else {
                navbar.style.background = 'rgba(30, 30, 30, 0.95)';
            }
        });
    }

    // ===== FILE UPLOAD PREVIEW =====
    const fileUpload = document.querySelector('.file-upload');
    if (fileUpload) {
        const fileInput = fileUpload.querySelector('input[type="file"]');
        fileUpload.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name;
            if (fileName) {
                fileUpload.querySelector('p').textContent = `Selected: ${fileName}`;
            }
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();