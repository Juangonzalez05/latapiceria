// Revela elementos con [data-reveal] al entrar en pantalla. Una sola vez por elemento.
const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduce || !('IntersectionObserver' in window)) {
  els.forEach((el) => el.classList.add('is-visible'));
} else {
  const show = (el: Element) => {
    el.classList.add('is-visible');
    io.unobserve(el);
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && show(e.target)),
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
  );
  els.forEach((el) => io.observe(el));

  // Si se salta una sección (ancla o scroll muy rápido), revela lo que quedó por encima.
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      setTimeout(() => {
        for (const el of els) {
          if (!el.classList.contains('is-visible') && el.getBoundingClientRect().bottom < 0) show(el);
        }
        ticking = false;
      }, 200);
    },
    { passive: true }
  );
}
