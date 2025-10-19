// Variables globales
let cart = [];
let currentProduct = null;

// Elementos del DOM
const optionsBtn = document.querySelector('.options-btn');
const dropdownMenu = document.querySelector('.dropdown-menu');
const cartToggle = document.querySelector('.cart-toggle');
const cartContainer = document.querySelector('.cart-container');
const closeCart = document.querySelector('.close-cart');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkout');
const quantityModal = document.getElementById('quantityModal');
const modalProductName = document.getElementById('modalProductName');
const productQuantity = document.getElementById('productQuantity');
const decreaseQuantity = document.getElementById('decreaseQuantity');
const increaseQuantity = document.getElementById('increaseQuantity');
const cancelAdd = document.getElementById('cancelAdd');
const confirmAdd = document.getElementById('confirmAdd');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

// ===== CARRITO PERSISTENTE =====
// Cargar carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('lumiherbCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
        console.log('Carrito cargado:', cart);
    }
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('lumiherbCart', JSON.stringify(cart));
    console.log('Carrito guardado:', cart);
}

// ===== CARRUSEL INFINITO =====
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    
    if (!track || !slides.length) {
        console.log('No se encontró el carrusel');
        return;
    }
    
    // Clonar slides para efecto infinito
    const firstSlide = slides[0].cloneNode(true);
    const secondSlide = slides[1].cloneNode(true);
    const thirdSlide = slides[2].cloneNode(true);
    
    track.appendChild(firstSlide);
    track.appendChild(secondSlide);
    track.appendChild(thirdSlide);
    
    const allSlides = document.querySelectorAll('.carousel-slide');
    const totalSlides = allSlides.length;
    const slidesToShow = 3;
    
    let currentIndex = 0;
    let isAnimating = false;
    let autoPlayInterval;

    function updateCarousel() {
        if (isAnimating) return;
        
        isAnimating = true;
        const slideWidth = allSlides[0].offsetWidth + 20;
        track.style.transition = 'transform 0.8s ease-in-out';
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        // Resetear posición cuando llegue al final
        setTimeout(() => {
            if (currentIndex >= totalSlides - slidesToShow) {
                track.style.transition = 'none';
                currentIndex = 0;
                track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            }
            if (currentIndex < 0) {
                track.style.transition = 'none';
                currentIndex = totalSlides - slidesToShow - 1;
                track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            }
            isAnimating = false;
        }, 800);
    }

    function nextSlide() {
        if (isAnimating) return;
        currentIndex++;
        updateCarousel();
    }

    function prevSlide() {
        if (isAnimating) return;
        currentIndex--;
        updateCarousel();
    }

    // Event listeners para botones
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Auto avanzar cada 3 segundos
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Pausar autoplay al interactuar
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Hacer los productos mini clickeables - AHORA REDIRIGEN A CATEGORÍAS
    document.querySelectorAll('.mini-product').forEach(product => {
        product.addEventListener('click', function() {
            const productName = this.querySelector('h4').textContent;
            
            // Redirigir según el tipo de producto
            if (productName.includes('Jabón')) {
                window.location.href = 'jabones.html';
            } else if (productName.includes('Shampoo')) {
                window.location.href = 'shampoo.html';
            } else if (productName.includes('Acondicionador')) {
                window.location.href = 'acondicionador.html';
            }
        });
    });

    // Inicializar
    updateCarousel();
    startAutoPlay();

    // Ajustar en resize
    window.addEventListener('resize', function() {
        updateCarousel();
    });
}

// ===== MODAL PARA MISIÓN/VISIÓN =====
function initInfoModals() {
    const infoModal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close-modal');

    if (!infoModal) return; // Si no existe el modal, salir

    // Contenido para cada modal
    const modalContents = {
        'mision': {
            title: 'Nuestra Misión',
            content: 'Brindar bienestar y cuidado a las personas a través de la creación de productos naturales del cuidado personal, desarrollando productos de calidad para todo tipo de piel y necesidades.'
        },
        'vision': {
            title: 'Nuestra Visión',
            content: 'Ser una empresa mexicana reconocida por sus productos en pro del cuidado personal y uso de ingredientes naturales, compartiendo con el mundo nuestra esencia al  ofrecer productos que se adapten a todas las personas, sin importar su cultura o estilo de vida.'
        },
        'valores': {
            title: 'Nuestros Valores',
            content: 'Responsabilidad: somos una empresa comprometida con nuestros colaboradores, consumidores y nuestro entorno, es por ello que buscamos que cada etapa -desde la elaboración hasta la entrega del producto final- cumpla con estándares éticos y de calidad.<br>Compromiso: tenemos un compromiso con los consumidores, es por ello que buscamos coherencia con la calidad de los productos, así como los procesos utilizados, a fin de mantener nuestros valores y estándares de calidad que nos distinguen. <br>Calidad: los productos utilizados son seleccionados cuidadosamente, así como nuestras pruebas dermatológicas que se utilizan. Esto con el fin de utilizar los mejores productos y dar seguridad de que los consumidores usan productos seguros, eficaces y sostenibles'
        }
    };

    // Event listeners para los botones del menú
    const misionBtn = document.getElementById('mision-btn');
    const visionBtn = document.getElementById('vision-btn');
    const valoresBtn = document.getElementById('valores-btn');

    if (misionBtn) {
        misionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showInfoModal('mision');
        });
    }

    if (visionBtn) {
        visionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showInfoModal('vision');
        });
    }

    if (valoresBtn) {
        valoresBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showInfoModal('valores');
        });
    }

    function showInfoModal(type) {
        const content = modalContents[type];
        modalTitle.textContent = content.title;
        modalContent.innerHTML = content.content;
        infoModal.style.display = 'flex';
        if (dropdownMenu) dropdownMenu.classList.remove('active'); // Cerrar menú
    }

    // Cerrar modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            infoModal.style.display = 'none';
        });
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });
}

// ===== FUNCIONALIDAD DEL CARRITO =====
// Mostrar/ocultar menú de opciones
if (optionsBtn) {
    optionsBtn.addEventListener('click', function() {
        dropdownMenu.classList.toggle('active');
    });
}

// Cerrar menú al hacer clic fuera de él
document.addEventListener('click', function(event) {
    if (optionsBtn && !optionsBtn.contains(event.target) && dropdownMenu && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('active');
    }
});

// Mostrar/ocultar carrito
if (cartToggle) {
    cartToggle.addEventListener('click', function() {
        cartContainer.classList.toggle('active');
    });
}

if (closeCart) {
    closeCart.addEventListener('click', function() {
        cartContainer.classList.remove('active');
    });
}

// Funcionalidad de agregar al carrito
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.dataset.product;
        const productPrice = parseFloat(productCard.dataset.price);
        
        currentProduct = {
            name: productName,
            price: productPrice
        };
        
        modalProductName.textContent = productName;
        productQuantity.value = 1;
        quantityModal.style.display = 'flex';
    });
});

// Control de cantidad en el modal
if (decreaseQuantity) {
    decreaseQuantity.addEventListener('click', function() {
        let quantity = parseInt(productQuantity.value);
        if (quantity > 1) {
            productQuantity.value = quantity - 1;
        }
    });
}

if (increaseQuantity) {
    increaseQuantity.addEventListener('click', function() {
        let quantity = parseInt(productQuantity.value);
        productQuantity.value = quantity + 1;
    });
}

// Cancelar agregar producto
if (cancelAdd) {
    cancelAdd.addEventListener('click', function() {
        quantityModal.style.display = 'none';
        currentProduct = null;
    });
}

// Confirmar agregar producto al carrito
if (confirmAdd) {
    confirmAdd.addEventListener('click', function() {
        if (currentProduct) {
            const quantity = parseInt(productQuantity.value);
            addToCart(currentProduct.name, currentProduct.price, quantity);
            quantityModal.style.display = 'none';
            currentProduct = null;
        }
    });
}

// Función para agregar producto al carrito
function addToCart(name, price, quantity) {
    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        // Si ya existe, aumentar la cantidad
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Si no existe, agregar nuevo producto
        cart.push({
            name: name,
            price: price,
            quantity: quantity
        });
    }
    
    updateCart();
    saveCart(); // Guardar en localStorage
    if (cartContainer) cartContainer.classList.add('active');
}

// Función para actualizar el carrito
function updateCart() {
    if (!cartItems) return;
    
    // Limpiar el contenido del carrito
    cartItems.innerHTML = '';
    
    let total = 0;
    let itemCount = 0;
    
    // Agregar cada producto al carrito
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemCount += item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
            </div>
            <div class="cart-item-quantity">
                <button class="cart-quantity-btn decrease" data-index="${index}">-</button>
                <span class="cart-quantity">${item.quantity}</span>
                <button class="cart-quantity-btn increase" data-index="${index}">+</button>
                <span class="remove-item" data-index="${index}">🗑️</span>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Actualizar total y contador
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    if (cartCount) cartCount.textContent = itemCount;
    
    // Agregar event listeners a los botones de cantidad y eliminar
    document.querySelectorAll('.cart-quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                updateCart();
                saveCart();
            }
        });
    });
    
    document.querySelectorAll('.cart-quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart[index].quantity++;
            updateCart();
            saveCart();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            updateCart();
            saveCart();
        });
    });
}

// Vaciar carrito
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
        cart = [];
        updateCart();
        saveCart();
    });
}

// Finalizar compra - AHORA REDIRIGE A PAGO.HTML
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        // Redirigir a la página de pago
        window.location.href = 'pago.html';
    });
}

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
    if (event.target === quantityModal) {
        quantityModal.style.display = 'none';
        currentProduct = null;
    }
});

// ===== INICIALIZACIÓN GLOBAL =====
// Esta función se ejecuta en TODAS las páginas
function initializePage() {
    console.log('Inicializando página...');
    
    // Siempre cargar el carrito primero
    loadCart();
    
    // Inicializar componentes específicos de cada página
    if (document.querySelector('.carousel-track')) {
        console.log('Inicializando carrusel...');
        initCarousel();
    }
    
    if (document.getElementById('infoModal')) {
        console.log('Inicializando modales de información...');
        initInfoModals();
    }
    
    console.log('Carrito actual:', cart);
    console.log('Página inicializada correctamente');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializePage);

// También cargar el carrito cuando la página se muestre (por si acaso)
window.addEventListener('pageshow', function() {
    loadCart();
});