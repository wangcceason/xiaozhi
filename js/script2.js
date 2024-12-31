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

    // 清除targetPage（在成功加载页面后）
    window.addEventListener('load', () => {
        localStorage.removeItem('targetPage');
    });

    const destinationLine = document.querySelector('.destination-line');
    const buttonContainer = document.querySelector('.button-container');
    
    if (destinationLine && buttonContainer) {
        let isAnimating = false;

        const animate = () => {
            if (isAnimating) return;
            isAnimating = true;

            const firstItem = destinationLine.querySelector('.destination-item');
            const moveDistance = firstItem.offsetWidth + 15; // 图片宽度 + 间距

            // 克隆第一个元素
            const clone = firstItem.cloneNode(true);
            
            requestAnimationFrame(() => {
                destinationLine.appendChild(clone);
                
                destinationLine.style.transition = 'transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)';
                destinationLine.style.transform = `translateX(-${moveDistance}px)`;

                destinationLine.addEventListener('transitionend', function handler() {
                    destinationLine.removeEventListener('transitionend', handler);
                    
                    requestAnimationFrame(() => {
                        destinationLine.style.transition = 'none';
                        firstItem.remove();
                        destinationLine.style.transform = 'translateX(0)';
                        
                        requestAnimationFrame(() => {
                            isAnimating = false;
                        });
                    });
                }, { once: true });
            });
        };

        buttonContainer.addEventListener('click', animate);
    }
}); 