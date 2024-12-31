document.addEventListener('DOMContentLoaded', function() {
    // 添加轮播图功能
    const slider = document.querySelector('.banner-slider');
    const dots = document.querySelector('.banner-dots');
    const images = document.querySelectorAll('.banner-slider img');
    let currentIndex = 0;
    const totalImages = images.length;
    let interval;

    if (slider && dots && images.length > 0) {
        // 创建指示点
        for (let i = 0; i < totalImages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('banner-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dots.appendChild(dot);
        }

        // 切换到指定幻灯片
        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
        }

        // 更新轮播图显示
        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * 1366}px)`;
            
            // 更新指示点状态
            document.querySelectorAll('.banner-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // 自动播放
        function autoPlay() {
            currentIndex = (currentIndex + 1) % totalImages;
            updateSlider();
        }

        // 开始自动播放
        function startAutoPlay() {
            if (interval) clearInterval(interval);
            interval = setInterval(autoPlay, 4000);
        }

        // 停止自动播放
        function stopAutoPlay() {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        }

        // 初始启动自动播放
        startAutoPlay();

        // 鼠标悬停时暂停自动播放
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
    }

    // 导航栏交互
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');
    const navBorder = document.querySelector('.nav-border');
    
    // 获取当前页面文件名
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // 从 localStorage 获取保存的位置
    let currentPosition = parseInt(localStorage.getItem('navPosition')) || 0;
    
    // 设置初始位置和active状态
    navItems.forEach((item, index) => {
        const link = item.querySelector('a').getAttribute('href');
        if (currentPage.includes(link)) {
            currentPosition = 105 * index;
            item.classList.add('active');
            localStorage.setItem('navPosition', currentPosition);
        }
    });

    // 设置初始边框位置（无动画）
    navBorder.style.transition = 'none';
    navBorder.style.transform = `translateX(${currentPosition}px)`;
    
    // 导航项事件
    navItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            navBorder.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            navBorder.style.transform = `translateX(${105 * index}px)`;
        });

        item.addEventListener('click', (e) => {
            const link = item.querySelector('a').getAttribute('href');
            if (link !== '#' && link !== '') {
                e.preventDefault();
                currentPosition = 105 * index;
                localStorage.setItem('navPosition', currentPosition);
                window.location.href = link;
            }
        });
    });

    // 鼠标离开导航栏时返回当前位置
    navLinks.addEventListener('mouseleave', () => {
        navBorder.style.transform = `translateX(${currentPosition}px)`;
    });

    // 滚动处理
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const header = document.querySelector('.main-nav');
        
        if (currentScrollY > lastScrollY) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // 酒店搜索功能
    const searchBtn = document.getElementById('searchBtn');
    const destinationInput = document.getElementById('destination');
    const checkInDateInput = document.getElementById('checkInDate');
    const checkOutDateInput = document.getElementById('checkOutDate');

    // 设置日期
    if (checkInDateInput && checkOutDateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // 设置入住日期为今天
        checkInDateInput.value = formatDate(today);
        checkInDateInput.min = formatDate(today);

        // 设置退房日期为明天
        checkOutDateInput.value = formatDate(tomorrow);
        checkOutDateInput.min = formatDate(tomorrow);

        // 确保退房日期不能早于入住日期
        checkInDateInput.addEventListener('change', () => {
            const nextDay = new Date(checkInDateInput.value);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutDateInput.min = formatDate(nextDay);
            
            if (checkOutDateInput.value <= checkInDateInput.value) {
                checkOutDateInput.value = formatDate(nextDay);
            }
        });
    }

    // 搜索按钮点击事件
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            destinationInput.value = '';
            // 保留日期不清除
        });
    }

    // 标签切换功能
    const tabs = document.querySelectorAll('.search-tabs .tab');
    if (tabs) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                if(tab.dataset.tab === 'domestic') {
                    destinationInput.placeholder = '请输入国内目的地/酒店名称';
                } else {
                    destinationInput.placeholder = '请输入国际目的地/酒店名称';
                }
            });
        });
    }
}); 