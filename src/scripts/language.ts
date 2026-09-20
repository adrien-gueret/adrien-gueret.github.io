// This is the only browser JavaScript. Content and navigation work without it.
const key = 'portfolio-language';

document.querySelectorAll<HTMLAnchorElement>('a[data-language]').forEach((link) => {
  link.addEventListener('click', () => {
    try {
      localStorage.setItem(key, link.dataset.language!);
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
