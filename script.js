/**
 * Vietroom - Navigation & Scroll Functionality
 * Handles smooth scrolling and active link highlighting
 */

(function() {
    'use strict';

    /**
     * Initialize smooth scroll and active link detection
     */
    function initScrollNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        const sections = document.querySelectorAll('section');

        // Smooth scroll on link click
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Handle anchor links
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update active state
                        updateActiveLink(link);
                    }
                }
            });
        });

        // Highlight active link on scroll
        window.addEventListener('scroll', function() {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const scrollPosition = window.scrollY + 200;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // Update active links based on current section
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                
                if (href.includes('#' + current) || (href === '' && current === '')) {
                    link.classList.add('active');
                }
            });
        });
    }

    /**
     * Update active link styling
     */
    function updateActiveLink(link) {
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }

    /**
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollNavigation);
    } else {
        initScrollNavigation();
    }

    /**
     * Mobile menu toggle (optional)
     */
    function initMobileMenu() {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');

        if (header && window.innerWidth <= 768) {
            // Mobile menu functionality can be added here if needed
            // This is a placeholder for future mobile menu implementation
        }
    }

    // Initialize mobile menu
    initMobileMenu();

    // Re-initialize mobile menu on resize
    window.addEventListener('resize', initMobileMenu);
})();
