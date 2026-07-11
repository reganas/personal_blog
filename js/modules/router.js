import { state } from "./state.js";
import {
  renderHome,
  renderCV,
  renderContact,
  renderPostDetail,
} from "./renderer.js";

export function handleRoute() {
  const hash = window.location.hash || "#/";

  const readingProgress = document.getElementById("reading-progress");
  if (readingProgress) readingProgress.style.width = "0%";

  const navArticles = document.getElementById("nav-link-articles");
  const navCv = document.getElementById("nav-link-cv");
  const navContact = document.getElementById("nav-link-contact");

  if (navArticles && navCv && navContact) {
    navArticles.classList.toggle(
      "active",
      hash !== "#/cv" && hash !== "#/contact",
    );
    navCv.classList.toggle("active", hash === "#/cv");
    navContact.classList.toggle("active", hash === "#/contact");
  }

  if (hash.startsWith("#/post/")) {
    const postId = hash.replace("#/post/", "");
    state.currentPostId = postId;
    renderPostDetail(postId);
  } else if (hash === "#/cv") {
    state.currentPostId = null;
    renderCV();
  } else if (hash === "#/contact") {
    state.currentPostId = null;
    renderContact();
  } else {
    state.currentPostId = null;
    renderHome();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}
