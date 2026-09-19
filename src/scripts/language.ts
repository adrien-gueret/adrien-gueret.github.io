// This is the only browser JavaScript. Content and navigation work without it.
const key = 'portfolio-language';
const scrollKey = 'portfolio-language-scroll';

document.querySelectorAll<HTMLAnchorElement>('a[data-language]').forEach((link) => {
  link.addEventListener('click', () => {
    try {
      localStorage.setItem(key, link.dataset.language!);
      sessionStorage.setItem(scrollKey, JSON.stringify({
        path: new URL(link.href).pathname,
        x: window.scrollX,
        y: window.scrollY,
      }));
    } catch {
      // One simple fallback: let an explicit English choice bypass detection once.
      const target = new URL(link.href);
      if (target.pathname === '/' && link.dataset.language === 'en') {
        target.searchParams.set('lang', 'en');
        link.href = target.href;
      }
    }
  });
});

try {
  const savedScroll = JSON.parse(sessionStorage.getItem(scrollKey) || 'null');
  if (savedScroll?.path === location.pathname) {
    sessionStorage.removeItem(scrollKey);
    history.scrollRestoration = 'manual';
    window.scrollTo(savedScroll.x, savedScroll.y);
    requestAnimationFrame(() => {
      window.scrollTo(savedScroll.x, savedScroll.y);
      delete document.documentElement.dataset.restoringScroll;
    });
  }
} catch { /* Scroll restoration is an optional enhancement. */ }

const header = document.querySelector<HTMLElement>('.site-header');
if (header) {
  const updateHeader = () => header.classList.toggle('is-compact', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

if (location.pathname === '/') {
  const url = new URL(location.href);
  if (url.searchParams.get('lang') === 'en') {
    url.searchParams.delete('lang');
    history.replaceState(null, '', url);
  } else {
    let preferred: string | null = null;
    try { preferred = localStorage.getItem(key); } catch { /* Storage is optional. */ }
    const language = preferred === 'en' || preferred === 'fr'
      ? preferred
      : (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
    if (language.startsWith('fr')) {
      url.pathname = '/fr/';
      location.replace(url.href);
    }
  }
}
