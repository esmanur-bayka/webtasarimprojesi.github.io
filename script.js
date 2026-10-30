// Menü ikonu ve navbar elementlerini seçelim
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

// Menü butonuna tıklandığında menüyü aç/kapat
menuIcon.addEventListener("click", () => {
  navbar.classList.toggle("active");   // menü görünür/gizli olur
  menuIcon.classList.toggle("bx-x");   // ikon değişir (☰ ↔ ✖)
});

// Sayfada herhangi bir yere (linke) tıklanırsa menü otomatik kapanır
window.addEventListener("scroll", () => {
  navbar.classList.remove("active");
  menuIcon.classList.remove("bx-x");
});

// Menüdeki bağlantılara tıklayınca da menü kapanır
document.querySelectorAll(".navbar a").forEach(link => {
  link.addEventListener("click", () => {
    navbar.classList.remove("active");
    menuIcon.classList.remove("bx-x");
  });
});
