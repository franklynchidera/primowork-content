// ============================================
// PRIMOWORK - LOAD CONTENT FROM GITHUB
// ============================================

// CONFIGURE THIS - YOUR GITHUB INFO
const GITHUB_USERNAME = "franklynchidera";  // CHANGE THIS
const GITHUB_REPO = "primowork-content";   // CHANGE THIS

// Load blog posts from GitHub
async function loadBlogPosts() {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/posts`;
  
  try {
    const response = await fetch(url);
    const files = await response.json();
    
    const posts = [];
    for (const file of files) {
      if (file.name.endsWith('.md')) {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        
        // Parse the frontmatter (--- at top)
        const titleMatch = content.match(/title: "(.+?)"/);
        const categoryMatch = content.match(/category: "(.+?)"/);
        const readTimeMatch = content.match(/readTime: "(.+?)"/);
        const iconMatch = content.match(/icon: "(.+?)"/);
        const excerptMatch = content.match(/excerpt: "(.+?)"/);
        
        // Get the body (everything after the frontmatter)
        let body = content;
        if (content.includes('---')) {
          const parts = content.split('---');
          body = parts[2] || parts[1] || content;
        }
        
        posts.push({
          title: titleMatch ? titleMatch[1] : file.name.replace('.md', ''),
          category: categoryMatch ? categoryMatch[1] : 'General',
          readTime: readTimeMatch ? readTimeMatch[1] : '5 min read',
          icon: iconMatch ? iconMatch[1] : '📝',
          excerpt: excerptMatch ? excerptMatch[1] : body.substring(0, 150).replace(/#/g, '').trim(),
          content: body,
          filename: file.name
        });
      }
    }
    return posts;
  } catch (error) {
    console.error('Error loading posts:', error);
    return getDefaultPosts();
  }
}

// Default posts if GitHub fails
function getDefaultPosts() {
  return [
    { title: "Welcome to PrimoWork", category: "Welcome", readTime: "2 min read", icon: "✨", excerpt: "Welcome to your new site!", content: "<p>Start adding posts on GitHub!</p>" }
  ];
}

// Load surveys from GitHub
async function loadSurveys() {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/surveys`;
  
  try {
    const response = await fetch(url);
    const files = await response.json();
    
    const surveys = [];
    for (const file of files) {
      if (file.name.endsWith('.md')) {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        
        const nameMatch = content.match(/name: "(.+?)"/);
        const iconMatch = content.match(/icon: "(.+?)"/);
        const descMatch = content.match(/description: "(.+?)"/);
        const payoutMatch = content.match(/payout: "(.+?)"/);
        const linkMatch = content.match(/link: "(.+?)"/);
        const instructionsMatch = content.match(/instructions: "(.+?)"/);
        
        surveys.push({
          name: nameMatch ? nameMatch[1] : 'Survey Site',
          icon: iconMatch ? iconMatch[1] : '📊',
          description: descMatch ? descMatch[1] : '',
          payout: payoutMatch ? payoutMatch[1] : '',
          link: linkMatch ? linkMatch[1] : '#',
          instructions: instructionsMatch ? instructionsMatch[1] : ''
        });
      }
    }
    return surveys;
  } catch (error) {
    return getDefaultSurveys();
  }
}

function getDefaultSurveys() {
  return [
    { name: "UserTesting", icon: "🧪", description: "Test websites for $10", payout: "$10/test", link: "https://usertesting.com", instructions: "Sign up free" }
  ];
}

// Load earn methods from GitHub
async function loadEarnMethods() {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/earn`;
  
  try {
    const response = await fetch(url);
    const files = await response.json();
    
    const methods = [];
    for (const file of files) {
      if (file.name.endsWith('.md')) {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        
        const nameMatch = content.match(/name: "(.+?)"/);
        const iconMatch = content.match(/icon: "(.+?)"/);
        const descMatch = content.match(/description: "(.+?)"/);
        const payoutMatch = content.match(/payout: "(.+?)"/);
        const linkMatch = content.match(/link: "(.+?)"/);
        
        methods.push({
          name: nameMatch ? nameMatch[1] : 'Freelance',
          icon: iconMatch ? iconMatch[1] : '💼',
          description: descMatch ? descMatch[1] : '',
          payout: payoutMatch ? payoutMatch[1] : '',
          link: linkMatch ? linkMatch[1] : '#'
        });
      }
    }
    return methods;
  } catch (error) {
    return getDefaultEarn();
  }
}

function getDefaultEarn() {
  return [
    { name: "Upwork", icon: "💼", description: "Freelance marketplace", payout: "$50-500", link: "https://upwork.com" }
  ];
}

// Render functions (same as before)
let blogPosts = [];
let surveys = [];
let earnMethods = [];

async function loadAllContent() {
  document.getElementById('blogGrid').innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading...</p></div>';
  
  blogPosts = await loadBlogPosts();
  surveys = await loadSurveys();
  earnMethods = await loadEarnMethods();
  
  renderBlog();
  renderSurveys();
  renderEarn();
}

function renderBlog() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  grid.innerHTML = blogPosts.map((post, i) => `
    <div class="blog-card" onclick="openBlogPost(${i})">
      <div class="blog-img">${post.icon}</div>
      <div class="blog-content">
        <span class="blog-category">${post.category}</span>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">${post.excerpt.substring(0, 100)}...</p>
        <div class="blog-meta">
          <span>📖 ${post.readTime}</span>
          <span class="read-link">Read more →</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderSurveys() {
  const grid = document.getElementById('surveysGrid');
  if (!grid) return;
  grid.innerHTML = surveys.map((survey, i) => `
    <div class="blog-card" onclick="openSurvey(${i})">
      <div class="blog-img">${survey.icon}</div>
      <div class="blog-content">
        <h3 class="blog-title">${survey.name}</h3>
        <p class="blog-excerpt">${survey.description}</p>
        <div class="payout-badge"><strong>💰 Payout:</strong> ${survey.payout}</div>
        <div class="blog-meta"><span class="read-link">Learn more →</span></div>
      </div>
    </div>
  `).join('');
}

function renderEarn() {
  const grid = document.getElementById('earnGrid');
  if (!grid) return;
  grid.innerHTML = earnMethods.map((method, i) => `
    <div class="blog-card" onclick="openEarnMethod(${i})">
      <div class="blog-img">${method.icon}</div>
      <div class="blog-content">
        <h3 class="blog-title">${method.name}</h3>
        <p class="blog-excerpt">${method.description}</p>
        <div class="payout-badge"><strong>💰 Potential:</strong> ${method.payout}</div>
        <div class="blog-meta"><span class="read-link">Start earning →</span></div>
      </div>
    </div>
  `).join('');
}

function openBlogPost(i) {
  const post = blogPosts[i];
  document.getElementById('modalBody').innerHTML = `<h2>${post.title}</h2>${post.content}`;
  document.getElementById('articleModal').classList.add('active');
}

function openSurvey(i) {
  const survey = surveys[i];
  document.getElementById('modalBody').innerHTML = `
    <h2>${survey.name}</h2>
    <div class="payout-badge"><strong>💰 Payout:</strong> ${survey.payout}</div>
    <p>${survey.description}</p>
    <p><strong>How to start:</strong> ${survey.instructions}</p>
    <button class="btn-primary" onclick="window.open('${survey.link}','_blank')">Visit ${survey.name}</button>
  `;
  document.getElementById('articleModal').classList.add('active');
}

function openEarnMethod(i) {
  const method = earnMethods[i];
  document.getElementById('modalBody').innerHTML = `
    <h2>${method.name}</h2>
    <div class="payout-badge"><strong>💰 Potential:</strong> ${method.payout}</div>
    <p>${method.description}</p>
    <button class="btn-primary" onclick="window.open('${method.link}','_blank')">Get Started</button>
  `;
  document.getElementById('articleModal').classList.add('active');
}

function closeModal() {
  document.getElementById('articleModal').classList.remove('active');
}

function showSection(section) {
  document.getElementById('homeSection').style.display = section === 'home' ? 'block' : 'none';
  document.getElementById('blogSection').style.display = section === 'blog' ? 'block' : 'none';
  document.getElementById('surveysSection').style.display = section === 'surveys' ? 'block' : 'none';
  document.getElementById('earnSection').style.display = section === 'earn' ? 'block' : 'none';
  document.getElementById('aboutSection').style.display = section === 'about' ? 'block' : 'none';
  document.getElementById('contactSection').style.display = section === 'contact' ? 'block' : 'none';
  
  if (section === 'blog') loadAllContent();
  if (section === 'surveys') loadAllContent();
  if (section === 'earn') loadAllContent();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLegal(type) {
  const content = type === 'privacy' ? '<h2>Privacy Policy</h2><p>We collect emails for newsletter. We use cookies for ads through Google AdSense.</p>' : '<h2>Terms of Service</h2><p>Content is for informational purposes only.</p>';
  document.getElementById('modalBody').innerHTML = content;
  document.getElementById('articleModal').classList.add('active');
}

// Contact form
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thanks! We\'ll reply within 48 hours.');
  e.target.reset();
});

// Mobile menu
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
  document.getElementById('navLinks')?.classList.toggle('active');
});

// Back to top
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backToTop');
  if (btn) window.scrollY > 300 ? btn.classList.add('show') : btn.classList.remove('show');
});

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// Initialize
loadAllContent();
showSection('home');