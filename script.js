/**
 * YourCompany Website JavaScript
 * Handles navigation, smooth scrolling, and form interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // Navigation
    // ========================================
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    // Navbar scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navbar.contains(event.target) && navLinks.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // ========================================
    // Smooth Scrolling
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Active Navigation Link
    // ========================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.querySelectorAll('a').forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // ========================================
    // Contact Form Handling - WhatsApp Integration
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const WHATSAPP_NUMBER = '5567999380327'; // Chris Salgados WhatsApp

    // Product names mapping
    const productNames = {
        bolinha: 'Bolinha de Queijo',
        paoqueijo: 'Pão de Queijo',
        enroladinho: 'Enroladinho de Salsicha',
        hamburger: 'Mini Hamburgers',
        bruschetta: 'Mini Bruschetta',
        pastel: 'Pastel',
        rissole: 'Rissole'
    };

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = (formData.get('name') || '').toString().trim();
            const notes = (formData.get('message') || '').toString().trim();

            // Name is required so the WhatsApp message has context
            if (!name) {
                showFormMessage('Por favor, informe seu nome.', 'error');
                return;
            }

            // Build order list and calculate total quantity
            let orderItems = [];
            let totalQty = 0;

            Object.keys(productNames).forEach(function(key) {
                const qty = parseInt(formData.get(key), 10) || 0;
                if (qty > 0) {
                    totalQty += qty;
                    orderItems.push('• ' + productNames[key] + ': *' + qty + ' unidades*');
                }
            });

            // Conversation-first message:
            // - If user selected items: include summary
            // - If user selected nothing: open chat asking for help/menu/prices
            const header = 'Olá! Tudo bem? Meu nome é ' + name + '. Vim pelo site.';
            const orderBlock = orderItems.length
                ? '\n\n📋 *Meu pedido (rascunho):*\n' + orderItems.join('\n')
                : '\n\nQuero fazer um pedido, pode me ajudar com o cardápio e valores?';

            // If below the stated minimum, don't block the conversation—just flag it.
            const minimumHint = (orderItems.length && totalQty < 50)
                ? '\n\n⚠️ *Obs:* selecionei ' + totalQty + ' unidades — vi que o pedido mínimo pode ser 50. Pode confirmar?'
                : '';

            const notesBlock = notes ? ('\n\n📝 *Observações:*\n' + notes) : '';
            const closing = '\n\nQuando puder, me diga disponibilidade, prazo e total. Obrigado!';

            const whatsappMessage = header + orderBlock + minimumHint + notesBlock + closing;

            // Open WhatsApp chat with prefilled message (user still taps Send)
            const whatsappURL = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(whatsappMessage);
            window.open(whatsappURL, '_blank');

            showFormMessage('Abrindo conversa no WhatsApp...', 'success');
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message form-message-' + type;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            ${type === 'success'
                ? 'background-color: #dcfce7; color: #166534; border: 1px solid #86efac;'
                : 'background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'}
        `;

        contactForm.insertBefore(messageDiv, contactForm.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(function() {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
                messageDiv.remove();
            }, 300);
        }, 5000);
    }

    // ========================================
    // Intersection Observer for Animations
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .team-card, .stat');
    animateElements.forEach(function(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // Utility: Debounce function
    // ========================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Debounced scroll handler for performance
    window.addEventListener('scroll', debounce(function() {
        handleScroll();
        highlightNavLink();
    }, 10));
});
