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
