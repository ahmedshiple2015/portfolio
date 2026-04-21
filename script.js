/**
 * Portfolio Main Script
 * Handles scroll animations, UI effects, and responsive navbar behavior
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initReveal();
    initTypewriter();
    initCursorGlow();
    initActiveNav();
    initBackToTop();

});

/**
 * Navbar Behavior: Hide on scroll down, appear on scroll up
 */
function initNavbar() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            header.classList.add('nav-scrolled');
        } else {
            header.classList.remove('nav-scrolled');
        }

        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.classList.add('nav-hidden');
        } else {
            header.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
    });

    // Close mobile menu on nav link click
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');

    // FIX: wrap in try/catch in case element is missing
    let bsCollapse = null;
    try {
        if (menuToggle) {
            bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });
        }
    } catch (e) {
        console.warn('Bootstrap Collapse init failed:', e);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && bsCollapse) {
                bsCollapse.hide();
            }
        });
    });

    if (menuToggle) {
        menuToggle.addEventListener('show.bs.collapse', () => {
            document.body.style.overflow = 'hidden';
        });
        menuToggle.addEventListener('hide.bs.collapse', () => {
            document.body.style.overflow = 'auto';
        });
    }
}

/**
 * Reveal Animations: Elements slide in as you scroll
 */
function initReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Typewriter Effect: For the hero intro text
 * FIX: Reads from data-text attribute to avoid empty-string race condition.
 * FIX: Skips animation after first visit using localStorage.
 */
function initTypewriter() {
    const typewriter = document.querySelector('.typewriter');
    if (!typewriter) return;

    // FIX: Read text from data-text attribute
    const text = typewriter.dataset.text || typewriter.textContent.trim();
    typewriter.textContent = '';

    // FIX: Skip animation on repeat visits, just show the text
    const hasVisited = localStorage.getItem('portfolio_visited');
    if (hasVisited) {
        typewriter.textContent = text;
        return;
    }

    typewriter.classList.add('typing');
    let i = 0;

    function type() {
        if (i < text.length) {
            typewriter.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        } else {
            // Done typing: remove blinking cursor, mark visited
            typewriter.classList.remove('typing');
            localStorage.setItem('portfolio_visited', '1');
        }
    }

    setTimeout(type, 1000);
}

/**
 * Custom Cursor Glow: Soft radial light that follows the mouse
 * Disabled automatically on touch devices via CSS (display: none)
 */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    // Only activate on pointer devices
    if (window.matchMedia('(hover: none)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
    });

    // Smooth follow with lerp
    function animateGlow() {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}
// active nav
function initActiveNav() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
}

// back to top
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
}