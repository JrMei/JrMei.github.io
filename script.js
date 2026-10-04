/* Lightweight UI logic. No frameworks, no tracking, no external API dependencies. */
(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.getElementById('site-header');
  const themeToggle = document.getElementById('theme-toggle');
  const languageToggle = document.getElementById('language-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-links');
  const progressFill = document.getElementById('progress-fill');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const safeStore = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* private mode */ } }
  };

  // Chinese strings only. English originals remain in the semantic HTML.
  const zh = {
    skip: '跳转至正文', navLabel: '主导航', navAbout: '关于', navResearch: '研究',
    navPublications: '论文', navEngineering: '项目', navExperience: '经历', navContact: '联系',
    heroEyebrow: '同济大学 · 硕士研究生', heroTitleLine1: '让智能',
    heroTitleLine2: '融入运动。', heroLead: '探索智能车辆如何感知、推理与行动——从视觉语言动作模型到真实车辆控制。',
    exploreResearch: '探索研究', heroMeta: '中国上海 · VLA / 具身智能 / 智能控制',
    heroVisualLabel: '感知、推理与车辆控制的抽象动态示意图',
    visualCore: '感知 · 推理 · 行动', visualPerception: '感知', visualReasoning: '推理',
    visualControl: '控制', visualCaption: '面向物理世界，构建真正可用的智能', scrollHint: '向下探索',
    aboutEyebrow: '01 / 关于我', aboutTitle: '连接人工智能\n与车辆运动。',
    aboutLead: '我是梅家锐（Jiarui Mei），同济大学硕士研究生，研究方向为自动驾驶与具身智能。',
    aboutBody: '我的研究结合视觉语言动作模型、强化学习与模型预测控制。我关注的不只是算法表现，更希望将模型转化为能够在仿真环境中验证、最终走向实车的智能系统。',
    factNow: '目前就读', factNowValue: '同济大学 · 硕士研究生', factFocus: '研究方向', factBased: '所在城市', factBasedValue: '中国 · 上海',
    researchEyebrow: '02 / 研究方向', researchTitle: '研究兴趣',
    researchIntro: '贯通环境感知、智能决策与安全自适应控制的完整技术链路。',
    focusVlaTitle: '视觉－语言－动作模型', focusVlaBody: '面向复杂驾驶场景，研究多模态感知、主动视觉注意、时序记忆与轨迹生成。',
    focusRlTitle: '强化学习', focusRlBody: '通过环境交互学习驾驶决策与自适应控制策略，涉及 PPO、DDPG 和车辆底层控制。',
    focusControlTitle: '规划与控制', focusControlBody: '结合结构化驾驶意图、模型预测控制与车辆运动规划，研究学习与控制的协同。',
    publicationsEyebrow: '03 / 学术工作', publicationsTitle: '代表性研究',
    publicationsIntro: '三篇在投研究手稿，涵盖学习式控制、越野 VLA 与动力学约束导航；在投不代表录用。',
    pubTypeResearch: '研究手稿', pubTypeCollaborative: '合作研究', pubStatusVerify: '研究手稿',
    pubStatusOngoing: '持续研究中', pubStatusTVT: 'IEEE TVT · 在投', pubStatusNCE: 'NCE · 在投', pubStatusAEI: 'AEI · 在投', viewDetails: '查看详情 ↗',
    pubSimpcDescription: '结合基于 PPO 的驾驶意图、意图平滑、协同汇入和数据驱动 MPC 的学习－控制框架。',
    pubTgamDescription: 'TGAM / F²OCUS：面向越野视觉语言动作驾驶，结合主动地形感知与具身时序记忆。',
    pubVlaTitle: '自动驾驶视觉－语言－动作相关研究',
    pubVlaDescription: '参与自动驾驶 VLA 合作研究。正式论文题目、作者名单及公开链接在核实前暂不展示。', pubDynalignDescription: '合作开展 VLA 研究，关注高层导航与车辆动力学对齐，以实现动力学可行的驾驶轨迹。',
    pubCoauthor: '合作作者',
    publicationNote: '三篇论文均处于在投状态，尚不等同于录用或正式发表；公开链接与最终出版信息将在确认后补充。',
    engineeringEyebrow: '04 / 精选项目', engineeringTitle: '让研究落地',
    engineeringIntro: '展示从仿真基线到车辆控制实验的代表性系统与可复现工作。',
    filterAria: '项目类别筛选', filterAll: '全部项目', filterResearch: '科研', filterSystems: '工程',
    projectTgamType: '越野 VLA · 科研', stageInProgress: '进行中', stageNCE: 'NCE · 在投',
    projectTgamTitle: '越野 VLA 主动感知',
    projectTgamDescription: '基于 Wild-Drive 开展轨迹引导主动感知与动作条件时序记忆研究；单轨迹基线已审计，进一步实验与闭环验证依照公开进度更新。',
    projectSimpcType: '规划与控制', stageSimulated: '已完成仿真评测',
    projectSimpcTitle: '结构化意图模型预测控制',
    projectSimpcDescription: '将 PPO 意图、结构化意图过滤、汇入协调与数据驱动 MPC 结合，在混合交通仿真中进行评测。',
    project4wsType: '具身控制 · 方案探索', project4wsTitle: '通用驾驶模型 + 四轮独立控制',
    project4wsDescription: '探索分层控制方案：以通用自动驾驶大模型为上层，强化学习为底层控制器，面向四轮独立驱动与独立转向底盘。',
    projectSimulationType: '仿真与评测', projectSimulationTitle: '驾驶仿真与闭环评测',
    projectSimulationDescription: '围绕 CARLA / Bench2Drive、SUMO 与 BeamNG.tech 构建可复现的训练及评测流程，并推进闭环测试接口对接。',
    projectDdpgType: '强化学习', stageOpenSource: '已开源',
    projectDdpgTitle: '基于强化学习的自动换道',
    projectDdpgDescription: '早期的开源换道研究项目，基于 Highway-env 实现 DDPG、DQN 和 TD3，提供训练脚本与算法对比。',
    projectDdpgLink: '查看项目源代码',
    moreProjects: '在 GitHub 查看更多代码与实验',
    skillsEyebrow: '05 / 技术栈', skillsTitle: '我使用的工具',
    skillsIntro: '科研、实验与工程实现中的常用方法和工具；正在探索的技术另行标注。',
    skillAiTitle: 'AI 与多模态学习', skillAiDescription: '模型训练、参数高效微调与多模态表示学习。',
    skillControlTitle: '决策与控制', skillControlDescription: '优化式运动规划与学习式驾驶决策。',
    skillPlatformsTitle: '平台与工程', skillPlatformsDescription: '仿真平台、GPU 实验与可复现研发流程。',
    exploringText: '正在探索：Isaac Lab、4WID/4WS 控制，以及面向 NVIDIA Jetson Orin 的部署流程。',
    experienceEyebrow: '06 / 教育与经历', experienceTitle: '一路走来。',
    experienceIntro: '自动化专业基础，与智能车辆研究经验相互交织。',
    tongjiDate: '2026 — 至今', tongjiTitle: '同济大学', tongjiRole: '硕士研究生 · 车辆工程',
    tongjiDescription: '智能汽车研究所 · 汽车具身智能研究组，研究方向为自动驾驶及视觉语言动作系统。',
    hduTitle: '杭州电子科技大学', hduRole: '工学学士 · 自动化',
    hduDescription: '本科阶段开展强化学习、自动驾驶决策与智能控制方向的研究。',
    internTitle: '杭州电子科技大学丽水研究院', internRole: '人工智能方向 · 科研实习',
    internDescription: '开展自动驾驶、机器学习与仿真方面的早期应用研究。',
    personalEyebrow: '07 / 实验室之外', personalTitle: '保持好奇，\n坚持实践。',
    personalDescription: '科研之外，我喜欢足球与骑行。团队运动让我更加重视协作、领导力与持续解决问题的能力。',
    personalFootball: '校足球队成员', personalCaptain: '院队队长', personalCycling: '骑行',
    honorsEyebrow: '荣誉与奖励', honorsTitle: '部分荣誉',
    honorOne: '杭州电子科技大学 · 本科期间学业奖学金',
    honorTwo: '省级竞赛奖项 · 挑战杯与多媒体设计竞赛',
    honorThree: '英语：CET-6，通过口语考试，口语表现优秀',
    contactEyebrow: '08 / 联系方式', contactTitle: '期待下一次合作。',
    contactBody: '欢迎就学术交流、开源协作，以及自动驾驶、VLA 和具身智能相关议题交流。',
    contactEmail: '发送邮件', footerRights: '保留所有权利。',
    footerMade: '为清晰而设计，以开放 Web 构建。', backTop: '返回顶部 ↑'
  };

  const translatableNodes = [...document.querySelectorAll('[data-i18n]')];
  const originals = new Map(translatableNodes.map(node => [node, node.innerHTML]));
  const ariaNodes = [...document.querySelectorAll('[data-i18n-aria]')];
  const originalAria = new Map(ariaNodes.map(node => [node, node.getAttribute('aria-label')]));

  function setLanguage(language) {
    const lang = language === 'zh' ? 'zh' : 'en';
    root.lang = lang === 'zh' ? 'zh-CN' : 'en';
    root.dataset.language = lang;
    translatableNodes.forEach(node => {
      const key = node.dataset.i18n;
      if (lang === 'en') {
        node.innerHTML = originals.get(node); // Captured from our own static HTML.
      } else if (Object.hasOwn(zh, key)) {
        const translation = zh[key];
        if (node.querySelector('.accent-dot')) {
          const dot = node.querySelector('.accent-dot');
          node.replaceChildren(document.createTextNode(translation), dot);
        } else if (node.querySelector('br')) {
          const segments = translation.split('\n');
          node.replaceChildren(...segments.flatMap((segment, i) => i ? [document.createElement('br'), document.createTextNode(segment)] : [document.createTextNode(segment)]));
        } else {
          node.textContent = translation;
        }
      }
    });
    ariaNodes.forEach(node => {
      const key = node.dataset.i18nAria;
      node.setAttribute('aria-label', lang === 'zh' ? (zh[key] || originalAria.get(node)) : originalAria.get(node));
    });
    languageToggle.innerHTML = lang === 'zh' ? '<strong>中</strong><span class="tool-divider">/</span>EN' : '中<span class="tool-divider">/</span><strong>EN</strong>';
    languageToggle.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换为中文');
    languageToggle.title = lang === 'zh' ? 'Switch to English' : '切换为中文';
    menuToggle.setAttribute('aria-label', menuToggle.getAttribute('aria-expanded') === 'true'
      ? (lang === 'zh' ? '关闭导航' : 'Close navigation')
      : (lang === 'zh' ? '打开导航' : 'Open navigation'));
    document.title = lang === 'zh' ? '梅家锐 · 自动驾驶与具身智能' : 'Jiarui Mei · Autonomous Driving & Embodied AI';
    document.querySelector('meta[name="description"]').content = lang === 'zh'
      ? '梅家锐，同济大学研究生。研究方向包括自动驾驶、VLA、强化学习与车辆控制。'
      : 'Jiarui Mei — graduate researcher at Tongji University working on vision-language-action models, autonomous driving, reinforcement learning and vehicle control.';
    safeStore.set('language', lang);
  }
  languageToggle.addEventListener('click', () => setLanguage(root.dataset.language === 'en' ? 'zh' : 'en'));

  // Persist appearance preference; follow the system on the first visit.
  function setTheme(theme) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    themeToggle.setAttribute('aria-pressed', String(dark));
    const inChinese = root.dataset.language === 'zh';
    themeToggle.setAttribute('aria-label', inChinese
      ? (dark ? '切换浅色模式' : '切换深色模式')
      : (dark ? 'Switch to light mode' : 'Switch to dark mode'));
    document.querySelector('meta[name="theme-color"]').content = dark ? '#101115' : '#f5f5f7';
    safeStore.set('theme', dark ? 'dark' : 'light');
  }
  const storedTheme = safeStore.get('theme');
  setTheme(storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  setLanguage(safeStore.get('language') || 'en');
  // Refresh translated ARIA label after language switches.
  languageToggle.addEventListener('click', () => setTheme(root.dataset.theme));

  // Mobile nav: button, backdrop/outside click, Escape, and anchor activation.
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', root.dataset.language === 'zh'
      ? (open ? '关闭导航' : '打开导航') : (open ? 'Close navigation' : 'Open navigation'));
  }
  menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false); menuToggle.focus();
    }
  });
  document.addEventListener('pointerdown', event => {
    if (menu.classList.contains('is-open') && !event.target.closest('.nav')) setMenu(false);
  });
  window.matchMedia('(min-width: 841px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  // IntersectionObserver animates only once. Fallback always shows content.
  const revealNodes = [...document.querySelectorAll('.reveal')];
  if (!('IntersectionObserver' in window) || reducedMotion.matches) {
    revealNodes.forEach(node => node.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: .07 });
    revealNodes.forEach(node => revealObserver.observe(node));
    reducedMotion.addEventListener('change', event => {
      if (event.matches) revealNodes.forEach(node => node.classList.add('is-visible'));
    });
  }

  // Projects: a real filter, with hidden cards removed from layout and focus order.
  const filterButtons = [...document.querySelectorAll('.filter-chip')];
  const projectCards = [...document.querySelectorAll('.project-card')];
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(candidate => {
        const selected = candidate === button;
        candidate.classList.toggle('is-selected', selected);
        candidate.setAttribute('aria-pressed', String(selected));
      });
      projectCards.forEach(card => {
        const visible = filter === 'all' || card.dataset.category.split(' ').includes(filter);
        card.hidden = !visible;
        if (visible) card.classList.add('is-visible');
      });
    });
  });

  // One passive scroll handler for progress + compact-header appearance.
  let scrollQueued = false;
  function updateScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    progressFill.style.width = `${ratio * 100}%`;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  // Active link tracks visible main sections. Others deliberately have no nav item.
  const navLinks = [...menu.querySelectorAll('a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const current = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', current);
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -68% 0px' });
    document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));
  }

  document.getElementById('copyright-year').textContent = String(new Date().getFullYear());


  // Fine-pointer-only interactions: magnetic buttons, soft card tilt and hero parallax.
  // Animation is cosmetic and never interferes with links, keyboard navigation or touch.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (finePointer.matches) {
    const magnets = [...document.querySelectorAll('.magnetic')];
    const cards = [...document.querySelectorAll('.mouse-card')];
    const hero = document.querySelector('.hero-visual');
    const heroFrame = hero?.querySelector('.visual-frame');
    let pointer = null;
    let raf = 0;
    const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
    const rectDistance = (x, y, r) => Math.hypot(
      Math.max(r.left - x, 0, x - r.right),
      Math.max(r.top - y, 0, y - r.bottom)
    );
    function reset() {
      pointer = null;
      for (const button of magnets) {
        button.classList.remove('is-near');
        button.style.setProperty('--mx', '0px');
        button.style.setProperty('--my', '0px');
      }
      for (const card of cards) {
        card.classList.remove('is-near');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--lift', '0px');
      }
      hero?.classList.remove('is-near');
      if (heroFrame) {
        for (const prop of ['--hx', '--hy']) heroFrame.style.setProperty(prop, '0px');
        for (const prop of ['--hrx', '--hry']) heroFrame.style.setProperty(prop, '0deg');
      }
    }
    function animate() {
      raf = 0;
      if (!pointer || reducedMotion.matches) return;
      const { x, y } = pointer;
      for (const button of magnets) {
        const r = button.getBoundingClientRect();
        const d = rectDistance(x, y, r);
        if (d > 96) {
          button.classList.remove('is-near');
          button.style.setProperty('--mx', '0px');
          button.style.setProperty('--my', '0px');
          continue;
        }
        const strength = 1 - d / 96;
        const dx = clamp((x - r.left - r.width / 2) * .10 * strength, -9, 9);
        const dy = clamp((y - r.top - r.height / 2) * .10 * strength, -9, 9);
        button.classList.add('is-near');
        button.style.setProperty('--mx', `${dx}px`);
        button.style.setProperty('--my', `${dy}px`);
        button.style.setProperty('--spot-x', `${x - r.left}px`);
        button.style.setProperty('--spot-y', `${y - r.top}px`);
      }
      for (const card of cards) {
        if (card.hidden || (card.classList.contains('reveal') && !card.classList.contains('is-visible'))) continue;
        const r = card.getBoundingClientRect();
        const d = rectDistance(x, y, r);
        if (d > 92) {
          if (card.classList.contains('is-near')) {
            card.classList.remove('is-near');
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
            card.style.setProperty('--lift', '0px');
          }
          continue;
        }
        card.classList.add('is-near');
        card.style.setProperty('--px', `${x-r.left}px`);
        card.style.setProperty('--py', `${y-r.top}px`);
        if (d === 0) {
          const nx = clamp((x-r.left)/r.width*2-1,-1,1);
          const ny = clamp((y-r.top)/r.height*2-1,-1,1);
          card.style.setProperty('--rx', `${-ny*2.1}deg`);
          card.style.setProperty('--ry', `${nx*2.1}deg`);
          card.style.setProperty('--lift', '-2px');
        } else {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
          card.style.setProperty('--lift', '-1px');
        }
      }
      if (hero && heroFrame) {
        const r = hero.getBoundingClientRect();
        if (rectDistance(x,y,r) < 90) {
          const nx = clamp((x-r.left-r.width/2)/(r.width/2),-1,1);
          const ny = clamp((y-r.top-r.height/2)/(r.height/2),-1,1);
          hero.classList.add('is-near');
          heroFrame.style.setProperty('--hx', `${nx*3}px`);
          heroFrame.style.setProperty('--hy', `${ny*3}px`);
          heroFrame.style.setProperty('--hrx', `${-ny*1.7}deg`);
          heroFrame.style.setProperty('--hry', `${nx*1.7}deg`);
          heroFrame.style.setProperty('--px', `${x-r.left}px`);
          heroFrame.style.setProperty('--py', `${y-r.top}px`);
        } else if (hero.classList.contains('is-near')) {
          hero.classList.remove('is-near');
          heroFrame.style.setProperty('--hx', '0px');
          heroFrame.style.setProperty('--hy', '0px');
          heroFrame.style.setProperty('--hrx', '0deg');
          heroFrame.style.setProperty('--hry', '0deg');
        }
      }
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(animate); }
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || reducedMotion.matches) return;
      pointer = {x:e.clientX, y:e.clientY}; schedule();
    }, {passive:true});
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule, {passive:true});
    document.addEventListener('pointerout', e => { if (!e.relatedTarget) reset(); });
    window.addEventListener('blur', reset);
    finePointer.addEventListener('change', e => { if (!e.matches) reset(); });
    reducedMotion.addEventListener('change', e => { if (e.matches) reset(); });
  }

})();
