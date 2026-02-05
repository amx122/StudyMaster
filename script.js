document.addEventListener('DOMContentLoaded', () => {
    const UI = {
        calcType: document.getElementById('workType'),
        calcDays: document.getElementById('daysRange'),
        calcPages: document.getElementById('pagesRange'),   
        calcUnique: document.getElementById('uniqueRange'), 
        
        priceDisplay: document.getElementById('finalPrice'),
        daysDisplay: document.getElementById('daysValue'),
        pagesDisplay: document.getElementById('pagesValue'), 
        uniqueDisplay: document.getElementById('uniqueValue'), 
        
        // Модальні вікна
        orderModal: document.getElementById('modalOverlay'),
        closeOrderBtn: document.getElementById('closeModalBtn'),
        orderForm: document.getElementById('orderForm'),
        taskInput: document.querySelector('#orderForm textarea'),

        detailsModal: document.getElementById('detailsModal'),
        closeDetailsBtn: document.getElementById('closeDetailsBtn'),
        detailsTitle: document.getElementById('detailsTitle'),
        detailsBody: document.getElementById('detailsBody'),
        orderFromDetailsBtn: document.getElementById('orderFromDetailsBtn'),

        // Елементи інтерфейсу
        orderBtns: document.querySelectorAll('#navOrderBtn, #calcOrderBtn, .btn-order-direct, .mobile-btn'),
        detailsBtns: document.querySelectorAll('.btn-text'),
        hamburger: document.querySelector('.hamburger'),
        navLinks: document.querySelector('.nav-links'),
        navbar: document.querySelector('.navbar'),
        navItems: document.querySelectorAll('.nav-item')
    };

    const workStandards = {
        '250': 5,  
        '300': 10,  
        '350': 10,  
        '1000': 25, 
        '1500': 30, 
        '5000': 50, 
        '7000': 60  
    };

    const servicesInfo = {
        'it': {
            title: 'IT Розробка & Програмування',
            content: `
                <p>Технічні завдання будь-якої складності:</p>
                <ul>
                    <li><strong>Web:</strong> HTML5, CSS3, JS, React, PHP.</li>
                    <li><strong>Desktop:</strong> C#, C++, Python, Java.</li>
                    <li><strong>Scripts:</strong> Боти, парсинг, автоматизація.</li>
                </ul>`
        },
        'text': {
            title: 'Текстові Роботи',
            content: `
                <p>Роботи з високою унікальністю:</p>
                <ul>
                    <li>Курсові та Дипломні (повний супровід).</li>
                    <li>Реферати, Есе, Презентації.</li>
                </ul>`
        },
        'science': {
            title: 'Точні Науки',
            content: `
                <p>Розв'язання задач з поясненнями:</p>
                <ul>
                    <li>Вища математика, Статистика.</li>
                    <li>Фізика, Хімія, Інженерія.</li>
                </ul>`
        },
        'translate': {
            title: 'Переклади',
            content: `
                <p>Професійний переклад (EN, DE, PL, UA):</p>
                <ul><li>Технічний та художній переклад.</li></ul>`
        }
    };
    function updateCalculator() {
        if(!UI.calcType) return;
        let basePrice = parseInt(UI.calcType.value);
        let standardPages = workStandards[basePrice] || 10;
        let days = parseInt(UI.calcDays.value);
        let urgencyMultiplier = 1 + ((30 - days) / 35); 

        let selectedPages = parseInt(UI.calcPages.value);
        let pagesMultiplier = 1;

        if (selectedPages > standardPages) {
            pagesMultiplier = 1 + ((selectedPages - standardPages) / standardPages);
        } else if (selectedPages < standardPages) {
            // Якщо сторінок менше -> ціна падає, але не дуже сильно (фіксована база)
            pagesMultiplier = 1 - ((standardPages - selectedPages) / standardPages * 0.4); 
        }
        let unique = parseInt(UI.calcUnique.value);
        let uniqueMultiplier = 1;

        if (unique > 70) {
            uniqueMultiplier = 1 + ((unique - 70) * 0.015);
        }

        // ФІНАЛЬНИЙ РОЗРАХУНОК
        let finalPrice = Math.round(basePrice * urgencyMultiplier * pagesMultiplier * uniqueMultiplier);

        // Оновлення тексту на екрані
        if(UI.daysDisplay) UI.daysDisplay.textContent = days + (days === 1 ? ' день' : (days < 5 ? ' дні' : ' днів'));
        if(UI.pagesDisplay) UI.pagesDisplay.textContent = selectedPages + ' стор.';
        if(UI.uniqueDisplay) UI.uniqueDisplay.textContent = unique + '%';

        animatePriceChange(finalPrice);
    }

    function animatePriceChange(newPrice) {
        if(!UI.priceDisplay) return;
        UI.priceDisplay.style.textShadow = "0 0 25px #00f3ff";
        UI.priceDisplay.style.color = "#fff";
        UI.priceDisplay.textContent = newPrice;
        
        setTimeout(() => {
            UI.priceDisplay.style.color = ""; 
            UI.priceDisplay.style.textShadow = ""; 
        }, 250);
    }
    if(UI.calcType) {
        UI.calcType.addEventListener('change', updateCalculator);
        UI.calcDays.addEventListener('input', updateCalculator);
        if(UI.calcPages) UI.calcPages.addEventListener('input', updateCalculator);
        if(UI.calcUnique) UI.calcUnique.addEventListener('input', updateCalculator);
        
        updateCalculator(); 
    }
    window.openModal = function(serviceName = '') { 
        if(UI.taskInput) UI.taskInput.value = '';
        if (serviceName && UI.taskInput) {
            UI.taskInput.value = `Мене цікавить: ${serviceName}.\n\nДеталі замовлення: `;
        }
        UI.detailsModal.classList.remove('active');
        UI.orderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if(UI.navLinks) UI.navLinks.classList.remove('active');
        if(UI.hamburger) {
            const icon = UI.hamburger.querySelector('i');
            if(icon && icon.classList.contains('fa-times')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); 
            }
        }
    }

    function openOrderModalWrapper(e) {
        e.preventDefault();
        const title = e.currentTarget.getAttribute('data-title') || '';
        window.openModal(title);
    }

    function openDetailsModal(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        const serviceKey = btn.getAttribute('data-service');
        const info = servicesInfo[serviceKey];

        if (info) {
            UI.detailsTitle.innerText = info.title;
            UI.detailsBody.innerHTML = info.content;
            UI.orderFromDetailsBtn.setAttribute('data-target-service', info.title);
            UI.detailsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAllModals() {
        UI.orderModal.classList.remove('active');
        UI.detailsModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    UI.orderBtns.forEach(btn => btn.addEventListener('click', openOrderModalWrapper));
    UI.detailsBtns.forEach(btn => btn.addEventListener('click', openDetailsModal));

    if(UI.orderFromDetailsBtn) {
        UI.orderFromDetailsBtn.addEventListener('click', () => {
            const serviceName = UI.orderFromDetailsBtn.getAttribute('data-target-service');
            window.openModal(serviceName);
        });
    }

    if(UI.closeOrderBtn) UI.closeOrderBtn.addEventListener('click', closeAllModals);
    if(UI.closeDetailsBtn) UI.closeDetailsBtn.addEventListener('click', closeAllModals);
    
    [UI.orderModal, UI.detailsModal].forEach(modal => {
        if(modal) modal.addEventListener('click', (e) => { if(e.target === modal) closeAllModals(); });
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllModals(); });
    document.querySelectorAll('.faq-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.faq-card').forEach(c => {
                if(c !== card) c.classList.remove('active');
            });
            card.classList.toggle('active');
        });
    });
    if(UI.orderForm) {
        UI.orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 🔥 ВСТАВ СЮДИ СВОЇ ДАНІ 🔥
            const BOT_TOKEN = 'ВАШ_ТОКЕН_ТУТ'; 
            const CHAT_ID = 'ВАШ_CHAT_ID';      

            const inputs = UI.orderForm.querySelectorAll('input');
            const name = inputs[0].value;
            const contact = inputs[1].value;
            const text = UI.taskInput.value;

            const message = `🚀 <b>НОВЕ ЗАМОВЛЕННЯ!</b>\n\n👤 <b>Клієнт:</b> ${name}\n📱 <b>Контакт:</b> ${contact}\n📝 <b>Завдання:</b>\n${text}`;

            const submitBtn = UI.orderForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправка...';

            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
            })
            .then(response => {
                if (response.ok) {
                    submitBtn.innerHTML = 'Успішно! <i class="fas fa-check"></i>';
                    submitBtn.style.background = '#00ff88';
                    submitBtn.style.color = '#000';
                    setTimeout(() => {
                        closeAllModals();
                        UI.orderForm.reset(); 
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalText;
                        submitBtn.style = ''; 
                    }, 2000);
                } else {
                    alert("Помилка: перевір Token бота.");
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalText;
                }
            })
            .catch(error => {
                alert("Помилка мережі.");
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            });
        });
    }
    if(UI.hamburger && UI.navLinks) {
        UI.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            UI.navLinks.classList.toggle('active');
            
            // Зміна іконки (bars <-> times)
            const icon = UI.hamburger.querySelector('i');
            if (icon) {
                if(UI.navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        UI.navItems.forEach(item => {
            item.addEventListener('click', () => {
                UI.navLinks.classList.remove('active');
                const icon = UI.hamburger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (UI.navLinks.classList.contains('active')) {
                if (!UI.navLinks.contains(e.target) && !UI.hamburger.contains(e.target)) {
                    UI.navLinks.classList.remove('active');
                    const icon = UI.hamburger.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    }
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            UI.navbar.style.background = 'rgba(3, 3, 5, 0.98)';
            UI.navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            UI.navbar.style.background = 'rgba(3, 3, 5, 0.9)';
            UI.navbar.style.boxShadow = 'none';
        }
    });

});