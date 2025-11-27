// ========================================
// DGCREATOR PORTFOLIO - INTERACTIVE JS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // ELEMENTS
    const scrollTopBtn = document.getElementById('scrollTop');
    const scrollBottomBtn = document.getElementById('scrollBottom');
    const progressBar = document.getElementById('progressBar');

    const floatContactBtn = document.getElementById('floatContactBtn');
    const footerContactBtn = document.getElementById('footerContactBtn');
    const contactPanel = document.getElementById('contactPanel');
    const panelBackdrop = document.getElementById('panelBackdrop');
    const closePanelBtn = document.getElementById('closePanel');

    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');

    const fullNameInput = document.getElementById('fullName');
    const emailPhoneInput = document.getElementById('emailPhone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailPhoneError = document.getElementById('emailPhoneError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    const logoBox = document.querySelector('.logo-box');
    const logoSpan = document.querySelector('.logo-text');
    const siteName = document.querySelector('.site-name');

    // SCROLL NAVIGATION
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollBottomBtn.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        progressBar.style.height = scrollPercentage + '%';
    });

    // CONTACT PANEL
    function openPanel() {
        contactPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeContactPanel() {
        contactPanel.classList.remove('active');
        document.body.style.overflow = '';
    }

    floatContactBtn.addEventListener('click', openPanel);
    footerContactBtn.addEventListener('click', openPanel);
    closePanelBtn.addEventListener('click', closeContactPanel);
    panelBackdrop.addEventListener('click', closeContactPanel);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactPanel.classList.contains('active')) {
            closeContactPanel();
        }
    });

    // EMAIL / PHONE VALIDATION
    function validateEmailOrPhone(value) {
        const trimmed = value.trim().toLowerCase();

        // 10-digit phone number
        const phoneRegex = /^d{10}$/;
        if (phoneRegex.test(trimmed)) {
            return { valid: true, type: 'phone' };
        }

        // Basic email format
        const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
        if (!emailRegex.test(trimmed)) {
            return {
                valid: false,
                error: 'Please enter a valid email or 10-digit phone number'
            };
        }

        // Restrict to Gmail / Yahoo only
        const allowedDomains = [
            '@gmail.com',
            '@googlemail.com',
            '@yahoo.com',
            '@yahoo.co.in',
            '@yahoo.co.uk',
            '@yahoo.ca'
        ];

        const isAllowed = allowedDomains.some(domain => trimmed.endsWith(domain));

        if (!isAllowed) {
            return {
                valid: false,
                error: 'Unsupported email address. Only Gmail and Yahoo Mail are accepted.'
            };
        }

        return { valid: true, type: 'email' };
    }

    emailPhoneInput.addEventListener('blur', () => {
        const value = emailPhoneInput.value;
        if (value) {
            const validation = validateEmailOrPhone(value);
            if (!validation.valid) {
                emailPhoneError.textContent = validation.error;
                emailPhoneInput.style.borderColor = '#ef4444';
            } else {
                emailPhoneError.textContent = '';
                emailPhoneInput.style.borderColor = '#10b981';
            }
        }
    });

    emailPhoneInput.addEventListener('input', () => {
        if (emailPhoneError.textContent) {
            emailPhoneError.textContent = '';
            emailPhoneInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });

    // FORM SUBMISSION
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        nameError.textContent = '';
        emailPhoneError.textContent = '';
        subjectError.textContent = '';
        messageError.textContent = '';

        let isValid = true;

        if (fullNameInput.value.trim().length < 2) {
            nameError.textContent = 'Full name must be at least 2 characters';
            fullNameInput.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            fullNameInput.style.borderColor = '#10b981';
        }

        const emailValidation = validateEmailOrPhone(emailPhoneInput.value);
        if (!emailValidation.valid) {
            emailPhoneError.textContent = emailValidation.error;
            emailPhoneInput.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            emailPhoneInput.style.borderColor = '#10b981';
        }

        if (subjectInput.value.trim().length < 3) {
            subjectError.textContent = 'Subject must be at least 3 characters';
            subjectInput.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            subjectInput.style.borderColor = '#10b981';
        }

        if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            messageInput.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            messageInput.style.borderColor = '#10b981';
        }

        if (!isValid) return;

        const formData = {
            name: fullNameInput.value.trim(),
            contact: emailPhoneInput.value.trim(),
            subject: subjectInput.value.trim(),
            message: messageInput.value.trim(),
            timestamp: new Date().toISOString(),
            type: emailValidation.type
        };

        try {
            // To enable Formspree, uncomment and insert your form ID:
            /*
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }
            */

            console.log('📧 Form submitted:', formData);

            const tickets = JSON.parse(localStorage.getItem('dgcreator_tickets') || '[]');
            tickets.push(formData);
            localStorage.setItem('dgcreator_tickets', JSON.stringify(tickets));

            closeContactPanel();
            successModal.classList.add('active');

            contactForm.reset();
            fullNameInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            emailPhoneInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            subjectInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            messageInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';

            console.log('✅ Ticket created! Total:', tickets.length);
        } catch (error) {
            console.error('❌ Error:', error);
            emailPhoneError.textContent = 'An error occurred. Please try again.';
        }
    });

    // SUCCESS MODAL
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    successModal.querySelector('.modal-overlay').addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    // EDITABLE LOGO & NAME (localStorage)
    const savedLogo = localStorage.getItem('dgcreator_logo');
    const savedName = localStorage.getItem('dgcreator_name');

    if (savedLogo) {
        logoSpan.textContent = savedLogo;
    }

    if (savedName) {
        siteName.textContent = savedName;
    }

    logoBox.addEventListener('blur', () => {
        const logoText = logoSpan.textContent.trim();
        if (logoText) {
            localStorage.setItem('dgcreator_logo', logoText);
            console.log('💾 Logo saved:', logoText);
        }
    });

    siteName.addEventListener('blur', () => {
        const nameText = siteName.textContent.trim();
        if (nameText) {
            localStorage.setItem('dgcreator_name', nameText);
            console.log('💾 Site name saved:', nameText);
        }
    });

    // SMOOTH ANCHOR LINKS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // SCROLL REVEAL ANIMATIONS
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.award-card, .certificate-card, .logo-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // PARALLAX FOR BACKGROUND SHAPES
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        document.querySelectorAll('.shape').forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const x = mouseX * speed;
            const y = mouseY * speed;
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ERROR HANDLING
    window.addEventListener('error', (e) => {
        console.error('⚠️ Error:', e.error);
        e.preventDefault();
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('⚠️ Promise rejection:', e.reason);
        e.preventDefault();
    });

    // CONSOLE BRANDING
    console.log('%c🎨 DGCREATOR PORTFOLIO', 'color: #6366f1; font-size: 24px; font-weight: bold;');
    console.log('%c✨ Website loaded successfully!', 'color: #8b5cf6; font-size: 14px;');
    console.log('%c📧 Contact ready | 🎯 Animations active | 🚀 Smooth scrolling enabled', 'color: #94a3b8; font-size: 12px;');

    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`⚡ Loaded in ${(loadTime / 1000).toFixed(2)}s`);
    });
});

// DEBUG HELPERS
window.DGcreator = {
    version: '1.0.0',
    getTickets: () => JSON.parse(localStorage.getItem('dgcreator_tickets') || '[]'),
    clearTickets: () => {
        localStorage.removeItem('dgcreator_tickets');
        console.log('🗑️ Tickets cleared');
    },
    resetBranding: () => {
        localStorage.removeItem('dgcreator_logo');
        localStorage.removeItem('dgcreator_name');
        location.reload();
    }
};

console.log('%cDebug:', 'color: #10b981; font-weight: bold;');
console.log('DGcreator.getTickets()  // view stored tickets');
console.log('DGcreator.clearTickets() // clear tickets');
console.log('DGcreator.resetBranding() // reset logo & name');
