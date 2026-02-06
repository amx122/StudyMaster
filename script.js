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
        

        orderModal: document.getElementById('modalOverlay'),
        closeOrderBtn: document.getElementById('closeModalBtn'),
        orderForm: document.getElementById('orderForm'),
        taskInput: document.querySelector('#orderForm textarea'),

        detailsModal: document.getElementById('detailsModal'),
        closeDetailsBtn: document.getElementById('closeDetailsBtn'),
        detailsTitle: document.getElementById('detailsTitle'),
        detailsBody: document.getElementById('detailsBody'),
        orderFromDetailsBtn: document.getElementById('orderFromDetailsBtn'),

        orderBtns: document.querySelectorAll('#navOrderBtn, #calcOrderBtn, .btn-order-direct, .mobile-btn'),
        detailsBtns: document.querySelectorAll('.btn-text'),
        hamburger: document.querySelector('.hamburger'),
        navLinks: document.querySelector('.nav-links'),
        navbar: document.querySelector('.navbar'),
        navItems: document.querySelectorAll('.nav-item')
    };

    const pricingRules = {
        '250': { 
            stdPages: 10, pagePrice: 5,   dayPrice: 10,  uniqueStep: 5, uniquePrice: 5 
        },
        '300': { 
            stdPages: 10, pagePrice: 5,   dayPrice: 10,  uniqueStep: 5, uniquePrice: 5 
        },
        '350': { 
            stdPages: 10, pagePrice: 5,   dayPrice: 10,  uniqueStep: 5, uniquePrice: 5 
        },
        '1000': { 
            stdPages: 25, pagePrice: 10,  dayPrice: 15,  uniqueStep: 5, uniquePrice: 10 
        },
        '1500': { 
            stdPages: 30, pagePrice: 10,  dayPrice: 30,  uniqueStep: 1, uniquePrice: 5 
        },
        '5000': { 
            stdPages: 50, pagePrice: 50,  dayPrice: 100, uniqueStep: 1, uniquePrice: 25 
        },
        '7000': { 
            stdPages: 60, pagePrice: 15,  dayPrice: 125, uniqueStep: 1, uniquePrice: 30 
        }
    };
    const servicesInfo = {
        'it': {
            title: 'IT Розробка & Програмування',
            content: `
                <p>Технічні завдання будь-якої складності:</p>
                <ul>
                    <li><strong>Web:</strong>Laravel,Vue,React,NodeJs</li>
                    <li><strong>Мобільні додатки:</strong>Kotlin Flutter/Dart</li>
                    <li><strong>Додатки під Windows:</strong>C# , C++ </li>
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
                <ul><li>Технічний  переклад.</li></ul>`
        }
    };

    function updateCalculator() {
        if(!UI.calcType) return;

        let basePrice = parseInt(UI.calcType.value);
        let rule = pricingRules[basePrice] || pricingRules['250']; 

        let finalPrice = basePrice;
        let pages = parseInt(UI.calcPages.value);
        if (pages > rule.stdPages) {
            finalPrice += (pages - rule.stdPages) * rule.pagePrice;
        }
        let days = parseInt(UI.calcDays.value);
        if (days < 30) {
            finalPrice += (30 - days) * rule.dayPrice;
        }
        let unique = parseInt(UI.calcUnique.value);
        if (unique > 70) {
            let extra = unique - 70;
            let multiplier = Math.ceil(extra / rule.uniqueStep);
            finalPrice += multiplier * rule.uniquePrice;
        }
        if(UI.daysDisplay) UI.daysDisplay.textContent = days + ' днів';
        if(UI.pagesDisplay) UI.pagesDisplay.textContent = pages + ' стор.';
        if(UI.uniqueDisplay) UI.uniqueDisplay.textContent = unique + '%';

        animatePriceChange(finalPrice);
    }

    function animatePriceChange(newPrice) {
        if(!UI.priceDisplay) return;
        UI.priceDisplay.textContent = newPrice;
    }
    if(UI.calcType) {
        UI.calcType.addEventListener('change', () => {
            let val = UI.calcType.value;
            let rule = pricingRules[val] || pricingRules['250'];
            UI.calcPages.value = rule.stdPages; 
            
            updateCalculator();
        });
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
            
            const BOT_TOKEN = '8359961042:AAE6bBO2uptp6Lja0Y95POI74CJxdSKDbBg'; 
            const CHAT_ID = '794256381';      

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
                    alert("Помилка налаштування Telegram.");
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