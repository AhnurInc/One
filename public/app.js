// AhnurInc One - Basic JavaScript Functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('AhnurInc One - Website loaded successfully!');
    
    // Initialize the application
    initializeApp();
});

// Initialize application functionality
function initializeApp() {
    setupNavigation();
    setupAnimations();
    setupSmoothScrolling();
    addFadeInAnimations();
}

// Setup navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Welcome message function for CTA button
function showWelcomeMessage() {
    const message = 'Bem-vindo à AhnurInc One!\n\nObrigado por visitar nossa plataforma. Estamos aqui para transformar suas ideias em soluções inovadoras.\n\nEm breve, você poderá acessar todas as funcionalidades da nossa plataforma.';
    
    alert(message);
    
    // Optional: Add a visual feedback
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Obrigado!';
    button.style.backgroundColor = '#28a745';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

// Setup smooth scrolling for all anchor links
function setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerOffset = 70; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Add fade-in animations to sections
function addFadeInAnimations() {
    const sections = document.querySelectorAll('.section, .hero');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Setup service card animations
function setupAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
        // Add click event for interaction
        card.addEventListener('click', function() {
            // Add a pulse effect
            this.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Show service info
            const serviceName = this.querySelector('h3').textContent;
            console.log(`Clicked on service: ${serviceName}`);
        });
        
        // Add hover sound effect (optional - commented out as it might be annoying)
        // card.addEventListener('mouseenter', function() {
        //     // You could add a subtle sound effect here
        //     console.log('Hovering over service card');
        // });
    });
}

// Utility function to handle responsive navigation
function toggleMobileNav() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('nav-open');
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Update active navigation based on scroll position
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// Add scroll event listener with throttling
window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 100));

// Export functions for global access (if needed)
window.AhnurIncOne = {
    showWelcomeMessage,
    toggleMobileNav,
    isInViewport,
    throttle
};

// Console welcome message
console.log(`
╔═══════════════════════════════════════╗
║            AhnurInc One               ║
║     Plataforma de Soluções           ║
║         Inovadoras                   ║
╚═══════════════════════════════════════╝

Website carregado com sucesso!
Versão: 1.0.0
Ambiente: ${window.location.hostname}
`);