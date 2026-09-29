(() => {
 const carousel = document.querySelector('.hero-visual');
 if (!carousel) return;
 const images = [...carousel.querySelectorAll('.hero-image')];
 const buttons = [...carousel.querySelectorAll('.hero-image-button')];
 const names = ['Lone Wolf Emblem', 'Wolf Head', 'Isolation Breeds Growth', 'Lone Wolf Typography'];
 let current = 0;
 function show(index) {
  current = (index + images.length) % images.length;
  images.forEach((image, i) => {
   if (i === current && image.dataset.src) { image.src = image.dataset.src; delete image.dataset.src; }
   image.hidden = i !== current;
   buttons[i].setAttribute('aria-pressed', String(i === current));
  });
  carousel.querySelector('.hero-piece-label').textContent = names[current];
 }
 buttons.forEach((button, i) => button.addEventListener('click', () => show(i)));
 carousel.querySelector('.hero-previous').addEventListener('click', () => show(current - 1));
 carousel.querySelector('.hero-next').addEventListener('click', () => show(current + 1));
 carousel.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
 });
 let touch;
 carousel.addEventListener('touchstart', event => {
  touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
 }, { passive: true });
 carousel.addEventListener('touchend', event => {
  if (!touch) return;
  const dx = event.changedTouches[0].clientX - touch.x, dy = event.changedTouches[0].clientY - touch.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
  touch = null;
 }, { passive: true });
 carousel.addEventListener('touchcancel', () => { touch = null; });
 const header = document.querySelector('.navbar-container');
 const measure = () => document.body.style.setProperty('--home-header-height', `${header.getBoundingClientRect().height}px`);
 new ResizeObserver(measure).observe(header); measure();
})();
