// Configurações
const WA_NUMBER = "5519982438102";

// Search state
let searchTimeout = null;
let currentSearchQuery = '';

// Função para gerar HTML do card
function createCard(product, category) {
    return `
        <div class="card">
            <div class="img-box">
                <span class="card-tag">${categoryLabels[category]?.title || category}</span>
                <img src="${product.img}" class="zoom-img" alt="${product.name}">
            </div>
            <div class="card-body">
                <h3 class="p-name">${product.name}</h3>
                <div class="price p-price">${product.price}</div>
                <a href="#" class="buy-btn btn-wa">
                    <i data-lucide="shopping-cart" width="13" height="13"></i>
                    Comprar
                </a>
            </div>
        </div>
    `;
}

// Função para gerar HTML da seção
function createSection(category, data) {
    const label = categoryLabels[category];
    return `
        <section class="section fade-up" id="${category}">
            <div class="sec-badge">
                <i data-lucide="${label.icon}" width="11" height="11"></i> ${label.title}
            </div>
            <h2 class="sec-title">${label.title}</h2>
            <p class="zoom-hint">
                <i data-lucide="search" width="13" height="13"></i> Toque na imagem para ampliar
            </p>
            <div class="product-grid">
                ${data.map(p => createCard(p, category)).join('')}
            </div>
        </section>
    `;
}

// Renderiza o banner rotativo
function renderBanner() {
    const bannerContainer = document.getElementById('bannerContainer');
    if (!bannerContainer || banners.length === 0) return;

    let html = `
        <div class="banner-carousel">
            <div class="banner-slides">
                ${banners.map((b, i) => `
                    <a href="${b.link}" class="banner-slide ${i === 0 ? 'active' : ''}">
                        <img src="${b.img}" alt="Banner">
                    </a>
                `).join('')}
            </div>
            <button class="banner-nav banner-prev" onclick="changeBanner(-1)">
                <i data-lucide="chevron-left" width="24" height="24"></i>
            </button>
            <button class="banner-nav banner-next" onclick="changeBanner(1)">
                <i data-lucide="chevron-right" width="24" height="24"></i>
            </button>
            <div class="banner-dots">
                ${banners.map((_, i) => `
                    <span class="banner-dot ${i === 0 ? 'active' : ''}" onclick="goToBanner(${i})"></span>
                `).join('')}
            </div>
        </div>
    `;
    bannerContainer.innerHTML = html;
    lucide.createIcons();
    
    // Auto-play
    setInterval(() => changeBanner(1), 5000);
}

let currentBanner = 0;

function changeBanner(direction) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    if (slides.length === 0) return;
    
    slides[currentBanner].classList.remove('active');
    dots[currentBanner].classList.remove('active');
    
    currentBanner = (currentBanner + direction + slides.length) % slides.length;
    
    slides[currentBanner].classList.add('active');
    dots[currentBanner].classList.add('active');
}

function goToBanner(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    if (slides.length === 0) return;
    
    slides[currentBanner].classList.remove('active');
    dots[currentBanner].classList.remove('active');
    
    currentBanner = index;
    
    slides[currentBanner].classList.add('active');
    dots[currentBanner].classList.add('active');
}

// Filter products by query
function filterProducts(query) {
    if (!query.trim()) return products;
    
    const q = query.toLowerCase().trim();
    const filtered = {};
    
    for (const [category, items] of Object.entries(products)) {
        const matches = items.filter(product => 
            product.name.toLowerCase().includes(q)
        );
        if (matches.length > 0) {
            filtered[category] = matches;
        }
    }
    
    return filtered;
}

// Render products from data object (products or filtered)
function renderProductsData(data) {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    let html = '';
    for (const [category, items] of Object.entries(data)) {
        html += createSection(category, items);
    }
    container.innerHTML = html;
    
    lucide.createIcons();
    initWhatsApp();
    initLightbox();
    initFadeIn();
}

// Update search info display
function showSearchInfo(msg, visible = true) {
    const info = document.getElementById('searchInfo');
    if (info) {
        info.textContent = msg;
        info.style.display = visible ? 'block' : 'none';
    }
}

// Renderiza todos os produtos
function renderProducts() {
    renderProductsData(products);
    showSearchInfo('', false);
    currentSearchQuery = '';
}

// Inicializa links do WhatsApp
function initWhatsApp() {
    document.querySelectorAll('.card').forEach(card => {
        const name = card.querySelector('.p-name')?.innerText.trim();
        const price = card.querySelector('.p-price')?.innerText.trim();
        const btn = card.querySelector('.btn-wa');
        if (btn && name && price) {
            btn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Olá! Quero comprar: ${name} — ${price}`)}`;
            btn.target = '_blank';
        }
    });
}

// Inicializa Lightbox
function initLightbox() {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    
    document.querySelectorAll('.zoom-img').forEach(img => {
        img.addEventListener('click', () => {
            lbImg.src = img.src;
            lb.classList.add('open');
            document.body.classList.add('no-scroll');
        });
    });
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.classList.remove('open');
    document.body.classList.remove('no-scroll');
}

// Mobile Menu
function openMobileMenu() {
    document.getElementById('mobileNav').classList.add('open');
    document.getElementById('mobileOverlay').classList.add('open');
    document.body.classList.add('no-scroll');
    lucide.createIcons();
}

function closeMobileMenu() {
    document.getElementById('mobileNav').classList.remove('open');
    document.getElementById('mobileOverlay').classList.remove('open');
    document.body.classList.remove('no-scroll');
}

// Active category on scroll
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const catLinks = document.querySelectorAll('.cat-link');
    const catBar = document.getElementById('catBar');

    window.addEventListener('scroll', () => {
        let cur = '';
        sections.forEach(s => {
            if (window.scrollY + 100 >= s.offsetTop) cur = s.id;
        });
        catLinks.forEach(l => {
            const isActive = l.getAttribute('href') === `#${cur}`;
            l.classList.toggle('active', isActive);
            if (isActive) {
                const lR = l.getBoundingClientRect();
                const bR = catBar.getBoundingClientRect();
                if (lR.left < bR.left + 16 || lR.right > bR.right - 16) {
                    l.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
                }
            }
        });
    }, { passive: true });
}

// Fade-in animation
function initFadeIn() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { 
            if (e.isIntersecting) e.target.classList.add('visible'); 
        });
    }, { threshold: 0.07 });
    document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
}

// ESC key handler
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { 
        closeLightbox(); 
        closeMobileMenu(); 
    }
});

// Init search functionality
function initSearch() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const container = document.getElementById('searchContainer');

    if (!input || !clearBtn) return;

    // Debounced search
    function performSearch() {
        const query = input.value.trim();
        currentSearchQuery = query;

        if (query) {
            const filtered = filterProducts(query);
            const total = Object.values(filtered).reduce((sum, items) => sum + items.length, 0);
            
            renderProductsData(filtered);
            showSearchInfo(`Encontrados ${total} resultado(s): "${query}"`, true);
            clearBtn.style.display = 'flex';
        } else {
            renderProducts();
        }
    }

    input.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        currentSearchQuery = '';
        renderProducts();
        clearBtn.style.display = 'none';
        showSearchInfo('', false);
        input.focus();
    });

    // Show/hide clear on focus
    input.addEventListener('focus', () => {
        if (input.value.trim()) clearBtn.style.display = 'flex';
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderBanner();
    renderProducts();
    initScrollSpy();
    initSearch();
});

