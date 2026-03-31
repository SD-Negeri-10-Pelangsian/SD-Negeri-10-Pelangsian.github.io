
// DOM Elements
const logoInput = document.getElementById('logoInput');
const logoUpload = document.getElementById('logoUpload');
const heroImageInput = document.getElementById('heroImageInput');
const heroImage = document.getElementById('heroImage');

// Upload Logo Function
function uploadLogo() {
    logoInput.click();
}

logoInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            logoUpload.src = e.target.result;
            showNotification('Logo berhasil diubah!', 'success');
            // Save to localStorage
            localStorage.setItem('schoolLogo', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Upload Hero Image Function
function uploadHeroImage() {
    heroImageInput.click();
}

heroImageInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            heroImage.src = e.target.result;
            showNotification('Gambar hero berhasil diubah!', 'success');
            // Save to localStorage
            localStorage.setItem('heroImage', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Load saved images on page load
window.addEventListener('load', function () {
    const savedLogo = localStorage.getItem('schoolLogo');
    const savedHero = localStorage.getItem('heroImage');

    if (savedLogo) {
        logoUpload.src = savedLogo;
    }
    if (savedHero) {
        heroImage.src = savedHero;
    }

    // Animate elements on load
    animateOnScroll();
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        ${message}
        <button onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Add CSS for notifications
const notificationCSS = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem 2rem;
    border-radius: 15px;
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 15px;
    font-weight: 500;
    max-width: 400px;
    animation: slideInRight 0.4s ease;
    backdrop-filter: blur(10px);
}

.notification.success {
    background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
}

.notification button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    margin-left: auto;
    padding: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
}

.notification button:hover {
    background: rgba(255,255,255,0.2);
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;

const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

// Smooth scrolling for navigation links
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

// Navbar active state
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.navbar a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === current ||
            (current === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Animate on scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.highlight-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const nav = document.querySelector('.navbar ul');
    nav.classList.toggle('active');
}

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}

// Prevent context menu on images
document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});