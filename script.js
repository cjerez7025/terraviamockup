// TERRAVÍA - JavaScript con Bootstrap

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Cerrar navbar móvil si está abierto
                const navbarCollapse = document.getElementById('navbarMain');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
                
                // Scroll suave
                setTimeout(() => {
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 300);
            }
        }
    });
});

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

// NAVBAR SCROLL EFFECT
let lastScroll = 0;
const header = document.querySelector('.header-bootstrap');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

console.log('✅ TERRAVÍA - Bootstrap Navigation Ready');

// ===================================
// SHOPPING CART SYSTEM
// ===================================

// Cart State
let cart = JSON.parse(localStorage.getItem('terravia_cart')) || [];

// DOM Elements
const cartButton = document.getElementById('cartButton');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartFooter = document.getElementById('cartFooter');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartShipping = document.getElementById('cartShipping');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const clearCartButton = document.getElementById('clearCartButton');

// Initialize Cart
function initCart() {
    console.log('🛒 Inicializando carrito...');
    console.log('📦 Productos en carrito:', cart);
    
    updateCartUI();
    attachCartListeners();
    console.log('✅ Sistema de carrito listo');
}

// Attach Event Listeners
function attachCartListeners() {
    // Cart button - Bootstrap maneja la apertura con data-bs-toggle
    // No necesitamos JavaScript adicional para abrir
    
    // Checkout button
    if (checkoutButton) {
        checkoutButton.addEventListener('click', proceedToCheckout);
    }
    
    // Clear cart button
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }
    
    // Add to cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseInt(this.dataset.price),
                image: this.dataset.image
            };
            addToCart(product);
        });
    });
}

// Add Product to Cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    animateCartBadge();
    
    // Show notification
    showNotification('✓ Producto agregado al carrito');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification('Producto eliminado');
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Clear Cart
function clearCart() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        cart = [];
        saveCart();
        updateCartUI();
        showNotification('Carrito vaciado');
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('terravia_cart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
    console.log('🔄 Actualizando UI del carrito. Items:', cart.length);
    
    // Update count badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        // Siempre visible, incluso en 0
        cartCount.style.display = 'flex';
        cartCount.style.visibility = 'visible';
        cartCount.style.opacity = '1';
        console.log('🔢 Total items en badge:', totalItems);
        console.log('📍 Badge element:', cartCount);
        console.log('🎨 Badge computed styles:', window.getComputedStyle(cartCount));
    } else {
        console.error('❌ No se encontró el elemento cartCount');
    }
    
    // Show/hide empty state
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'flex';
        if (cartItems) cartItems.innerHTML = '';
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';
    
    // Render cart items
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image ${item.image}"></div>
                <div class="cart-item-details">
                    <h6 class="cart-item-name">${item.name}</h6>
                    <p class="cart-item-price">$${formatPrice(item.price)} c/u</p>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">
                                <i class="bi bi-dash"></i>
                            </button>
                            <span class="quantity-number">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <p class="cart-item-subtotal">Subtotal: $${formatPrice(item.price * item.quantity)}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingThreshold = 30000;
    const shippingCost = subtotal >= shippingThreshold ? 0 : 3000;
    const total = subtotal + shippingCost;
    
    // Update totals
    if (cartSubtotal) cartSubtotal.textContent = `$${formatPrice(subtotal)}`;
    if (cartShipping) {
        cartShipping.innerHTML = subtotal >= shippingThreshold 
            ? '<span class="text-success">¡GRATIS!</span>' 
            : `$${formatPrice(shippingCost)}`;
    }
    if (cartTotal) cartTotal.textContent = `$${formatPrice(total)}`;
}

// Format Price
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Animate Cart Badge
function animateCartBadge() {
    if (cartCount) {
        cartCount.style.animation = 'none';
        setTimeout(() => {
            cartCount.style.animation = 'cartBounce 0.5s ease';
        }, 10);
    }
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<i class="bi bi-check-circle me-2"></i>${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #1A3A2E, #2D4A3E);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(26, 58, 46, 0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Proceed to Checkout (WhatsApp)
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal >= 30000 ? 0 : 3000;
    const total = subtotal + shippingCost;
    
    let message = '*¡Hola TERRAVÍA!* Quiero hacer un pedido:%0A%0A';
    message += '*📦 PRODUCTOS:*%0A';
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}%0A`;
        message += `   • Cantidad: ${item.quantity}%0A`;
        message += `   • Precio unitario: $${formatPrice(item.price)}%0A`;
        message += `   • Subtotal: $${formatPrice(item.price * item.quantity)}%0A%0A`;
    });
    
    message += `*💰 RESUMEN:*%0A`;
    message += `Subtotal: $${formatPrice(subtotal)}%0A`;
    message += `Envío: ${shippingCost === 0 ? 'GRATIS ✓' : '$' + formatPrice(shippingCost)}%0A`;
    message += `*TOTAL: $${formatPrice(total)}*%0A%0A`;
    message += '¿Cuándo puedo pasar a retirar? o ¿Hacen delivery a mi dirección?';
    
    const whatsappURL = `https://wa.me/56928032627?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCart);

console.log('✅ Shopping Cart System Loaded');