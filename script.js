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

    // Set minimum date to today
    const dateInput = document.getElementById('deliveryDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Clear error messages when user interacts with form
    if (contactForm) {
        contactForm.addEventListener('input', function() {
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
        });

        contactForm.addEventListener('change', function() {
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const deliveryDate = formData.get('deliveryDate');
            const message = formData.get('message');

            // Basic validation
            if (!name || name.trim() === '') {
                showFormMessage('Por favor, informe seu nome.', 'error');
                return;
            }

            if (!deliveryDate) {
                showFormMessage('Por favor, selecione a data de entrega.', 'error');
                return;
            }

            // Build order list and calculate total
            let orderItems = [];
            let totalQty = 0;

            Object.keys(productNames).forEach(function(key) {
                const qty = parseInt(formData.get(key)) || 0;
                if (qty > 0) {
                    totalQty += qty;
                    orderItems.push('• ' + productNames[key] + ': *' + qty + ' unidades*');
                }
            });

            // Minimum order is 50 units total
            if (totalQty < 50) {
                showFormMessage('Pedido mínimo: 50 unidades. Você selecionou ' + totalQty + ' unidades.', 'error');
                return;
            }

            // Format date for display (DD/MM/YYYY)
            const dateParts = deliveryDate.split('-');
            const formattedDate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];

            // Build WhatsApp message
            const whatsappMessage = `🍴 *Novo Pedido - Chris Salgados*

👤 *Cliente:* ${name}

📅 *Data de Entrega:* ${formattedDate}

📋 *Pedido:* (${totalQty} unidades)
${orderItems.join('\n')}

${message ? '📝 *Observações:*\n' + message : ''}

_Aguardo confirmação do pedido!_`;

            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Open WhatsApp
            const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');

            // Show success message
            showFormMessage('Redirecionando para o WhatsApp...', 'success');

            // Reset form after short delay
            setTimeout(function() {
                contactForm.reset();
                document.querySelectorAll('.qty-select').forEach(function(select) {
                    select.value = '0';
                });
            }, 1000);
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
