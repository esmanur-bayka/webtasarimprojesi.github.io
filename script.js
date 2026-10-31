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

document.querySelectorAll('[data-certificate-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.certificateFilter;
    document.querySelectorAll('[data-certificate-filter]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    let count = 0;
    document.querySelectorAll('.certificate-entry').forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) count++;
    });
    document.querySelector('#certificate-count').textContent = `${count} belge gösteriliyor`;
  });
});
