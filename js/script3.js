document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.banner-slider');
    const dots = document.querySelector('.banner-dots');
    const images = document.querySelectorAll('.banner-slider img');
    let currentIndex = 0;
    const totalImages = images.length;
    let interval;

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

    // 导航栏交互
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');
    const navBorder = document.querySelector('.nav-border');
    
    // 获取当前页面文件名
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // 从 localStorage 获取保存的位置
    let currentPosition = parseInt(localStorage.getItem('navPosition')) || 0;
    
    // 设置初始边框位置（无动画）
    navBorder.style.transition = 'none';
    navBorder.style.transform = `translateX(${currentPosition}px)`;
    
    // 设置初始位置和active状态
    navItems.forEach((item, index) => {
        const link = item.querySelector('a').getAttribute('href');
        if (currentPage.includes(link)) {
            currentPosition = 105 * index;
            item.classList.add('active');
        }
    });

    // 点击事件处理
    navItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            navBorder.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            navBorder.style.transform = `translateX(${105 * index}px)`;
        });

        item.addEventListener('click', (e) => {
            const link = item.querySelector('a').getAttribute('href');
            if (link !== '#' && link !== '') {
                e.preventDefault();
                
                navItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');
                
                currentPosition = 105 * index;
                localStorage.setItem('navPosition', currentPosition);
                
                // 直接跳转，不设置过渡动画
                window.location.href = link;
            }
        });
    });

    // 鼠标离开效果
    navLinks.addEventListener('mouseleave', () => {
        navBorder.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        navBorder.style.transform = `translateX(${currentPosition}px)`;
    });

    // 清除targetPage（在成功加载页面后）
    window.addEventListener('load', () => {
        localStorage.removeItem('targetPage');
    });

    // 在原有代码末尾添加滚动处理
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const header = document.querySelector('.main-nav');
        
        // 向下滚动
        if (currentScrollY > lastScrollY) {
            header.style.transform = 'translateY(-100%)';
        } 
        // 向上滚动
        else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // 在 DOMContentLoaded 事件处理函数开始处添加
    const directNavigation = localStorage.getItem('directNavigation');
    if (directNavigation) {
        // 如果是直接导航，立即设置边框位置
        navBorder.style.transition = 'none';
        navBorder.style.transform = `translateX(${currentPosition}px)`;
        // 清除标记
        localStorage.removeItem('directNavigation');
    } else {
        // 正常初始化代码...
        navBorder.style.opacity = '0';
        requestAnimationFrame(() => {
            navBorder.style.transition = 'none';
            navBorder.style.transform = `translateX(${currentPosition}px)`;
            requestAnimationFrame(() => {
                navBorder.style.opacity = '1';
                navBorder.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease';
            });
        });
    }

    // 添加机票搜索功能
    const searchBtn = document.getElementById('searchBtn');
    const departureInput = document.getElementById('departure');
    const destinationInput = document.getElementById('destination');
    const departureDateInput = document.getElementById('departureDate');

    // 设置今天的日期
    if (departureDateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');  // 月份从0开始，需要+1
        const day = String(today.getDate()).padStart(2, '0');
        
        // 设置默认日期为今天
        departureDateInput.value = `${year}-${month}-${day}`;
        
        // 设置最小日期为今天，防止选择过去的日期
        departureDateInput.min = `${year}-${month}-${day}`;
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            // 清空出发地和目的地输入框，但保留日期
            departureInput.value = '';
            destinationInput.value = '';
        });
    }

    // 在现有代码后添加
    const tabs = document.querySelectorAll('.search-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有标签的active类
            tabs.forEach(t => t.classList.remove('active'));
            // 给当前点击的标签添加active类
            tab.classList.add('active');
            
            // 根据不同标签可以设置不同的placeholder
            if(tab.dataset.tab === 'domestic') {
                document.getElementById('departure').placeholder = '请输入国内出发地';
                document.getElementById('destination').placeholder = '请输入国内目的地';
            } else {
                document.getElementById('departure').placeholder = '请输入国际出发地';
                document.getElementById('destination').placeholder = '请输入国际目的地';
            }
        });
    });
}); 