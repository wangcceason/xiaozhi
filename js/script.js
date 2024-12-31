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
    
    // 从 localStorage 获取保存的位置，如果没有则默认为0
    let currentPosition = parseInt(localStorage.getItem('navPosition')) || 0;
    
    // 设置初始位置和active状态
    navItems.forEach((item, index) => {
        const link = item.querySelector('a').getAttribute('href');
        // 如果当前页面URL包含链接URL，设置为active
        if (currentPage.includes(link)) {
            currentPosition = 90 * index;
            item.classList.add('active');
            // 保存位置到 localStorage
            localStorage.setItem('navPosition', currentPosition);
        }
    });

    // 先隐藏导航边框
    navBorder.style.opacity = '0';
    
    // 初始化时禁用动画并设置位置
    requestAnimationFrame(() => {
        navBorder.style.transition = 'none';
        navBorder.style.transform = `translateX(${currentPosition}px)`;
        
        // 在下一帧显示导航边框
        requestAnimationFrame(() => {
            navBorder.style.opacity = '1';
            navBorder.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease';
        });
    });
    
    // 为导航项添加事件
    navItems.forEach((item, index) => {
        // 鼠标进入效果
        item.addEventListener('mouseenter', () => {
            navBorder.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            navBorder.style.transform = `translateX(${90 * index}px)`;
        });

        // 点击效果
        item.addEventListener('click', (e) => {
            const link = item.querySelector('a').getAttribute('href');
            if (link !== '#' && link !== '') {
                e.preventDefault();
                
                // 移除所有active类并添加到当前项
                navItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');
                
                // 更新位置并保存到 localStorage
                currentPosition = 90 * index;
                localStorage.setItem('navPosition', currentPosition);
                
                navBorder.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                navBorder.style.transform = `translateX(${currentPosition}px)`;
                
                // 增加延迟时间到 400ms，确保动画完成
                setTimeout(() => {
                    window.location.href = link;
                },400);
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
}); 