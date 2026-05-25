/* ============================================
   ORGANIZE YOUR SAREE — SCRIPT
   Performance-optimized, accessible, vanilla JS
   ============================================ */

(function () {
    'use strict';

    // --- DOM Ready ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        setupProgressBar();
        setupHeader();
        setupMobileNav();
        setupQuickNav();
        setupFaqAccordion();
        setupScrollAnimations();
        setupSmoothScroll();
        setupRatingBars();
        setupLazyImages();
    }

    // --- Reading Progress Bar ---
    function setupProgressBar() {
        var progressFill = document.querySelector('.progress-fill');
        var progressBar = document.getElementById('progressBar');
        if (!progressFill || !progressBar) return;

        var ticking = false;

        function updateProgress() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            progressFill.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', Math.round(progress));
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Sticky Header ---
    function setupHeader() {
        var header = document.getElementById('header');
        if (!header) return;

        var ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    if (window.pageYOffset > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Mobile Navigation ---
    function setupMobileNav() {
        var toggle = document.getElementById('navToggle');
        var nav = document.getElementById('nav');
        if (!toggle || !nav) return;

        toggle.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('active');
            toggle.classList.toggle('active');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        nav.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                toggle.classList.remove('active');
                nav.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open menu');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('active')) {
                toggle.classList.remove('active');
                nav.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open menu');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                toggle.classList.remove('active');
                nav.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open menu');
                document.body.style.overflow = '';
                toggle.focus();
            }
        });
    }

    // --- Quick Nav Active State ---
    function setupQuickNav() {
        var quickNavLinks = document.querySelectorAll('.quick-nav-list a');
        var navLinks = document.querySelectorAll('.nav-link');
        var sections = [];

        quickNavLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                var section = document.querySelector(href);
                if (section) sections.push({ el: section, link: link });
            }
        });

        if (sections.length === 0) return;

        var ticking = false;

        function updateActiveLink() {
            var scrollPos = window.pageYOffset + 160;
            var current = null;

            for (var i = sections.length - 1; i >= 0; i--) {
                if (sections[i].el.offsetTop <= scrollPos) {
                    current = sections[i];
                    break;
                }
            }

            quickNavLinks.forEach(function (l) { l.classList.remove('active'); });
            navLinks.forEach(function (l) { l.classList.remove('active'); });

            if (current) {
                current.link.classList.add('active');
                var id = current.link.getAttribute('href');
                navLinks.forEach(function (l) {
                    if (l.getAttribute('href') === id) l.classList.add('active');
                });
            }

            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(updateActiveLink);
                ticking = true;
            }
        }, { passive: true });
    }

    // --- FAQ Accordion ---
    function setupFaqAccordion() {
        var faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(function (item) {
            var question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', function () {
                var isActive = item.classList.contains('active');

                // Close all
                faqItems.forEach(function (other) {
                    other.classList.remove('active');
                    var btn = other.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });

                // Open clicked if it was closed
                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // --- Scroll Animations (IntersectionObserver) ---
    function setupScrollAnimations() {
        var animatedElements = document.querySelectorAll('[data-animate]');
        if (animatedElements.length === 0) return;

        // Respect reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            animatedElements.forEach(function (el) { el.classList.add('animated'); });
            return;
        }

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px 0px -60px 0px',
                threshold: 0.1
            });

            animatedElements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback
            animatedElements.forEach(function (el) { el.classList.add('animated'); });
        }
    }

    // --- Smooth Scroll ---
    function setupSmoothScroll() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;

            var href = link.getAttribute('href');
            if (href === '#') return;

            var target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            var headerHeight = document.getElementById('header')
                ? document.getElementById('header').offsetHeight
                : 70;

            var quickNav = document.getElementById('quickNav');
            var quickNavHeight = quickNav ? quickNav.offsetHeight : 0;

            var offset = headerHeight + quickNavHeight + 16;
            var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });

            // Update URL without jumping
            if (history.pushState) {
                history.pushState(null, null, href);
            }

            // Set focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    }

    // --- Rating Bars Animation ---
    function setupRatingBars() {
        var bars = document.querySelectorAll('.rating-fill, .stat-fill');
        if (bars.length === 0) return;

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var bar = entry.target;
                        var width = bar.style.width;
                        bar.style.width = '0';
                        requestAnimationFrame(function () {
                            requestAnimationFrame(function () {
                                bar.style.width = width;
                            });
                        });
                        observer.unobserve(bar);
                    }
                });
            }, { threshold: 0.3 });

            bars.forEach(function (bar) { observer.observe(bar); });
        }
    }

    // --- Lazy Image Loading (native + fallback) ---
    function setupLazyImages() {
        // Native lazy loading is set via HTML attribute
        // This adds a fade-in effect when images load
        var images = document.querySelectorAll('img[loading="lazy"]');

        images.forEach(function (img) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.4s ease';

            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.addEventListener('load', function () {
                    img.style.opacity = '1';
                });
                img.addEventListener('error', function () {
                    img.style.opacity = '1'; // Show even on error
                });
            }
        });
    }

})();
