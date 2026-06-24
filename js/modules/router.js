import { state } from "./state.js";
import { renderHome, renderCV, renderPostDetail } from "./renderer.js";

export function handleRoute() {
  const hash = window.location.hash || "#/";

  const readingProgress = document.getElementById("reading-progress");
  if (readingProgress) readingProgress.style.width = "0%";

  const navArticles = document.getElementById("nav-link-articles");
  const navCv = document.getElementById("nav-link-cv");
  if (navArticles && navCv) {
    if (hash === "#/cv") {
      navArticles.classList.remove("active");
      navCv.classList.add("active");
    } else {
      navArticles.classList.add("active");
      navCv.classList.remove("active");
    }
  }

  if (hash.startsWith("#/post/")) {
    const postId = hash.replace("#/post/", "");
    state.currentPostId = postId;
    renderPostDetail(postId);
  } else if (hash === "#/cv") {
    state.currentPostId = null;
    renderCV();
  } else {
    state.currentPostId = null;
    renderHome();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}
