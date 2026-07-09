import { initTheme, toggleTheme } from "./modules/theme.js";
import { handleRoute } from "./modules/router.js";
import { updateReadingProgress } from "./modules/renderer.js";

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", () => {
  initTheme();
  handleRoute();
});
window.addEventListener("scroll", updateReadingProgress);
const themeToggleBtn = document.getElementById("theme-toggle");
if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);

const hamburgerBtn = document.getElementById("hamburger-btn");
const navLinks = document.getElementById("nav-links");
if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburgerBtn.classList.toggle("open", isOpen);
    hamburgerBtn.setAttribute("aria-expanded", isOpen);
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburgerBtn.classList.remove("open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    });
  });
}
