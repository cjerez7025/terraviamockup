// TERRAVÍA - JavaScript

// SLIDER FUNCTIONALITY
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

// Auto advance slides every 5 seconds
setInterval(nextSlide, 5000);

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// SMOOTH SCROLL
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

// MOBILE MENU (placeholder for future implementation)
// Add mobile menu functionality here if needed