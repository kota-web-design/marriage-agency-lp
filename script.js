// ============================================
//  初期化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initDrawer();
  initFAQ();
  initAnimation();
  initFixedCTA();
});


// ============================================
//  ヘッダー スクロール
// ============================================
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}


// ============================================
//  ドロワー（完全版）
// ============================================
function initDrawer() {
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');

  if (!hamburger || !drawer || !overlay) return;

  let scrollY = 0;

  const open = () => {
    if (drawer.classList.contains('open')) return;

    scrollY = window.scrollY;

    drawer.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('open');

    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');

    // スクロール固定（iOS対応）
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.left = '0';
    document.body.style.right = '0';

    // フォーカス移動
    closeBtn?.focus();
  };

  const close = () => {
    if (!drawer.classList.contains('open')) return;

    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');

    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');

    // スクロール復元
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.left = '';
    document.body.style.right = '';

    window.scrollTo(0, scrollY);

    // フォーカス戻す
    hamburger.focus();
  };

  // =========================
  // イベント
  // =========================
  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? close() : open();
  });

  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      close();
    }
  });

  document.querySelectorAll('.drawer-nav a').forEach(link => {
    link.addEventListener('click', close);
  });

  // =========================
  // フォーカストラップ（神機能）
  // =========================
  const focusable = drawer.querySelectorAll('a, button');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  document.addEventListener('keydown', (e) => {
    if (!drawer.classList.contains('open')) return;

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}


// ============================================
//  FAQ
// ============================================
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach(i => {
        i.classList.remove('open');

        const otherBtn = i.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}


// ============================================
//  スクロールアニメーション
// ============================================
function initAnimation() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  });

  elements.forEach(el => observer.observe(el));
}


// ============================================
//  FIXED CTA
// ============================================
function initFixedCTA() {
  const cta = document.querySelector('.fixed-cta');
  if (!cta) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {

        const scrollY = window.scrollY;
        const windowH = window.innerHeight;
        const docH = document.documentElement.scrollHeight;

        // 表示条件（デバイス最適化）
        const showStart = scrollY > windowH * 0.6;
        const nearBottom = scrollY + windowH > docH - 150;

        if (showStart && !nearBottom) {
          cta.classList.add('show');
        } else {
          cta.classList.remove('show');
        }

        ticking = false;
      });

      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}
