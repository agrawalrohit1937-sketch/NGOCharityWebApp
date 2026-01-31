// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });

    // Animated Counter for Stats
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    };

    // Intersection Observer for Stats Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => observer.observe(stat));
    }

    // Donation Form Handling
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        const amountButtons = document.querySelectorAll('.amount-btn');
        const customAmountInput = document.getElementById('customAmount');

        // Handle amount button clicks
        amountButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                amountButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const amount = this.getAttribute('data-amount');
                if (amount !== 'custom') {
                    customAmountInput.value = amount;
                } else {
                    customAmountInput.focus();
                }
            });
        });

        // Update active button when custom amount is changed
        customAmountInput.addEventListener('input', function() {
            const currentValue = this.value;
            let matchFound = false;

            amountButtons.forEach(button => {
                const buttonAmount = button.getAttribute('data-amount');
                if (buttonAmount === currentValue) {
                    button.classList.add('active');
                    matchFound = true;
                } else if (buttonAmount !== 'custom') {
                    button.classList.remove('active');
                }
            });

            if (!matchFound) {
                amountButtons.forEach(btn => {
                    if (btn.getAttribute('data-amount') === 'custom') {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
        });

        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        // Expiry date formatting
        const expiryInput = document.getElementById('expiry');
        if (expiryInput) {
            expiryInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                e.target.value = value;
            });
        }

        // CVV input - numbers only
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        // Form submission
        donationForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                amount: customAmountInput.value,
                donationType: document.querySelector('input[name="donationType"]:checked').value,
                cause: document.getElementById('cause').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                anonymous: document.querySelector('input[name="anonymous"]').checked,
                newsletter: document.querySelector('input[name="newsletter"]').checked
            };

            try {
                const response = await fetch('/api/donate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showModal('successModal');
                    donationForm.reset();
                    // Reset amount buttons
                    amountButtons.forEach(btn => btn.classList.remove('active'));
                    document.querySelector('.amount-btn[data-amount="custom"]').classList.add('active');
                    customAmountInput.value = '100';
                }
            } catch (error) {
                console.error('Error submitting donation:', error);
                alert('There was an error processing your donation. Please try again.');
            }
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                firstName: document.getElementById('contactFirstName').value,
                lastName: document.getElementById('contactLastName').value,
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                newsletter: document.querySelector('input[name="newsletter"]').checked
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showModal('contactSuccessModal');
                    contactForm.reset();
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('There was an error sending your message. Please try again.');
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to elements on scroll
    const observeElements = document.querySelectorAll('.cause-card, .value-card, .team-member, .faq-item');
    if (observeElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.5s, transform 0.5s';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        observeElements.forEach(el => scrollObserver.observe(el));
    }
});

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactSuccessModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

// Form Validation Helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add active class to current page link
const currentLocation = window.location.pathname;
const navLinksAll = document.querySelectorAll('.nav-links a');
navLinksAll.forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
        link.classList.add('active');
    }
});