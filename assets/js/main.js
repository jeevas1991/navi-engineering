/**
 * Navi Engineers and Consultants - Main JavaScript
 * Brand theme: Navy (#0F2A5C) + Amber (#E8873A)
 * Handles: hero slider (video + images), scroll animations,
 *          mobile nav auto-close, file upload preview, smooth scroll
 */

(function () {
    'use strict';

    /* ========================================================
       HERO SLIDER (video plays to completion, then advances)
       ======================================================== */
    const track = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const heroVideo = document.getElementById('heroVideo');
    const videoControl = document.getElementById('videoControl');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        // Timers
        let imageTimer = null;
        let videoSafetyTimer = null;

        // Session guard — invalidates stale 'ended' handlers
        let videoSession = 0;

        /* ---------- helpers ---------- */
        function isVideoSlide(index) {
            const s = slides[index];
            return !!(s && s.classList.contains('slide-video'));
        }

        function clearImageTimer() {
            if (imageTimer) { clearTimeout(imageTimer); imageTimer = null; }
        }

        function clearVideoSafetyTimer() {
            if (videoSafetyTimer) { clearTimeout(videoSafetyTimer); videoSafetyTimer = null; }
        }

        function clearAllTimers() {
            clearImageTimer();
            clearVideoSafetyTimer();
        }

        /* ---------- video slide ---------- */
        function startVideoSlide() {
            if (!heroVideo) {
                imageTimer = setTimeout(function () { nextSlide(); }, 5500);
                return;
            }

            videoSession++;
            const mySession = videoSession;
            clearAllTimers();

            try {
                heroVideo.pause();
                heroVideo.currentTime = 0;
            } catch (e) { /* ignore */ }

            const playPromise = heroVideo.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    clearImageTimer();
                    imageTimer = setTimeout(function () {
                        if (currentIndex === 0) nextSlide();
                    }, 10000);
                });
            }

            if (videoControl) {
                const icon = videoControl.querySelector('i');
                if (icon) icon.className = 'fas fa-pause';
            }

            if (!heroVideo.dataset.endedAttached) {
                heroVideo.addEventListener('ended', function () {
                    if (isVideoSlide(currentIndex) && videoSession === mySession) {
                        nextSlide();
                    }
                });
                heroVideo.dataset.endedAttached = 'true';
            }

            clearVideoSafetyTimer();
            videoSafetyTimer = setTimeout(function () {
                if (currentIndex === 0 && heroVideo && !heroVideo.paused) {
                    heroVideo.pause();
                    nextSlide();
                }
            }, 60000);
        }

        function stopVideoSlide() {
            if (!heroVideo) return;
            videoSession++;
            try {
                heroVideo.pause();
                heroVideo.currentTime = 0;
            } catch (e) { /* ignore */ }
            clearVideoSafetyTimer();
        }

        /* ---------- goToSlide ---------- */
        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;

            const wasVideo = isVideoSlide(currentIndex);
            const goingToVideo = isVideoSlide(index);

            if (wasVideo && !goingToVideo) stopVideoSlide();

            clearImageTimer();

            currentIndex = index;
            track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentIndex);
            });

            if (goingToVideo) {
                startVideoSlide();
            } else {
                imageTimer = setTimeout(function () { nextSlide(); }, 5500);
            }
        }

        function nextSlide() { goToSlide(currentIndex + 1); }
        function prevSlide() { goToSlide(currentIndex - 1); }

        /* ---------- dot & arrow handlers ---------- */
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                const target = parseInt(dot.dataset.index, 10);
                if (!isNaN(target)) goToSlide(target);
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                goToSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                goToSlide(currentIndex + 1);
            });
        }

        /* ---------- hover pause (image slides only) ---------- */
        const slider = document.getElementById('heroSlider');
        if (slider) {
            slider.addEventListener('mouseenter', function () {
                if (!isVideoSlide(currentIndex)) clearImageTimer();
            });
            slider.addEventListener('mouseleave', function () {
                if (!isVideoSlide(currentIndex)) {
                    clearImageTimer();
                    imageTimer = setTimeout(function () { nextSlide(); }, 5500);
                }
            });
        }

        /* ---------- video play/pause button ---------- */
        if (videoControl && heroVideo) {
            videoControl.addEventListener('click', function () {
                const icon = videoControl.querySelector('i');
                if (heroVideo.paused) {
                    heroVideo.play();
                    if (icon) icon.className = 'fas fa-pause';
                    clearVideoSafetyTimer();
                    videoSafetyTimer = setTimeout(function () {
                        if (currentIndex === 0 && heroVideo && !heroVideo.paused) {
                            heroVideo.pause();
                            nextSlide();
                        }
                    }, 60000);
                } else {
                    heroVideo.pause();
                    if (icon) icon.className = 'fas fa-play';
                    clearVideoSafetyTimer();
                }
            });
        }

        /* ---------- video load error ---------- */
        if (heroVideo) {
            heroVideo.addEventListener('error', function () {
                console.warn('Hero video failed to load — advancing to slide 2');
                goToSlide(1);
            });
        }

        /* ---------- init ---------- */
        goToSlide(0);
    }

    /* ========================================================
       SCROLL ANIMATIONS (optimized — no permanent will-change)
       ======================================================== */
    const slideElements = document.querySelectorAll('.scroll-slide');
    if (slideElements.length > 0) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.willChange = 'transform, opacity';
                    el.classList.add('visible');
                    setTimeout(function () {
                        el.style.willChange = 'auto';
                    }, 1100);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -20px 0px'
        });
        slideElements.forEach(function (el) { observer.observe(el); });
    }

    /* ========================================================
       NAVBAR SCROLL EFFECT
       ======================================================== */
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

    /* ========================================================
       MOBILE NAV: auto-close on link click
       ======================================================== */
    const navMenu = document.getElementById('navMenu');
    if (navMenu && typeof bootstrap !== 'undefined') {
        const links = navMenu.querySelectorAll('.nav-link, .btn-nav-cta');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth < 992 && navMenu.classList.contains('show')) {
                    const bsCollapse =
                        bootstrap.Collapse.getInstance(navMenu) ||
                        new bootstrap.Collapse(navMenu, { toggle: false });
                    bsCollapse.hide();
                }
            });
        });
    }

    /* ========================================================
       FILE UPLOAD PREVIEW
       ======================================================== */
    const fileUpload = document.querySelector('.file-upload');
    if (fileUpload) {
        const fileInput = fileUpload.querySelector('input[type="file"]');
        if (fileInput) {
            fileUpload.addEventListener('click', function () { fileInput.click(); });
            fileInput.addEventListener('change', function (e) {
                const fileName = e.target.files && e.target.files[0] ? e.target.files[0].name : '';
                if (fileName) {
                    const label = fileUpload.querySelector('.file-upload-label');
                    if (label) {
                        label.textContent = 'Selected: ' + fileName;
                    } else {
                        const p = fileUpload.querySelector('p');
                        if (p) p.textContent = 'Selected: ' + fileName;
                    }
                }
            });
        }
    }

    /* ========================================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ======================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

})();