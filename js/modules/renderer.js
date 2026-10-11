import blogPosts from "../data/posts.js";
import { state } from "./state.js";

function getViewport() {
  return document.getElementById("app-viewport");
}

export function animateTransition(renderFunc) {
  const viewport = getViewport();
  if (!viewport) return;
  viewport.classList.add("fade-out");
  setTimeout(() => {
    renderFunc();
    viewport.classList.remove("fade-out");
  }, 200);
}

export function updateReadingProgress() {
  if (!state.currentPostId) {
    const readingProgress = document.getElementById("reading-progress");
    if (readingProgress) readingProgress.style.width = "0%";
    return;
  }

  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const readingProgress = document.getElementById("reading-progress");
  if (!readingProgress || totalHeight <= 0) {
    if (readingProgress) readingProgress.style.width = "0%";
    return;
  }

  const progress = (window.pageYOffset / totalHeight) * 100;
  readingProgress.style.width = `${progress}%`;
}

export function renderHome() {
  animateTransition(() => {
    const viewport = getViewport();
    if (!viewport) return;

    const allTags = new Set();
    blogPosts.forEach((post) => post.tags.forEach((tag) => allTags.add(tag)));
    const tagsArray = ["All", ...Array.from(allTags)];

    const filteredPosts = blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(state.searchQuery.toLowerCase());
      const matchesTag =
        state.activeTag === "All" || post.tags.includes(state.activeTag);
      return matchesSearch && matchesTag;
    });

    viewport.innerHTML = `
      <section class="container">
        <!-- Hero Section -->
        <div class="hero">
          <div class="hero-content">
            <span class="hero-badge">Welcome to my space</span>
            <h1 class="hero-title">Hey, I'm <span>Justinas Steikunas</span>.</h1>
            <p class="hero-description">
              I teach English to adults — in person in Vilnius, online across Lithuania — and I write graded readers: real short stories for people learning the language, pitched at the level they're actually at. Three books so far. I built this site myself.
            </p>
          </div>
          <div class="hero-avatar-container">
            <img class="hero-avatar" src="./assets/personal_photo.jpg" alt="Justinas Steikunas Professional Portrait">
          </div>
        </div>

        <!-- Filters & Search -->
        <div class="controls-section">
          <div class="search-bar-wrapper">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="search-input" class="search-input" placeholder="Search articles..." value="${state.searchQuery}">
          </div>

          <div class="tags-container" role="tablist" aria-label="Filter blog posts by tag">
            ${tagsArray
              .map(
                (tag) => `
              <button class="tag-btn ${state.activeTag === tag ? "active" : ""}" data-tag="${tag}" role="tab" aria-selected="${state.activeTag === tag}">
                ${tag}
              </button>
            `,
              )
              .join("")}
          </div>
        </div>

        <!-- Post Grid -->
        <div class="posts-grid" id="posts-list">
          ${
            filteredPosts.length > 0
              ? filteredPosts
                  .map(
                    (post) => `
            <a href="#/post/${post.id}" class="post-card" aria-label="Read full article: ${post.title}">
              <div class="post-card-banner-wrapper">
                <img class="post-card-banner" src="${post.banner}" alt="Illustration representing ${post.title}" loading="lazy">
              </div>
              <div class="post-card-content">
                <div class="post-card-meta">
                  <time datetime="${post.date}">${post.date}</time>
                  <span>${post.readTime}</span>
                </div>
                <h2 class="post-card-title">${post.title}</h2>
                <p class="post-card-summary">${post.summary}</p>
                <div class="post-card-footer">
                  ${post.tags.map((tag) => `<span class="post-card-tag">${tag}</span>`).join("")}
                </div>
              </div>
            </a>
          `,
                  )
                  .join("") +
                `<div class="post-card post-card--coming-soon" aria-hidden="true"><div class="coming-soon-inner"><span class="coming-soon-icon">✍️</span><h2 class="post-card-title">More articles coming soon</h2><p class="post-card-summary">New posts on education, tech & teaching are on the way. Stay tuned!</p></div></div>`
              : `
            <div class="no-posts-message">
              <h3>No articles found</h3>
              <p>Try adjusting your search criteria or tags.</p>
            </div>
          `
          }
        </div>
      </section>
    `;

    attachHomeEventListeners();
  });
}

export function attachHomeEventListeners() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      updatePostsGrid();
    });
  }

  const tagBtns = document.querySelectorAll(".tag-btn");
  tagBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tagBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      state.activeTag = btn.getAttribute("data-tag");
      updatePostsGrid();
    });
  });
}

export function updatePostsGrid() {
  const postsGrid = document.getElementById("posts-list");
  if (!postsGrid) return;

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesTag =
      state.activeTag === "All" || post.tags.includes(state.activeTag);
    return matchesSearch && matchesTag;
  });

  postsGrid.style.opacity = "0.3";
  setTimeout(() => {
    postsGrid.innerHTML =
      filteredPosts.length > 0
        ? filteredPosts
            .map(
              (post) => `
      <a href="#/post/${post.id}" class="post-card" aria-label="Read full article: ${post.title}">
        <div class="post-card-banner-wrapper">
          <img class="post-card-banner" src="${post.banner}" alt="Illustration representing ${post.title}" loading="lazy">
        </div>
        <div class="post-card-content">
          <div class="post-card-meta">
            <time datetime="${post.date}">${post.date}</time>
            <span>${post.readTime}</span>
          </div>
          <h2 class="post-card-title">${post.title}</h2>
          <p class="post-card-summary">${post.summary}</p>
          <div class="post-card-footer">
            ${post.tags.map((tag) => `<span class="post-card-tag">${tag}</span>`).join("")}
          </div>
        </div>
      </a>
    `,
            )
            .join("") +
          `<div class="post-card post-card--coming-soon" aria-hidden="true"><div class="coming-soon-inner"><span class="coming-soon-icon">✍️</span><h2 class="post-card-title">More articles coming soon</h2><p class="post-card-summary">New posts on education, tech & teaching are on the way. Stay tuned!</p></div></div>`
        : `
      <div class="no-posts-message">
        <h3>No articles found</h3>
        <p>Try adjusting your search criteria or tags.</p>
      </div>
    `;
    postsGrid.style.opacity = "1";
  }, 150);
}

export function renderPostDetail(postId) {
  animateTransition(() => {
    const viewport = getViewport();
    if (!viewport) return;

    const post = blogPosts.find((p) => p.id === postId);
    if (!post) {
      viewport.innerHTML = `
        <section class="container post-detail-section text-center">
          <button class="back-btn" onclick="window.location.hash = '#/'" aria-label="Go back to homepage">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Articles
          </button>
          <h2>Post Not Found</h2>
          <p>The post you are looking for does not exist or has been moved.</p>
        </section>
      `;
      return;
    }

    viewport.innerHTML = `
      <article class="container post-detail-section">
        <button class="back-btn" id="post-detail-back-btn" aria-label="Go back to homepage">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Articles
        </button>

        <img class="post-detail-banner" src="${post.banner}" alt="Banner illustration for ${post.title}">

        <div class="post-detail-meta">
          <time datetime="${post.date}">${post.date}</time>
          <span>•</span>
          <span>${post.readTime}</span>
        </div>

        <h1 class="post-detail-title">${post.title}</h1>

        <div class="post-detail-tags">
          ${post.tags.map((tag) => `<span class="post-card-tag">${tag}</span>`).join("")}
        </div>

        <div class="post-detail-body">
          ${post.content}
        </div>

        <button class="back-btn" id="post-detail-back-btn-bottom" aria-label="Go back to homepage" style="margin-top: 3rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Articles
        </button>
      </article>
    `;

    const backBtn = document.getElementById("post-detail-back-btn");
    if (backBtn)
      backBtn.addEventListener("click", () => {
        window.location.hash = "#/";
      });
    const backBtnBottom = document.getElementById(
      "post-detail-back-btn-bottom",
    );
    if (backBtnBottom)
      backBtnBottom.addEventListener("click", () => {
        window.location.hash = "#/";
      });
  });
}

export function renderCV() {
  animateTransition(() => {
    const viewport = getViewport();
    if (!viewport) return;

    viewport.innerHTML = `
      <section class="container cv-section">
        <div class="cv-header">
          <div class="cv-header-text">
            <h1 class="cv-title">My <span>Resume</span></h1>
            <p style="color: var(--text-secondary); margin-top: 0.5rem;">English Teacher · Author · Web Developer</p>
          </div>
        </div>

        <div class="cv-grid">
          <!-- Left Column (Sidebar) -->
          <div class="cv-sidebar">
            <div class="cv-photo-container">
              <img class="cv-photo" src="./assets/personal_photo.jpg" alt="Justinas Steikunas Profile Headshot">
            </div>       

            <!-- Skills -->
            <div class="cv-card">
              <h2 class="cv-card-title">Professional Skills</h2>
              
              <div class="cv-skill-group">
                <div class="cv-skill-label">Technical</div>
                <div class="cv-skills-list">
                  <span class="cv-skill-badge">Web Development</span>
                  <span class="cv-skill-badge">React Basics</span>
                  <span class="cv-skill-badge">Unit Testing</span>
                  <span class="cv-skill-badge">Debugging</span>
                  <span class="cv-skill-badge">Logical Problem Solving</span>
                </div>
              </div>

              <div class="cv-skill-group">
                <div class="cv-skill-label">Languages</div>
                <div class="cv-skills-list">
                  <span class="cv-skill-badge">Lithuanian (Native)</span>
                  <span class="cv-skill-badge">English (Full Professional)</span>
                  <span class="cv-skill-badge">Russian (Limited)</span>
                  <span class="cv-skill-badge">Italian (Elementary)</span>
                </div>
              </div>

              <div class="cv-skill-group">
                <div class="cv-skill-label">Core Values</div>
                <div class="cv-skills-list">
                  <span class="cv-skill-badge">Intrinsic Motivation</span>
                  <span class="cv-skill-badge">Critical Thinking</span>
                  <span class="cv-skill-badge">Warm Relationships</span>
                  <span class="cv-skill-badge">Creative Lesson Planning</span>
                </div>
              </div>
            </div>

            <!-- Certifications -->
            <div class="cv-card">
              <h2 class="cv-card-title">Certifications</h2>
              <ul class="cv-contact-list" style="gap: 1rem;">
                <li style="font-size: 0.9rem;">
                  <strong style="color: var(--text-primary)">React Basics</strong><br>
                  <span style="color: var(--text-secondary)">Web Development Certification (2024)</span>
                </li>
                <li style="font-size: 0.9rem;">
                  <strong style="color: var(--text-primary)">CELTA</strong><br>
                  <span style="color: var(--text-secondary)">University of Cambridge ESOL / International House (2018)</span>
                </li>
                <li style="font-size: 0.9rem;">
                  <strong style="color: var(--text-primary)">120-hour TEFL Diploma</strong><br>
                  <span style="color: var(--text-secondary)">Bridge TEFL (2016)</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Right Column (Main Details) -->
          <div class="cv-main">
            <!-- Profile Summary -->
            <div class="cv-card">
              <h2 class="cv-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Professional Summary
              </h2>
              <p style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7;">
                An English teacher with ten years' experience across Lithuania, Vietnam and Mexico, now teaching adults at levels A1 to B2 at language schools in Vilnius, including business English.
              </p>
              <p style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; margin-top: 1rem;">
                Working with learners at every stage — kindergarten children in Vietnam, university students and corporate managers in Mexico, working professionals in Vilnius — has shaped a teaching approach built on intrinsic motivation and real-world skills rather than memorisation, and on the relationship with the student that makes the rest possible.
              </p>
              <p style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; margin-top: 1rem;">
                That classroom experience has recently become published work: two collections of graded readers for English learners, written to a course syllabus and published independently in 2026, which grew out of a gap met every year — students ready to read something real in English, with nothing at their level worth finishing. Alongside teaching, he studies web development and built the publishing toolchain behind the books.
              </p>
            </div>

            <!-- Published Work -->
            <div class="cv-card">
              <h2 class="cv-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Published Work
              </h2>
              <ul class="cv-edu-list">
                <li class="cv-edu-item">
                  <div class="cv-edu-header">
                    <h3 class="cv-edu-degree">The Woman in the Red Coat <span>— Independently published, 2026</span></h3>
                  </div>
                  <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">Twelve original short stories at CEFR A2–B1, each written to a unit of a standard Elementary to Pre-intermediate syllabus. Kindle and digital editions.</p>
                </li>
                <li class="cv-edu-item">
                  <div class="cv-edu-header">
                    <h3 class="cv-edu-degree">The Last Dinner at Marco's <span>— Independently published, 2026</span></h3>
                  </div>
                  <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">Ten original short stories at CEFR B1, written to an Intermediate syllabus. Kindle and digital editions.</p>
                </li>
                <li class="cv-edu-item">
                  <div class="cv-edu-header">
                    <h3 class="cv-edu-degree">The Woman in the Red Coat and Other Stories <span>— Independently published, 2026</span></h3>
                  </div>
                  <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">Both collections in a single 188-page paperback: twenty-two stories with a combined glossary of 311 words. Every story carries its own vocabulary list, comprehension questions, summary, and speaking and writing tasks, with a full answer key — written for self-study and classroom use.</p>
                  <a href="https://payhip.com/JustinasSteikunas" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 0.75rem; font-size: 0.875rem; font-weight: 600; color: var(--accent-primary); text-decoration: none;">Browse all editions →</a>
                </li>
              </ul>
            </div>

            <!-- Professional Experience -->
            <div class="cv-card">
              <h2 class="cv-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                Experience History
              </h2>

              <div class="cv-timeline">
                <!-- Job 1 -->
                <div class="cv-timeline-item">
                  <div class="cv-timeline-dot"></div>
                  <div class="cv-timeline-header">
                    <h3 class="cv-job-title">English Teacher <span>@ INTELLECTUS mokykla</span></h3>
                    <span class="cv-job-date">Sep 2022 – Present</span>
                  </div>
                  <ul class="cv-job-details">
                    <li>Taught English to a diverse range of students, from children to adults, across various language proficiency levels.</li>
                    <li>Created tailored lesson plans for group and individual classes, adapting methods to accommodate different learning preferences and ensure accessibility.</li>
                  </ul>
                </div>

                <!-- Job 2 -->
                <div class="cv-timeline-item">
                  <div class="cv-timeline-dot"></div>
                  <div class="cv-timeline-header">
                    <h3 class="cv-job-title">English Teacher <span>@ KALBA</span></h3>
                    <span class="cv-job-date">Sep 2022 – Present</span>
                  </div>
                  <ul class="cv-job-details">
                    <li>Planned and delivered engaging English classes focusing on core linguistic skills from levels A1 to B2.</li>
                    <li>Fostered a supportive, modern learning environment to enhance speech acquisition and interactive communication.</li>
                  </ul>
                </div>

                <!-- Job 3 -->
                <div class="cv-timeline-item">
                  <div class="cv-timeline-dot"></div>
                  <div class="cv-timeline-header">
                    <h3 class="cv-job-title">English Teacher <span>@ Karalienės Mortos mokykla</span></h3>
                    <span class="cv-job-date">Aug 2021 – Jun 2022</span>
                  </div>
                  <ul class="cv-job-details">
                    <li>Taught curriculum-aligned English to children in grades 0 and 1 (5 to 7 years old).</li>
                    <li>Planned curriculum and teaching objectives for the academic year while actively participating in school events and community projects.</li>
                  </ul>
                </div>

                <!-- Job 4 -->
                <div class="cv-timeline-item">
                  <div class="cv-timeline-dot"></div>
                  <div class="cv-timeline-header">
                    <h3 class="cv-job-title">ESL Teacher <span>@ Apollo Education and Training</span></h3>
                    <span class="cv-job-date">May 2018 – May 2021</span>
                  </div>
                  <ul class="cv-job-details">
                    <li>Delivered engaging, student-centered English classes to kindergarten and primary school learners in Vietnam.</li>
                    <li>Built warm, authentic relationships with young learners to develop intrinsic motivation and foster a brave, creative classroom environment.</li>
                    <li>Participated in continuous professional development workshops and supported newly employed teachers with teaching syllabi.</li>
                  </ul>
                </div>

                <!-- Job 5 -->
                <div class="cv-timeline-item">
                  <div class="cv-timeline-dot"></div>
                  <div class="cv-timeline-header">
                    <h3 class="cv-job-title">Professor of English <span>@ Grupo Educativo SIGLO XXI</span></h3>
                    <span class="cv-job-date">Aug 2016 – Feb 2017</span>
                  </div>
                  <ul class="cv-job-details">
                    <li>Handled lesson and curriculum planning for university students (levels A1-B2) and corporate managers in Mexico.</li>
                    <li>Conducted daily student assessments according to progress and performance.</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Education -->
            <div class="cv-card">
              <h2 class="cv-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
                Education History
              </h2>

              <ul class="cv-edu-list">
                <li class="cv-edu-item">
                  <div class="cv-edu-header">
                    <h3 class="cv-edu-degree">Web Development Studies <span>– Turing College</span></h3>
                    <span class="cv-job-date">2025</span>
                  </div>
                  <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">Focus on React, modern frontend practices, unit testing, and algorithms.</p>
                </li>
                <li class="cv-edu-item">
                  <div class="cv-edu-header">
                    <h3 class="cv-edu-degree">Master's in International Business <span>– Vilniaus Universitetas</span></h3>
                    <span class="cv-job-date">2014 – 2016</span>
                  </div>
                  <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">Advanced studies in global strategy, business development, and market expansions.</p>
                </li>
                <li class="cv-edu-item">
                  <div class="cv-edu-header">
                    <h3 class="cv-edu-degree">Master's in International Business & Dev <span>– Università degli Studi di Parma</span></h3>
                    <span class="cv-job-date">2016</span>
                  </div>
                  <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">Academic exchange studies in Parma, Italy focusing on international development economics.</p>
                </li>
                <li class="cv-edu-item">
                  <div class="cv-edu-header">
                    <h3 class="cv-edu-degree">Bachelor's in Marketing & Global Business <span>– Vilniaus Universitetas</span></h3>
                    <span class="cv-job-date">2010 – 2014</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  });
}

export function renderContact() {
  animateTransition(() => {
    const viewport = getViewport();
    if (!viewport) return;

    viewport.innerHTML = `
      <section class="container contact-page">
        <div class="contact-hero">
          <p class="hero-badge">Contact</p>
          <h1 class="hero-title">Let’s talk</h1>
          <p class="contact-copy">
            If you’d like to connect about education, web development, or a collaboration, send a note here and I’ll get back to you.
          </p>
        </div>

        <div class="contact-card">
          <form id="contact-form" class="contact-form" action="https://formspree.io/f/xeeyjqnn" method="POST">
            <!-- Honeypot field to prevent spam bots -->
            <div style="display: none;" aria-hidden="true">
              <input type="text" id="contact-bot-field" name="bot-field" tabindex="-1" autocomplete="off">
            </div>

            <div class="contact-field">
              <label for="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" required placeholder="Your name">
            </div>

            <div class="contact-field">
              <label for="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" required placeholder="your@email.com">
            </div>

            <div class="contact-field">
              <label for="contact-subject">Subject</label>
              <input id="contact-subject" name="subject" type="text" required placeholder="What would you like to discuss?">
            </div>

            <div class="contact-field">
              <label for="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="6" required minlength="10" maxlength="5000" placeholder="Write your message here..."></textarea>
            </div>

            <button type="submit" class="contact-form-submit">Send Message</button>
            <p class="contact-form-disclaimer">
              Your information is only used to reply to your inquiry. / Jūsų informacija naudojama tik atsakyti į jūsų užklausą. Read my <a href="#/privacy">Privacy Policy / Privatumo Politiką</a>.
            </p>
            <p id="contact-form-status" class="contact-form-status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </section>
    `;

    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("contact-form-status");

    if (contactForm && formStatus) {
      const FORM_ENDPOINT = "https://formspree.io/f/xeeyjqnn";

      contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);

        // Honeypot validation check
        const botField = formData.get("bot-field");
        if (botField) {
          formStatus.textContent = "Thanks! Your message has been sent.";
          formStatus.classList.add("is-success");
          contactForm.reset();
          return;
        }

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const subject = String(formData.get("subject") || "").trim();
        const message = String(formData.get("message") || "").trim();

        formStatus.textContent = "Sending...";
        formStatus.classList.remove("is-success");

        try {
          const response = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData,
          });

          if (response.ok) {
            formStatus.textContent = "Thanks! Your message has been sent.";
            formStatus.classList.add("is-success");
            contactForm.reset();
          } else {
            throw new Error("Submission failed");
          }
        } catch (error) {
          formStatus.textContent = "Something went wrong. Please try again.";
        }
      });
    }
  });
}

const englishContent = `
  <p>Welcome to my personal blog. Your privacy is important to me, and I am committed to protecting your personal data. This policy explains what information I collect when you visit my website and use my contact form, and how I handle it.</p>

  <h2>1. Information I Collect</h2>
  <p>When you use the contact form on this website, I collect the following personal information that you voluntarily provide:</p>
  <ul>
    <li>Your Name</li>
    <li>Your Email Address</li>
    <li>The content of your message</li>
  </ul>

  <h2>2. How I Use Your Information</h2>
  <p>The information you provide through the contact form is used for one purpose only: <strong>to read and respond to your inquiry</strong>. I do not use your email address for marketing purposes, I do not have a newsletter, and I will never sell or share your personal information with third parties for their own commercial use.</p>

  <h2>3. Third-Party Services</h2>
  <p>To keep this website running securely, I use a few trusted third-party services that act as "Data Processors":</p>
  <ul>
    <li><strong>Formspace:</strong> I use Formspace to securely process and route the messages you send via the contact form to my personal email inbox. You can review their privacy practices on their website.</li>
    <li><strong>Vercel:</strong> This website is hosted on Vercel, which may collect basic, anonymized server logs (like browser type and timestamp) necessary for the security and operation of the site.</li>
  </ul>

  <h2>4. Data Retention</h2>
  <p>I only keep your contact form submissions for as long as necessary to resolve your inquiry. Periodically (every 3-6 months), I review and permanently delete old messages and their associated personal data.</p>

  <h2>5. Your Rights</h2>
  <p>Under the General Data Protection Regulation (GDPR), you have the right to:</p>
  <ul>
    <li>Ask what personal data I hold about you.</li>
    <li>Request that I correct any inaccurate data.</li>
    <li>Request that I permanently delete your messages and contact details.</li>
  </ul>
  <p>If you would like to exercise any of these rights, please reach out to me using the contact form on this website.</p>
`;

const lithuanianContent = `
  <p>Sveiki atvykę į mano asmeninį tinklaraštį. Jūsų privatumas man yra svarbus, todėl esu įsipareigojęs saugoti jūsų asmens duomenis. Šioje politikoje paaiškinama, kokią informaciją renku, kai lankotės mano svetainėje ir naudojatės kontaktine forma, bei kaip su ja elgiuosi.</p>

  <h2>1. Renkama informacija</h2>
  <p>Kai naudojatės šios svetainės kontaktine forma, renku šią jūsų savanoriškai pateikiamą asmeninę informaciją:</p>
  <ul>
    <li>Jūsų vardą</li>
    <li>Jūsų el. pašto adresą</li>
    <li>Jūsų žinutės turinį</li>
  </ul>

  <h2>2. Kaip naudoju jūsų informaciją</h2>
  <p>Informacija, kurią pateikiate per kontaktinę formą, naudojama tik vienam tikslui: <strong>perskaityti jūsų užklausą ir į ją atsakyti</strong>. Nenaudoju jūsų el. pašto adreso rinkodaros tikslais, neturiu naujienlaiškio ir niekada neparduosiu ar neperduosiu jūsų asmeninės informacijos trečiosioms šalims jų komerciniams tikslams.</p>

  <h2>3. Trečiųjų šalių paslaugos</h2>
  <p>Siekdamas užtikrinti saugų šios svetainės veikimą, naudoju kelias patikimas trečiųjų šalių paslaugas, kurios veikia kaip „Duomenų tvarkytojai“:</p>
  <ul>
    <li><strong>Formspace:</strong> Naudoju „Formspace“, kad saugiai apdoročiau ir nukreipčiau jūsų žinutes iš kontaktinės formos į savo asmeninę el. pašto dėžutę. Su jų privatumo praktika galite susipažinti jų svetainėje.</li>
    <li><strong>Vercel:</strong> Ši svetainė talpinama „Vercel“ platformoje, kuri gali rinkti pagrindinius, anonimizuotus serverio žurnalus (pvz., naršyklės tipą ir laiko žymas), būtinus svetainės saugumui ir veikimui užtikrinti.</li>
  </ul>

  <h2>4. Duomenų saugojimas</h2>
  <p>Jūsų kontaktinės formos pateiktus duomenis saugau tik tol, kol to reikia jūsų užklausai išspręsti. Periodiškai (kas 3–6 mėnesius) peržiūriu ir visam laikui ištrinu senas žinutes bei su jomis susijusius asmens duomenis.</p>

  <h2>5. Jūsų teisės</h2>
  <p>Pagal Bendrąjį duomenų apsaugos reglamentą (BDAR), jūs turite teisę:</p>
  <ul>
    <li>Sužinoti, kokius jūsų asmens duomenis turiu.</li>
    <li>Prašyti ištaisyti netikslius duomenis.</li>
    <li>Prašyti visam laikui ištrinti jūsų žinutes ir kontaktinius duomenis.</li>
  </ul>
  <p>Jei norite pasinaudoti kuria nors iš šių teisių, susisiekite su manimi naudodami šioje svetainėje esančią kontaktinę formą.</p>
`;

let currentPrivacyLang = "en";

export function renderPrivacy() {
  animateTransition(() => {
    const viewport = getViewport();
    if (!viewport) return;

    viewport.innerHTML = `
      <section class="container post-detail-section">
        <button class="back-btn" id="privacy-back-btn" aria-label="Go back to homepage">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Articles
        </button>

        <div class="privacy-header-row" style="display: flex; justify-content: space-between; align-items: flex-end; gap: 1.5rem; margin-bottom: 2.5rem; flex-wrap: wrap;">
          <div>
            <h1 class="post-detail-title" id="privacy-title" style="margin-bottom: 0.5rem;">Privacy Policy</h1>
            <div class="post-detail-meta" style="margin-bottom: 0;">
              <span id="privacy-last-updated">Last Updated: July 11, 2026</span>
            </div>
          </div>
          <div class="lang-toggle-wrapper">
            <button id="lang-btn-en" class="lang-btn ${currentPrivacyLang === "en" ? "active" : ""}" aria-label="Switch to English">EN</button>
            <button id="lang-btn-lt" class="lang-btn ${currentPrivacyLang === "lt" ? "active" : ""}" aria-label="Switch to Lithuanian">LT</button>
          </div>
        </div>

        <div id="privacy-body" class="post-detail-body">
          <!-- Dynamically loaded content -->
        </div>
      </section>
    `;

    const privacyTitle = document.getElementById("privacy-title");
    const privacyLastUpdated = document.getElementById("privacy-last-updated");
    const privacyBody = document.getElementById("privacy-body");
    const btnEn = document.getElementById("lang-btn-en");
    const btnLt = document.getElementById("lang-btn-lt");

    function updatePrivacyContent(lang) {
      currentPrivacyLang = lang;
      if (lang === "en") {
        privacyTitle.textContent = "Privacy Policy";
        privacyLastUpdated.textContent = "Last Updated: July 11, 2026";
        privacyBody.innerHTML = englishContent;
        if (btnEn) btnEn.classList.add("active");
        if (btnLt) btnLt.classList.remove("active");
      } else {
        privacyTitle.textContent = "Privatumo Politika";
        privacyLastUpdated.textContent = "Paskutinį kartą atnaujinta: 2026 m. liepos 11 d.";
        privacyBody.innerHTML = lithuanianContent;
        if (btnEn) btnEn.classList.remove("active");
        if (btnLt) btnLt.classList.add("active");
      }
    }

    // Initialize content
    updatePrivacyContent(currentPrivacyLang);

    if (btnEn) {
      btnEn.addEventListener("click", () => updatePrivacyContent("en"));
    }
    if (btnLt) {
      btnLt.addEventListener("click", () => updatePrivacyContent("lt"));
    }

    const backBtn = document.getElementById("privacy-back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.hash = "#/";
      });
    }
  });
}
