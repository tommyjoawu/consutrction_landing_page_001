/**
 * Main JavaScript for Construction & Remodeling Landing Page
 * Includes animations, interactions, and functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // -----------------------------------------
    // Page Loader
    // -----------------------------------------
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                pageLoader.classList.add('loaded');
                // Enable animations after page load
                document.body.classList.add('loaded');
            }, 500);
        });
    }

    // -----------------------------------------
    // Navbar Scroll Effect
    // -----------------------------------------
    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navLinks = document.querySelectorAll('.navbar-link');

    // Add scroll class to navbar when scrolled
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Initialize navbar state on page load
    handleNavbarScroll();
    
    // Update navbar on scroll
    window.addEventListener('scroll', handleNavbarScroll);

    // Mobile menu toggle
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navbarMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // -----------------------------------------
    // Smooth Scrolling for Anchor Links
    // -----------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                
                window.scrollTo({
                    top: targetPosition - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // -----------------------------------------
    // Active Navigation Link on Scroll
    // -----------------------------------------
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.navbar-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // -----------------------------------------
    // Scroll Reveal Animations
    // -----------------------------------------
    function revealElements() {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        const windowHeight = window.innerHeight;
        
        reveals.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementPosition < windowHeight - elementVisible) {
                element.classList.add('active');
                
                // If it's a stat counter, start animation
                // const statNumber = element.querySelector('.stat-number');
                // if (statNumber && !statNumber.classList.contains('in-view')) {
                //     statNumber.classList.add('in-view');
                //     animateStatCounter(statNumber);
                // }
            }
        });
    }

    window.addEventListener('scroll', revealElements);
    revealElements(); // Trigger on initial load

    // -----------------------------------------
    // Stat Counters Animation
    // -----------------------------------------
    function animateStatCounter(statElement) {
        const targetValue = parseInt(statElement.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const stepTime = 50; // Update every 50ms
        const totalSteps = duration / stepTime;
        const stepValue = targetValue / totalSteps;
        
        let currentValue = 0;
        let currentStep = 0;
        
        const counter = setInterval(() => {
            currentStep++;
            currentValue += stepValue;
            
            if (currentStep >= totalSteps) {
                clearInterval(counter);
                statElement.textContent = targetValue;
            } else {
                statElement.textContent = Math.floor(currentValue);
            }
        }, stepTime);
    }

    // Initialize stat counters that are visible on page load
    // document.querySelectorAll('.stat-number').forEach(stat => {
    //     if (isElementInViewport(stat)) {
    //         stat.classList.add('in-view');
    //         animateStatCounter(stat);
    //     }
    // });

    // -----------------------------------------
    // Project Filtering
    // -----------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else if (card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // -----------------------------------------
    // Testimonial Slider
    // -----------------------------------------
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const dots = document.querySelectorAll('.testimonial-dot');

    if (testimonialTrack && testimonialSlides.length > 0) {
        let currentIndex = 0;
        const slideWidth = 100; // 100%
        
        // Set initial position
        testimonialTrack.style.transform = `translateX(0%)`;
        
        // Function to update slider position
        function updateSliderPosition() {
            testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Previous slide button
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonialSlides.length - 1;
                updateSliderPosition();
            });
        }
        
        // Next slide button
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < testimonialSlides.length - 1) ? currentIndex + 1 : 0;
                updateSliderPosition();
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSliderPosition();
            });
        });
        
        // Auto-advance slider (optional)
        let sliderInterval = setInterval(() => {
            currentIndex = (currentIndex < testimonialSlides.length - 1) ? currentIndex + 1 : 0;
            updateSliderPosition();
        }, 5000);
        
        // Pause auto-advance on hover
        testimonialTrack.addEventListener('mouseenter', () => {
            clearInterval(sliderInterval);
        });
        
        testimonialTrack.addEventListener('mouseleave', () => {
            sliderInterval = setInterval(() => {
                currentIndex = (currentIndex < testimonialSlides.length - 1) ? currentIndex + 1 : 0;
                updateSliderPosition();
            }, 5000);
        });

        // Handle touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        testimonialTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        testimonialTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX + swipeThreshold < touchStartX) {
                // Swipe left (next)
                currentIndex = (currentIndex < testimonialSlides.length - 1) ? currentIndex + 1 : 0;
                updateSliderPosition();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right (prev)
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonialSlides.length - 1;
                updateSliderPosition();
            }
        }
    }

    // -----------------------------------------
    // Back to Top Button
    // -----------------------------------------
    const backToTopButton = document.querySelector('.back-to-top');
    
    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', toggleBackToTopButton);
    toggleBackToTopButton(); // Initialize on load
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // -----------------------------------------
    // Form Validation & Submission
    // -----------------------------------------
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('#email');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (isValid) {
                // Form is valid, you can submit it here
                // For demonstration, we'll just show a success message
                const formData = new FormData(contactForm);
                
                // Here you would normally send the data to your server
                // For demonstration, we'll simulate a successful submission
                
                // Disable the submit button to prevent multiple submissions
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                
                // Simulate server request
                setTimeout(() => {
                    // Show success message
                    contactForm.innerHTML = `
                        <div class="form-success">
                            <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--primary); margin-bottom: var(--spacing-sm);"></i>
                            <h3>Message Sent Successfully!</h3>
                            <p>Thank you for contacting us. We will get back to you shortly.</p>
                        </div>
                    `;
                }, 1500);
            }
        });
        
        // Real-time validation feedback
        const formInputs = contactForm.querySelectorAll('.form-control');
        
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
                
                // Special case for email field
                if (this.type === 'email' && this.value) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(this.value)) {
                        this.classList.add('error');
                    } else {
                        this.classList.remove('error');
                    }
                }
            });
        });
    }

    // -----------------------------------------
    // Newsletter Form Submission
    // -----------------------------------------
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                // Valid email
                const originalHtml = this.innerHTML;
                this.innerHTML = '<p class="success-message">Thank you for subscribing!</p>';
                
                // Reset after a few seconds
                setTimeout(() => {
                    this.innerHTML = originalHtml;
                }, 3000);
            } else {
                // Invalid email
                emailInput.classList.add('error');
                
                setTimeout(() => {
                    emailInput.classList.remove('error');
                }, 1500);
            }
        });
    }

    // -----------------------------------------
    // Custom Cursor (Optional)
    // -----------------------------------------
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Add a slight delay to follower for nice effect
            setTimeout(function() {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 50);
        });
        
        // Show cursor only when mouse moves
        document.addEventListener('mouseenter', function() {
            cursor.classList.add('active');
            cursorFollower.classList.add('active');
        });
        
        document.addEventListener('mouseleave', function() {
            cursor.classList.remove('active');
            cursorFollower.classList.remove('active');
        });
        
        // Change cursor style when hovering on links and buttons
        const links = document.querySelectorAll('a, button, .service-card, .project-card, .social-link');
        links.forEach(link => {
            link.addEventListener('mouseenter', function() {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            
            link.addEventListener('mouseleave', function() {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
    }

    // -----------------------------------------
    // Utility Functions
    // -----------------------------------------
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Get references to the navbar elements
    // const navbarToggle = document.querySelector('.navbar-toggle');
    // const navbarMenu = document.querySelector('.navbar-menu');
    
    // Function to close the mobile menu
    function closeMenu() {
        navbarToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    // Add click event listener to the document
    document.addEventListener('click', function(event) {
        // Check if the menu is open
        if (navbarMenu.classList.contains('active')) {
            // Check if the click is outside both the navbar menu and toggle button
            if (!navbarMenu.contains(event.target) && !navbarToggle.contains(event.target)) {
                closeMenu();
            }
        }
    });
    
    // Prevent clicks on the menu itself from closing it
    navbarMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    
    // Also close the menu when a link is clicked (you already have this in your script.js)
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});
