(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const revealItems = Array.from(document.querySelectorAll('.reveal'));

  // 页脚年份
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 移动端菜单
  function closeMenu() {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '打开菜单');
  }

  menuToggle.addEventListener('click', function () {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', function (e) {
    if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) closeMenu();
  });

  // 滚动：导航阴影 + 当前栏目高亮
  let ticking = false;
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 12);

    const pos = window.scrollY + window.innerHeight * 0.32;
    let currentId = sections[0] ? sections[0].id : '';
    sections.forEach(section => {
      if (section.offsetTop <= pos) currentId = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });

    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // 滚动显现动画
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement.children).filter(el => el.classList.contains('reveal'));
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = Math.min(index, 4) * 80 + 'ms';
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }
})();
