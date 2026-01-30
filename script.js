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

    // Address input and buttons
    const mapsBtn = document.getElementById('mapsBtn');
    const locationBtn = document.getElementById('locationBtn');
    const addressInput = document.getElementById('address');
    const suggestionsContainer = document.getElementById('addressSuggestions');

    // Address autocomplete
    let autocompleteTimeout;

    if (addressInput && suggestionsContainer) {
        addressInput.addEventListener('input', function() {
            const query = this.value.trim();

            // Clear previous timeout
            clearTimeout(autocompleteTimeout);

            // Hide suggestions if query is too short
            if (query.length < 3) {
                suggestionsContainer.classList.remove('active');
                suggestionsContainer.innerHTML = '';
                return;
            }

            // Show loading
            suggestionsContainer.innerHTML = '<div class="address-suggestions-loading">Buscando endereços...</div>';
            suggestionsContainer.classList.add('active');

            // Debounce the API call (wait 300ms after user stops typing)
            autocompleteTimeout = setTimeout(function() {
                // Use Photon API (free, based on OpenStreetMap) - prioritize Brazil
                fetch('https://photon.komoot.io/api/?q=' + encodeURIComponent(query) + '&limit=5&lang=pt&lat=-20.4697&lon=-54.6201')
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        suggestionsContainer.innerHTML = '';

                        if (data.features && data.features.length > 0) {
                            data.features.forEach(function(feature) {
                                const props = feature.properties;
                                let addressParts = [];

                                if (props.name) addressParts.push(props.name);
                                if (props.housenumber) addressParts.push(props.housenumber);
                                if (props.street) addressParts.push(props.street);
                                if (props.district) addressParts.push(props.district);
                                if (props.city) addressParts.push(props.city);
                                if (props.state) addressParts.push(props.state);
                                if (props.country) addressParts.push(props.country);

                                const fullAddress = addressParts.join(', ');

                                const item = document.createElement('div');
                                item.className = 'address-suggestion-item';
                                item.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><span class="address-suggestion-text">' + fullAddress + '</span>';

                                item.addEventListener('click', function() {
                                    addressInput.value = fullAddress;
                                    suggestionsContainer.classList.remove('active');
                                    suggestionsContainer.innerHTML = '';
                                });

                                suggestionsContainer.appendChild(item);
                            });
                        } else {
                            suggestionsContainer.innerHTML = '<div class="address-suggestions-loading">Nenhum endereço encontrado</div>';
                        }
                    })
                    .catch(function(error) {
                        console.error('Erro ao buscar endereços:', error);
                        suggestionsContainer.innerHTML = '<div class="address-suggestions-loading">Erro ao buscar endereços</div>';
                    });
            }, 300);
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!addressInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.classList.remove('active');
            }
        });

        // Hide suggestions when pressing Escape
        addressInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                suggestionsContainer.classList.remove('active');
            }
        });
    }

    // Google Maps button - opens address in Maps
    if (mapsBtn && addressInput) {
        mapsBtn.addEventListener('click', function() {
            const address = addressInput.value.trim();
            if (address) {
                const mapsURL = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
                window.open(mapsURL, '_blank');
            } else {
                window.open('https://www.google.com/maps', '_blank');
            }
        });
    }

    // Location button - gets current location and fills address
    if (locationBtn && addressInput) {
        locationBtn.addEventListener('click', function() {
            if (!navigator.geolocation) {
                alert('Seu navegador não suporta geolocalização.');
                return;
            }

            // Show loading state
            locationBtn.classList.add('loading');
            locationBtn.disabled = true;
            addressInput.placeholder = 'Buscando sua localização...';

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Use Nominatim (OpenStreetMap) for reverse geocoding - it's free!
                    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&addressdetails=1')
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(data) {
                            if (data && data.display_name) {
                                addressInput.value = data.display_name;
                            } else {
                                addressInput.value = lat + ', ' + lon;
                            }
                            // Reset button
                            locationBtn.classList.remove('loading');
                            locationBtn.disabled = false;
                            addressInput.placeholder = 'Rua, número, bairro, cidade...';
                        })
                        .catch(function(error) {
                            console.error('Erro ao buscar endereço:', error);
                            // Fallback to coordinates
                            addressInput.value = lat + ', ' + lon;
                            locationBtn.classList.remove('loading');
                            locationBtn.disabled = false;
                            addressInput.placeholder = 'Rua, número, bairro, cidade...';
                        });
                },
                function(error) {
                    // Reset button
                    locationBtn.classList.remove('loading');
                    locationBtn.disabled = false;
                    addressInput.placeholder = 'Rua, número, bairro, cidade...';

                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            alert('Permissão de localização negada. Por favor, permita o acesso à localização.');
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert('Localização indisponível. Tente novamente.');
                            break;
                        case error.TIMEOUT:
                            alert('Tempo esgotado ao buscar localização. Tente novamente.');
                            break;
                        default:
                            alert('Erro ao obter localização. Tente novamente.');
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
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
            const address = formData.get('address');
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

            if (!address || address.trim() === '') {
                showFormMessage('Por favor, informe o endereço de entrega.', 'error');
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

📍 *Endereço:* ${address}

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
