// Inicializa ícones
        lucide.createIcons();

        // NÚMERO E LÓGICA DO WHATSAPP
        const SEU_NUMERO = "5519982438102";

        window.onload = function() {
            document.querySelectorAll('.card').forEach(card => {
                const name = card.querySelector('.p-name').innerText.trim();
                const price = card.querySelector('.p-price').innerText.trim();
                const btn = card.querySelector('.btn-wa');
                
                // Monta a mensagem final
                const msg = `Olá! Quero comprar a ${name} por ${price}`;
                // Aplica o link correto ao botão
                btn.href = `https://wa.me/${SEU_NUMERO}?text=${encodeURIComponent(msg)}`;
            });
        };

        // Lógica de Tela Cheia (Zoom)
        const lb = document.getElementById('lightbox');
        const lbImg = document.getElementById('lightbox-img');
        document.querySelectorAll('.zoom-img').forEach(img => {
            img.onclick = () => {
                lbImg.src = img.src;
                lb.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
        function closeLightbox() {
            lb.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }

        // Menu Mobile
        function toggleMenu() {
            const nav = document.getElementById('navLinks');
            const icon = document.getElementById('menuIcon');
            nav.classList.toggle('active');
            const isOpen = nav.classList.contains('active');
            icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
            lucide.createIcons();
        }