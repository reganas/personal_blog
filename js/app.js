import blogPosts from './posts.js';

// Application State
const state = {
  theme: localStorage.getItem('theme') || 'dark',
  activeTag: 'All',
  searchQuery: '',
  currentPostId: null
};

// DOM Elements
const viewport = document.getElementById('app-viewport');
const themeToggleBtn = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('theme-icon-moon');
const sunIcon = document.getElementById('theme-icon-sun');
const readingProgress = document.getElementById('reading-progress');

// Initialize Theme
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcons();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('theme', state.theme);
  updateThemeIcons();
}

function updateThemeIcons() {
  if (state.theme === 'dark') {
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
  } else {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  }
}

// Router
function handleRoute() {
  const hash = window.location.hash || '#/';
  
  // Reset reading progress bar
  readingProgress.style.width = '0%';

  // Update nav active classes
  const navArticles = document.getElementById('nav-link-articles');
  const navCv = document.getElementById('nav-link-cv');
  if (navArticles && navCv) {
    if (hash === '#/cv') {
      navArticles.classList.remove('active');
      navCv.classList.add('active');
    } else {
      navArticles.classList.add('active');
      navCv.classList.remove('active');
    }
  }
  
  if (hash.startsWith('#/post/')) {
    const postId = hash.replace('#/post/', '');
    state.currentPostId = postId;
    renderPostDetail(postId);
  } else if (hash === '#/cv') {
    state.currentPostId = null;
    renderCV();
  } else {
    state.currentPostId = null;
    renderHome();
  }
  
  // Scroll to top on navigation
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Page Transition Helper
function animateTransition(renderFunc) {
  viewport.classList.add('fade-out');
  setTimeout(() => {
    renderFunc();
    viewport.classList.remove('fade-out');
  }, 200);
}

// Reading Progress Calculator
function updateReadingProgress() {
  if (!state.currentPostId) {
    readingProgress.style.width = '0%';
    return;
  }
  
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (totalHeight <= 0) {
    readingProgress.style.width = '0%';
    return;
  }
  
  const progress = (window.pageYOffset / totalHeight) * 100;
  readingProgress.style.width = `${progress}%`;
}

// View Renderer: Home
function renderHome() {
  animateTransition(() => {
    // Collect all unique tags dynamically
    const allTags = new Set();
    blogPosts.forEach(post => post.tags.forEach(tag => allTags.add(tag)));
    const tagsArray = ['All', ...Array.from(allTags)];

    // Filter posts
    const filteredPosts = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                            post.summary.toLowerCase().includes(state.searchQuery.toLowerCase());
      const matchesTag = state.activeTag === 'All' || post.tags.includes(state.activeTag);
      return matchesSearch && matchesTag;
    });

    // Main layout
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
            ${tagsArray.map(tag => `
              <button class="tag-btn ${state.activeTag === tag ? 'active' : ''}" data-tag="${tag}" role="tab" aria-selected="${state.activeTag === tag}">
                ${tag}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Post Grid -->
        <div class="posts-grid" id="posts-list">
          ${filteredPosts.length > 0 ? filteredPosts.map(post => `
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
                  ${post.tags.map(tag => `<span class="post-card-tag">${tag}</span>`).join('')}
                </div>
              </div>
            </a>
          `).join('') : `
            <div class="no-posts-message">
              <h3>No articles found</h3>
              <p>Try adjusting your search criteria or tags.</p>
            </div>
          `}
        </div>
      </section>
    `;

    // Hook up interaction handlers
    attachHomeEventListeners();
  });
}

// Attach listeners for Home interactions
function attachHomeEventListeners() {
  // Search Bar input
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    updatePostsGrid();
  });

  // Tag Buttons
  const tagBtns = document.querySelectorAll('.tag-btn');
  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from others
      tagBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      state.activeTag = btn.getAttribute('data-tag');
      updatePostsGrid();
    });
  });
}

// Live-reload post grid during filtering
function updatePostsGrid() {
  const postsGrid = document.getElementById('posts-list');
  if (!postsGrid) return;

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                          post.summary.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesTag = state.activeTag === 'All' || post.tags.includes(state.activeTag);
    return matchesSearch && matchesTag;
  });

  postsGrid.style.opacity = '0.3';
  
  setTimeout(() => {
    postsGrid.innerHTML = filteredPosts.length > 0 ? filteredPosts.map(post => `
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
            ${post.tags.map(tag => `<span class="post-card-tag">${tag}</span>`).join('')}
          </div>
        </div>
      </a>
    `).join('') : `
      <div class="no-posts-message">
        <h3>No articles found</h3>
        <p>Try adjusting your search criteria or tags.</p>
      </div>
    `;
    postsGrid.style.opacity = '1';
  }, 150);
}

// View Renderer: Post Detail
function renderPostDetail(postId) {
  animateTransition(() => {
    const post = blogPosts.find(p => p.id === postId);

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
          ${post.tags.map(tag => `<span class="post-card-tag">${tag}</span>`).join('')}
        </div>

        <div class="post-detail-body">
          ${post.content}
        </div>
      </article>
    `;

    // Add back button click handler
    document.getElementById('post-detail-back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });
  });
}

// View Renderer: Resume / CV
function renderCV() {
  animateTransition(() => {
    viewport.innerHTML = `
      <section class="container cv-section">
        <div class="cv-header">
          <div class="cv-header-text">
            <h1 class="cv-title">My <span>Resume</span></h1>
            <p style="color: var(--text-secondary); margin-top: 0.5rem;">Educator & Aspiring Web Developer</p>
          </div>
          <a href="./assets/CV_Justinas_Steikunas.pdf" class="download-cv-btn" download aria-label="Download Justinas Steikunas PDF CV">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF CV
          </a>
        </div>

        <div class="cv-grid">
          <!-- Left Column (Sidebar) -->
          <div class="cv-sidebar">
            <div class="cv-photo-container">
              <img class="cv-photo" src="./assets/personal_photo.jpg" alt="Justinas Steikunas Profile Headshot">
            </div>

            <!-- Contact Information -->
            <div class="cv-card">
              <h2 class="cv-card-title">Contact Details</h2>
              <ul class="cv-contact-list">
                <li class="cv-contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Vilnius, Lithuania</span>
                </li>
                <li class="cv-contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <a href="tel:+37062294505">+370 622 94505</a>
                </li>
                <li class="cv-contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <a href="mailto:justinas.steikunas@gmail.com">justinas.steikunas@gmail.com</a>
                </li>
                <li class="cv-contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <a href="https://linkedin.com/in/justinassteikunas" target="_blank" rel="noopener noreferrer">justinassteikunas</a>
                </li>
                <li class="cv-contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  <a href="https://github.com/reganas" target="_blank" rel="noopener noreferrer">reganas</a>
                </li>
              </ul>
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

// Global Event Listeners
themeToggleBtn.addEventListener('click', toggleTheme);
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', () => {
  initTheme();
  handleRoute();
});
window.addEventListener('scroll', updateReadingProgress);
