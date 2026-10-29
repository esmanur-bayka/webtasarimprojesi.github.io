"use strict";
const menuButton = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

function setMenuOpen(isOpen, restoreFocus = false) {
  if (!menuButton || !navbar) return;
  navbar.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Menüyü kapat" : "Menüyü aç");
  if (restoreFocus) menuButton.focus();
}

if (menuButton && navbar) {
  menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });
  navbar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false, true);
    }
  });
  document.addEventListener("click", event => {
    if (!navbar.contains(event.target) && !menuButton.contains(event.target)) setMenuOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 840) setMenuOpen(false);
  });
}

document.getElementById("year").textContent = String(new Date().getFullYear());

if (form && status) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const name = String(fields.get("name") || "").trim();
    const email = String(fields.get("email") || "").trim();
    const topic = String(fields.get("topic") || "").trim();
    const message = String(fields.get("message") || "").trim();
    if (!name || !message) {
      status.textContent = "Lütfen adınızı ve mesajınızı yazın.";
      return;
    }
    const lines = ["Merhaba, ben " + name + ".", topic ? "Konu: " + topic : "", message, email ? "E-posta: " + email : ""].filter(Boolean);
    const url = "https://wa.me/905467710162?text=" + encodeURIComponent(lines.join("\n\n"));
    status.textContent = "WhatsApp'ta mesaj taslağı açılıyor. Mesaj ancak siz gönderirseniz iletilir.";
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  });
}
