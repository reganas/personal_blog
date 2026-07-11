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
              An English Teacher passionate about educational innovation, integrating technology in education, and expanding my problem-solving capabilities through Web Development studies.
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
            <p style="color: var(--text-secondary); margin-top: 0.5rem;">Educator & Aspiring Web Developer</p>
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
                As a dedicated English Teacher with over 8 years of experience, I am deeply passionate about working with young learners and inspiring a lifelong love of learning. Throughout my career, particularly during my years dedicated to primary and kindergarten education in Vietnam, I have learned the vital importance of building warm, authentic relationships with students. My teaching philosophy prioritizes developing intrinsic motivation and essential life skills over simple memorization. Fostering a creative, brave, and student-centered classroom environment helps students prepare dynamically for their futures.
              </p>
              <p style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; margin-top: 1rem;">
                I am continuously expanding my horizons—most recently by developing technical problem-solving and logic skills through Web Development. I thrive in collaborative, dynamic communities where I can contribute to positive educational shifts in Lithuania.
              </p>
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
              <textarea id="contact-message" name="message" rows="6" required placeholder="Write your message here..."></textarea>
            </div>

            <button type="submit" class="contact-form-submit">Send Message</button>
            <p class="contact-form-disclaimer">
              Your information is only used to reply to your inquiry. Read my full <a href="#/privacy">Privacy Policy</a>.
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

        <h1 class="post-detail-title">Privacy Policy</h1>

        <div class="post-detail-meta" style="margin-bottom: 2rem;">
          <time datetime="2026-07-11">July 11, 2026</time>
        </div>

        <div class="post-detail-body">
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
        </div>
      </section>
    `;

    const backBtn = document.getElementById("privacy-back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.hash = "#/";
      });
    }
  });
}
