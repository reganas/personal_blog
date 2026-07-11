# 🎨 DevPulse — Justinas Steikunas Personal Blog & CV

A premium, high-aesthetic personal portfolio, interactive resume, and tech blog. Designed with glassmorphic elements, ambient glows, fluid animations, responsive grids, and instant light/dark mode transitions.

Built entirely using **Modern Vanilla HTML, CSS, and JavaScript Modules (ES6)**—requiring no complex compiler dependencies or build setups.

---

## ✨ Features

- **🌓 Responsive Dark & Light Themes:** Toggle seamlessly between a deep-space dark mode (with neon teal details) and a crisp off-white light mode (with royal blue accents).
- **🧩 Client-side SPA Router:** Transitions between the Article list, Post details, and the interactive Resume/CV dynamically without page refreshes using URL hash routing (`#/` and `#/cv`).
- **🔍 Live Filtering & Search:** Search titles and summaries or filter posts instantly by tags with responsive list animations.
- **📏 Reading Progress Tracker:** Displays a custom neon gradient progress indicator at the top of the viewport when scroll-reading long posts.
- **📄 Dynamic Interactive CV:** An elegant, structured layout highlighting career history, certifications, academic records, and contact handles.
- **🚀 Lightweight Dev Setup:** Minimal developer footprint, running on a simple static web server.

---

## 📂 Project Structure

```bash
├── assets/                    # Image assets
│   ├── avatar.jpg             # Hero profile image
│   ├── personal_photo.jpg     # Professional CV profile headshot
│   └── *.jpg                  # Post-specific banner images
├── css/
│   └── style.css              # Typography, custom scrollbar, layouts, variables & animations
├── js/
│   ├── app.js                 # Router, state controller, search filters & renderers
│   └── posts.js               # Article database containing metadata and post bodies
├── .gitignore                 # Excluded directories (node_modules, logs)
├── index.html                 # Main SPA HTML structure and SEO setup
├── package.json               # Server runtime script shortcuts
└── README.md                  # Project documentation (this file)
```

---

## 🛠️ Tech Stack & Resources

- **Language/Architecture:** Semantic HTML5, ES6 JavaScript Modules.
- **Styling:** Custom Vanilla CSS variables, backdrop-filter blurs, keyframe animations.
- **Fonts:** [Google Fonts (Outfit & Inter)](https://fonts.google.com/) for clean readability.
- **Icons:** Responsive vector SVGs embedded natively.

---

## 🚀 Running Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/reganas/personal_blog.git
   cd personal_blog
   ```

2. **Start the local preview server:**
   You can run the blog instantly using Node's `http-server` (configured inside `package.json`):

   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to **[http://127.0.0.1:3000](http://127.0.0.1:3000)** to preview the blog.

---

## ✍️ Adding a New Post

To add a new blog post, simply open **`js/posts.js`** and append a new article object to the `blogPosts` array:

```javascript
{
  id: "your-post-id",
  title: "Your Article Title",
  date: "Month Day, Year",
  readTime: "X min read",
  banner: "./assets/your_banner_image.jpg",
  summary: "Brief snippet summarizing the article content.",
  tags: ["Category1", "Category2"],
  content: `
    <p class="lead">Your intro paragraph style here.</p>
    <h2>First Header</h2>
    <p>Your content text...</p>
    <pre><code class="language-javascript">console.log("code highlights");</code></pre>
  `
}
```

---

## 📄 License

This project is licensed under the MIT License.
