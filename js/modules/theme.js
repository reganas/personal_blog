import { state } from "./state.js";

const moonIcon = document.getElementById("theme-icon-moon");
const sunIcon = document.getElementById("theme-icon-sun");

export function initTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  updateThemeIcons();
}

export function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  localStorage.setItem("theme", state.theme);
  updateThemeIcons();
}

export function updateThemeIcons() {
  if (!moonIcon || !sunIcon) return;
  if (state.theme === "dark") {
    moonIcon.style.display = "block";
    sunIcon.style.display = "none";
  } else {
    moonIcon.style.display = "none";
    sunIcon.style.display = "block";
  }
}
