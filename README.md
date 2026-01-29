# YourCompany Website

A professional, responsive business website ready to deploy on GitHub Pages.

## Files Included

- `index.html` - Main HTML structure
- `styles.css` - All styling with CSS variables and responsive design
- `script.js` - JavaScript for interactivity

## Features

- Fully responsive design (mobile, tablet, desktop)
- Smooth scrolling navigation
- Mobile hamburger menu
- Scroll-triggered animations
- Contact form with validation
- Professional corporate styling
- Optimized for performance

## Deploying to GitHub Pages

### Option 1: Quick Deploy (via GitHub UI)

1. **Create a new repository** on GitHub
   - Go to https://github.com/new
   - Name it `yourusername.github.io` (for your main site) or any name (for a project site)
   - Make it public
   - Click "Create repository"

2. **Upload your files**
   - Click "uploading an existing file" on the repository page
   - Drag and drop `index.html`, `styles.css`, and `script.js`
   - Click "Commit changes"

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Under "Source", select "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access your site**
   - Wait 1-2 minutes for deployment
   - Your site will be live at:
     - `https://yourusername.github.io` (if named `yourusername.github.io`)
     - `https://yourusername.github.io/repository-name` (for other names)

### Option 2: Using Git Command Line

```bash
# Navigate to your project folder containing the website files
cd your-project-folder

# Initialize git repository
git init

# Add all files
git add index.html styles.css script.js README.md

# Create initial commit
git commit -m "Initial website commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in repository Settings → Pages.

## Customization Guide

### Changing Company Name & Branding

1. Open `index.html`
2. Replace all instances of "YourCompany" with your company name
3. Update the `<title>` tag and meta description

### Changing Colors

Open `styles.css` and modify the CSS variables at the top:

```css
:root {
    --color-primary: #1a56db;      /* Main brand color */
    --color-primary-dark: #1e40af; /* Darker shade for hover */
    --color-secondary: #0f172a;    /* Dark color for text/footer */
    --color-accent: #0ea5e9;       /* Accent color for gradients */
}
```

### Updating Content

- **Hero Section**: Edit the `<section class="hero">` in `index.html`
- **Services**: Modify the `.service-card` elements
- **Team Members**: Update the `.team-card` elements
- **Contact Info**: Change phone, email, and address in the contact section
- **Footer Links**: Update social media links and company info

### Adding Real Contact Form

Replace the simulated form handling in `script.js` with a real service:

**Option A: Formspree (Free)**
```html
<form action="https://formspree.io/f/your-form-id" method="POST">
```

**Option B: Netlify Forms**
```html
<form name="contact" netlify>
```

### Adding Your Own Images

1. Create an `images` folder in your repository
2. Add your images there
3. Reference them in HTML:
```html
<img src="images/your-image.jpg" alt="Description">
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

Free to use for personal and commercial projects.
