const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('#navbar');
function closeMenu() {
  navbar.classList.remove('active');
  menuIcon.classList.remove('bx-x');
  menuIcon.setAttribute('aria-expanded', 'false');
  menuIcon.setAttribute('aria-label', 'Menüyü aç');
}
menuIcon.addEventListener('click', () => {
  const open = navbar.classList.toggle('active');
  menuIcon.classList.toggle('bx-x', open);
  menuIcon.setAttribute('aria-expanded', String(open));
  menuIcon.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
});
window.addEventListener('scroll', closeMenu, { passive: true });
document.querySelectorAll('.navbar a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navbar.classList.contains('active')) {
    closeMenu(); menuIcon.focus();
  }
});
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const body = `Ad: ${data.get('name')}\nE-posta: ${data.get('email')}\nTelefon: ${data.get('phone')}\n\n${data.get('message')}`;
  location.href = `mailto:esmabayka374@gmail.com?subject=${encodeURIComponent(data.get('topic') || 'Portfolyo üzerinden iletişim')}&body=${encodeURIComponent(body)}`;
});
