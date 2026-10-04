/* Shared secondary-page controls, no runtime templating or external dependencies. */
(() => {
  'use strict';
  const root = document.documentElement;
  const langButton = document.getElementById('language-toggle');
  const themeButton = document.getElementById('theme-toggle');
  const progress = document.getElementById('progress-fill');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const store = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  function lang(value) {
    const zh = value === 'zh';
    root.dataset.language = zh ? 'zh' : 'en';
    root.lang = zh ? 'zh-CN' : 'en';
    langButton.innerHTML = zh ? '<strong>中</strong><span class="tool-divider">/</span>EN' : '中<span class="tool-divider">/</span><strong>EN</strong>';
    langButton.setAttribute('aria-label', zh ? 'Switch to English' : '切换为中文');
    store('language', root.dataset.language);
  }
  function theme(value) {
    const dark = value === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', root.dataset.language === 'zh' ? (dark ? '切换浅色模式':'切换深色模式') : (dark ? 'Switch to light mode':'Switch to dark mode'));
    document.querySelector('meta[name="theme-color"]').content = dark ? '#101115' : '#f5f5f7';
    store('theme', root.dataset.theme);
  }
  lang(root.dataset.language);
  theme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  langButton.addEventListener('click', () => { lang(root.dataset.language === 'zh' ? 'en' : 'zh'); theme(root.dataset.theme); });
  themeButton.addEventListener('click', () => theme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  let raf = 0;
  function updateScroll() {
    raf = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY/max*100) : 0}%`;
    document.querySelector('.detail-header').classList.toggle('is-scrolled', scrollY > 12);
  }
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(updateScroll); }, {passive:true});
  addEventListener('resize', updateScroll, {passive:true});
  updateScroll();
  const copyButton = document.getElementById('copy-link');
  copyButton?.addEventListener('click', async () => {
    const message = document.getElementById('copy-feedback');
    try {
      await navigator.clipboard.writeText(location.href);
      message.textContent = root.dataset.language === 'zh' ? '已复制页面链接' : 'Page link copied';
    } catch {
      message.textContent = root.dataset.language === 'zh' ? '请复制浏览器地址栏中的链接' : 'Copy the link from your browser address bar';
    }
  });
  // Minimal magnet on desktop only. Decorative, no impact on tap or focus.
  if (matchMedia('(pointer:fine) and (hover:hover)').matches) {
    for (const button of document.querySelectorAll('.detail-button.magnetic')) {
      button.addEventListener('pointermove', event => {
        if (reducedMotion.matches) return;
        const r = button.getBoundingClientRect();
        button.style.transform = `translate3d(${Math.max(-7,Math.min(7,(event.clientX-r.left-r.width/2)*.11))}px,${Math.max(-7,Math.min(7,(event.clientY-r.top-r.height/2)*.11))}px,0)`;
      },{passive:true});
      button.addEventListener('pointerleave', () => button.style.transform = '');
    }
  }
})();
