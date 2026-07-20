(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    function scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    window.scrollToSection = scrollToSection;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    });

    navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
        });
    });

    function updateActiveNav() {
        var sections = document.querySelectorAll('.section, .hero');
        var scrollPos = window.scrollY + 200;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-links a').forEach(function (a) {
                    a.classList.remove('active');
                });
                var activeLink = document.querySelector('.nav-links a[href="#' + id + '"]');
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    loginBtn.addEventListener('click', function () { loginModal.classList.add('active'); });
    registerBtn.addEventListener('click', function () { registerModal.classList.add('active'); });
    closeLoginModal.addEventListener('click', function () { loginModal.classList.remove('active'); });
    closeRegisterModal.addEventListener('click', function () { registerModal.classList.remove('active'); });
    switchToRegister.addEventListener('click', function (e) { e.preventDefault(); loginModal.classList.remove('active'); registerModal.classList.add('active'); });
    switchToLogin.addEventListener('click', function (e) { e.preventDefault(); registerModal.classList.remove('active'); loginModal.classList.add('active'); });

    loginModal.addEventListener('click', function (e) { if (e.target === loginModal) loginModal.classList.remove('active'); });
    registerModal.addEventListener('click', function (e) { if (e.target === registerModal) registerModal.classList.remove('active'); });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        loginModal.classList.remove('active');
        showToast('登录成功，欢迎回来！', 'success');
    });

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        registerModal.classList.remove('active');
        showToast('注册成功，欢迎使用智医云！', 'success');
    });

    function showToast(message, type) {
        var container = document.getElementById('toastContainer');
        var toast = document.createElement('div');
        toast.className = 'toast ' + (type || 'info');
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(function () { toast.remove(); }, 300);
        }, 3000);
    }
    window.showToast = showToast;

    function animateCounters() {
        var counters = document.querySelectorAll('.stat-num[data-target]');
        counters.forEach(function (counter) {
            var target = parseFloat(counter.getAttribute('data-target'));
            var isDecimal = target % 1 !== 0;
            var duration = 2000;
            var startTime = null;

            function update(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = eased * target;
                if (isDecimal) {
                    counter.textContent = current.toFixed(1);
                } else if (target >= 10000) {
                    counter.textContent = Math.floor(current).toLocaleString() + '+';
                } else {
                    counter.textContent = Math.floor(current);
                }
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    heroObserver.observe(document.querySelector('.hero-stats'));

    var particleCanvas = document.getElementById('particleCanvas');
    var ctx = particleCanvas.getContext('2d');
    var particles = [];
    var mouseX = 0;
    var mouseY = 0;

    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function Particle() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    Particle.prototype.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;

        var dx = mouseX - this.x;
        var dy = mouseY - this.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
        }
    };

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 170, ' + this.opacity + ')';
        ctx.fill();
    };

    for (var i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(function (p) {
            p.update();
            p.draw();
        });

        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(0, 212, 170, ' + (0.1 * (1 - dist / 120)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    var knowledgeData = [
        { title: '高血压患者的日常管理指南', desc: '了解如何通过饮食、运动和药物管理控制血压，降低心血管疾病风险。', category: 'prevention', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', date: '2026-07-18', views: 2341 },
        { title: '地中海饮食：科学认证的健康饮食模式', desc: '富含蔬果、全谷物和健康脂肪的地中海饮食，被证实能有效降低慢性病风险。', category: 'nutrition', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>', date: '2026-07-16', views: 1892 },
        { title: '每天30分钟有氧运动的惊人益处', desc: '规律的有氧运动不仅能增强心肺功能，还能改善情绪、提高睡眠质量。', category: 'exercise', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', date: '2026-07-15', views: 3120 },
        { title: '正念冥想：缓解焦虑的有效方法', desc: '通过正念冥想训练，学会关注当下，有效缓解焦虑和压力，提升心理健康。', category: 'mental', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>', date: '2026-07-14', views: 1567 },
        { title: '中医四季养生：夏季养心篇', desc: '夏季心火旺盛，中医建议清淡饮食、适当午休，以养心安神。', category: 'tcm', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20"/></svg>', date: '2026-07-12', views: 987 },
        { title: '糖尿病前期：逆转的黄金窗口期', desc: '糖尿病前期是可逆的，通过生活方式干预，可以有效阻止或延缓糖尿病的发生。', category: 'prevention', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', date: '2026-07-10', views: 2756 },
    ];

    var categoryNames = { nutrition: '营养饮食', exercise: '运动健身', mental: '心理健康', prevention: '疾病预防', tcm: '中医养生' };

    function renderKnowledge(filter, search) {
        var grid = document.getElementById('knowledgeGrid');
        var filtered = knowledgeData;
        if (filter && filter !== 'all') {
            filtered = filtered.filter(function (item) { return item.category === filter; });
        }
        if (search) {
            var s = search.toLowerCase();
            filtered = filtered.filter(function (item) {
                return item.title.toLowerCase().includes(s) || item.desc.toLowerCase().includes(s);
            });
        }
        grid.innerHTML = filtered.map(function (item) {
            return '<div class="knowledge-card" data-category="' + item.category + '">' +
                '<div class="knowledge-card-img">' + item.icon + '</div>' +
                '<div class="knowledge-card-body">' +
                '<span class="knowledge-card-tag">' + categoryNames[item.category] + '</span>' +
                '<h3 class="knowledge-card-title">' + item.title + '</h3>' +
                '<p class="knowledge-card-desc">' + item.desc + '</p>' +
                '<div class="knowledge-card-footer"><span>' + item.date + '</span><span>' + item.views + ' 阅读</span></div>' +
                '</div></div>';
        }).join('');
    }
    renderKnowledge('all');

    document.querySelectorAll('.cat-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.cat-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderKnowledge(btn.getAttribute('data-cat'), document.getElementById('knowledgeSearch').value);
        });
    });

    document.getElementById('knowledgeSearch').addEventListener('input', function (e) {
        var activeCat = document.querySelector('.cat-btn.active').getAttribute('data-cat');
        renderKnowledge(activeCat, e.target.value);
    });

    var doctorsData = {
        internal: [
            { name: '张明远', title: '主任医师 · 内科', rating: 4.9, avatar: '张' },
            { name: '李慧芳', title: '副主任医师 · 心内科', rating: 4.8, avatar: '李' },
            { name: '王建国', title: '主治医师 · 消化内科', rating: 4.7, avatar: '王' },
        ],
        surgery: [
            { name: '陈志强', title: '主任医师 · 普外科', rating: 4.9, avatar: '陈' },
            { name: '赵伟', title: '副主任医师 · 骨科', rating: 4.8, avatar: '赵' },
        ],
        pediatrics: [
            { name: '刘小燕', title: '主任医师 · 儿科', rating: 4.9, avatar: '刘' },
            { name: '孙丽', title: '副主任医师 · 新生儿科', rating: 4.7, avatar: '孙' },
        ],
        gynecology: [
            { name: '周美玲', title: '主任医师 · 妇科', rating: 4.9, avatar: '周' },
            { name: '吴静', title: '副主任医师 · 产科', rating: 4.8, avatar: '吴' },
        ],
        ophthalmology: [
            { name: '郑光明', title: '主任医师 · 眼科', rating: 4.8, avatar: '郑' },
        ],
        dermatology: [
            { name: '黄晓丽', title: '副主任医师 · 皮肤科', rating: 4.7, avatar: '黄' },
        ],
        mental: [
            { name: '林心怡', title: '主任医师 · 心理科', rating: 4.9, avatar: '林' },
        ],
        tcm: [
            { name: '杨中医', title: '主任医师 · 中医科', rating: 4.8, avatar: '杨' },
        ],
    };

    var selectedDept = 'internal';
    var selectedDoctor = null;
    var selectedDate = null;
    var selectedTime = null;
    var currentMonth = new Date();

    function renderDoctors(dept) {
        var list = document.getElementById('doctorList');
        var doctors = doctorsData[dept] || [];
        list.innerHTML = doctors.map(function (doc, i) {
            return '<div class="doctor-card" data-index="' + i + '">' +
                '<div class="doctor-avatar">' + doc.avatar + '</div>' +
                '<div class="doctor-info">' +
                '<div class="doctor-name">' + doc.name + '</div>' +
                '<div class="doctor-title">' + doc.title + '</div>' +
                '<div class="doctor-rating">★ ' + doc.rating + '</div>' +
                '</div></div>';
        }).join('');
        selectedDoctor = null;
        list.querySelectorAll('.doctor-card').forEach(function (card) {
            card.addEventListener('click', function () {
                list.querySelectorAll('.doctor-card').forEach(function (c) { c.classList.remove('selected'); });
                card.classList.add('selected');
                selectedDoctor = doctorsData[dept][parseInt(card.getAttribute('data-index'))];
            });
        });
    }

    document.querySelectorAll('.dept-card').forEach(function (card) {
        card.addEventListener('click', function () {
            document.querySelectorAll('.dept-card').forEach(function (c) { c.classList.remove('active'); });
            card.classList.add('active');
            selectedDept = card.getAttribute('data-dept');
            renderDoctors(selectedDept);
        });
    });

    renderDoctors('internal');

    function renderCalendar() {
        var year = currentMonth.getFullYear();
        var month = currentMonth.getMonth();
        document.getElementById('calendarTitle').textContent = year + '年' + (month + 1) + '月';

        var firstDay = new Date(year, month, 1).getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var today = new Date();
        var daysContainer = document.getElementById('calendarDays');
        var html = '';

        for (var i = 0; i < firstDay; i++) {
            html += '<div class="cal-day empty"></div>';
        }

        for (var d = 1; d <= daysInMonth; d++) {
            var date = new Date(year, month, d);
            var isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var isToday = date.toDateString() === today.toDateString();
            var isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            var classes = 'cal-day';
            if (isPast) classes += ' disabled';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            html += '<div class="' + classes + '" data-date="' + year + '-' + (month + 1) + '-' + d + '">' + d + '</div>';
        }

        daysContainer.innerHTML = html;

        daysContainer.querySelectorAll('.cal-day:not(.disabled):not(.empty)').forEach(function (day) {
            day.addEventListener('click', function () {
                daysContainer.querySelectorAll('.cal-day').forEach(function (d) { d.classList.remove('selected'); });
                day.classList.add('selected');
                var parts = day.getAttribute('data-date').split('-');
                selectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                renderTimeSlots();
            });
        });
    }

    document.getElementById('prevMonth').addEventListener('click', function () {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        renderCalendar();
    });
    document.getElementById('nextMonth').addEventListener('click', function () {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();

    function renderTimeSlots() {
        var container = document.getElementById('timeSlots');
        var grid = document.getElementById('slotsGrid');
        container.style.display = 'block';

        var slots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
        var unavailable = [2, 5, 9, 12];

        grid.innerHTML = slots.map(function (slot, i) {
            var isDisabled = unavailable.indexOf(i) !== -1;
            return '<button class="time-slot' + (isDisabled ? ' disabled' : '') + '"' + (isDisabled ? ' disabled' : '') + '>' + slot + '</button>';
        }).join('');

        selectedTime = null;
        grid.querySelectorAll('.time-slot:not(.disabled)').forEach(function (btn) {
            btn.addEventListener('click', function () {
                grid.querySelectorAll('.time-slot').forEach(function (b) { b.classList.remove('selected'); });
                btn.classList.add('selected');
                selectedTime = btn.textContent;
                document.getElementById('confirmAppointment').disabled = false;
            });
        });
    }

    document.getElementById('confirmAppointment').addEventListener('click', function () {
        if (!selectedDoctor || !selectedDate || !selectedTime) {
            showToast('请选择医生、日期和时间段', 'error');
            return;
        }
        var dateStr = selectedDate.getFullYear() + '年' + (selectedDate.getMonth() + 1) + '月' + selectedDate.getDate() + '日';
        showToast('预约成功！' + selectedDoctor.name + ' ' + dateStr + ' ' + selectedTime, 'success');
        selectedDoctor = null;
        selectedDate = null;
        selectedTime = null;
        document.getElementById('confirmAppointment').disabled = true;
        document.querySelectorAll('.doctor-card').forEach(function (c) { c.classList.remove('selected'); });
        document.querySelectorAll('.cal-day').forEach(function (d) { d.classList.remove('selected'); });
        document.getElementById('timeSlots').style.display = 'none';
    });

    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(function (section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(section);
    });

})();