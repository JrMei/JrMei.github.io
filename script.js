// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 添加滚动监听，用于导航栏样式变化
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('nav-scrolled');
        } else {
            header.classList.remove('nav-scrolled');
        }
    });

    // 元素进入视口时的动画效果
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('section > div > h2');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate-fade-in');
            }
        });
    };

    // 初始检查并添加滚动监听
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 为项目卡片添加点击事件
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果点击的是链接，不执行卡片点击事件
            if (e.target.closest('a')) return;
            
            const link = this.querySelector('a').href;
            window.open(link, '_blank');
        });
    });

    // 模拟从GitHub API获取贡献数据
    const fetchGitHubData = async () => {
        try {
            // 替换为你的GitHub用户名
            const username = 'JrMei';
            const response = await fetch(`https://api.github.com/users/${username}`);
            
            if (!response.ok) throw new Error('Failed to fetch data');
            
            const data = await response.json();
            
            // 更新页面上的GitHub数据
            const repoCount = document.getElementById('repo-count');
            if (repoCount) repoCount.textContent = data.public_repos;
            
            const followerCount = document.getElementById('follower-count');
            if (followerCount) followerCount.textContent = data.followers;
            
        } catch (error) {
            console.log('Error fetching GitHub data:', error);
        }
    };

    // 调用API获取数据
    fetchGitHubData();
});
