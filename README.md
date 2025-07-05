# HTML to PDF - Responsive Export

This project allows you to convert a fully responsive HTML page into a PDF that **perfectly matches the original layout** and **looks identical on both desktop and mobile devices**.

The export is handled using [`jsPDF`](https://github.com/parallax/jsPDF) and [`html2canvas`](https://github.com/niklasvh/html2canvas), and includes custom JavaScript logic to ensure consistent rendering, even when the screen is resized.

## 🌐 Live Demo

🔗 [View Live Preview](https://www.mhdeveloper.com/projects/html-to-pdf/)


## 🔧 Features

- ✅ Export full HTML page as PDF with 100% identical styling
- 📐 Page size: `8.5in × 11in` (standard A4/US Letter)
- 🧠 Auto-scale to preserve desktop view on mobile screens
- 🖼️ Supports images, custom fonts, and styled elements
- 📱 Fully responsive layout
- 🔘 Floating "Download PDF" button for easy access


## 📁 Project Structure

/html-to-pdf-responsive-export
├── index.html       # The main HTML page with inline styles
├── js/
│   └── main.js      # JavaScript logic for rendering and PDF export
├── img/             # Images


## 🚀 How It Works

1. The `index.html` file is styled to match a real PDF layout (8.5in × 11in).
2. The page is fully responsive and scales visually on smaller devices.
3. When the "Download PDF" button is clicked:
   - The script in `main.js` captures the page using `html2canvas`
   - Then, it converts the canvas to a PDF using `jsPDF`
4. The resulting PDF is **pixel-perfect**, identical to what you see on screen—regardless of screen size.

## 📲 Mobile Experience

- The HTML layout is auto-scaled on small screens to simulate the same appearance as desktop.
- Clicking "Download PDF" from a mobile device will generate the **same result** as on desktop.
