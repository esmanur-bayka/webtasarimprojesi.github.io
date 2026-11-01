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
  location.href = `mailto:esmabayka374@gmail.com?subject=${encodeURIComponent(data.get('topic') || 'Portföy üzerinden iletişim')}&body=${encodeURIComponent(body)}`;
});

const certificateEntries = [...document.querySelectorAll('.certificate-entry')];
const certificateCount = document.querySelector('#certificate-count');
function updateCertificateCount(category = 'all') {
  const count = certificateEntries.filter(entry => category === 'all' || entry.dataset.category === category).length;
  certificateCount.textContent = `${count} belge gösteriliyor`;
}
updateCertificateCount();

document.querySelectorAll('[data-certificate-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.certificateFilter;
    document.querySelectorAll('[data-certificate-filter]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    certificateEntries.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
    });
    updateCertificateCount(category);
  });
});

// Match the navigation state to the section below the fixed header.
const sectionLinks = [...document.querySelectorAll('.navbar a[href^="#"]')];
const navigationSections = sectionLinks.map(link => document.querySelector(link.hash));
let navigationFrame = 0;
function updateCurrentSection() {
  navigationFrame = 0;
  const marker = document.querySelector('.header').getBoundingClientRect().bottom + 24;
  let active = navigationSections[0];
  for (const section of navigationSections) {
    if (section.getBoundingClientRect().top <= marker) active = section;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) active = navigationSections.at(-1);
  for (const link of sectionLinks) {
    const current = link.hash === `#${active.id}`;
    link.classList.toggle('active', current);
    if (current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function scheduleNavigationUpdate() {
  if (!navigationFrame) navigationFrame = requestAnimationFrame(updateCurrentSection);
}
window.addEventListener('scroll', scheduleNavigationUpdate, {passive:true});
window.addEventListener('resize', scheduleNavigationUpdate, {passive:true});
window.addEventListener('hashchange', scheduleNavigationUpdate);
updateCurrentSection();
