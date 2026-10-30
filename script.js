"use strict";
const menuButton = document.getElementById("menu-icon");
const navbar = document.getElementById("navbar");
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

function setMenuOpen(open, restoreFocus = false) {
  if (!menuButton || !navbar) return;
  navbar.classList.toggle("active", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  const icon = menuButton.querySelector("i");
  if (icon) {
    icon.classList.toggle("bx-menu", !open);
    icon.classList.toggle("bx-x", open);
  }
  if (restoreFocus) menuButton.focus();
}
if (menuButton && navbar) {
  menuButton.addEventListener("click", () => setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true"));
  navbar.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenuOpen(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") setMenuOpen(false, true);
  });
  document.addEventListener("click", event => {
    if (!navbar.contains(event.target) && !menuButton.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener("focusin", event => {
    if (menuButton.getAttribute("aria-expanded") === "true" &&
        !navbar.contains(event.target) && !menuButton.contains(event.target)) setMenuOpen(false);
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 896) setMenuOpen(false); });
}
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

if (form && status) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const topic = String(data.get("topic") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !message) {
      status.textContent = "Lütfen adınızı ve mesajınızı yazın.";
      return;
    }
    const lines = ["Merhaba, ben " + name + ".", topic ? "Konu: " + topic : "", message,
      email ? "E-posta: " + email : ""].filter(Boolean);
    const link = document.createElement("a");
    link.href = "https://wa.me/905467710162?text=" + encodeURIComponent(lines.join("\n\n"));
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    status.textContent = "WhatsApp'ta mesaj taslağı açılıyor. Mesaj ancak siz gönderirseniz iletilir.";
    link.click();
  });
}
