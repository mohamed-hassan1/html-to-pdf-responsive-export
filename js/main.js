function downloadPDF() {
    const { jsPDF } = window.jspdf;
    
    // Create PDF in portrait A4 format
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    // Get all page elements
    const pageContainer = document.querySelector('#myContainer'),
          pages = pageContainer.querySelectorAll('.page');

    document.querySelector('html').classList.add('active');
    //pageContainer.classList.add('active');
    pages.forEach(element => {
      element.style.zoom = '100%';
    });
    
    // Function to convert image to base64
    function getImageDataURL(img) {
        return new Promise((resolve) => {
            if (!img || !img.src) {
                resolve(null);
                return;
            }
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Create a new image to handle cross-origin issues
            const image = new Image();
            image.crossOrigin = 'anonymous';
            
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            
            image.onerror = function() {
                resolve(null);
            };
            
            image.src = img.src;
        });
    }
    
    // Process each page
    async function processPages() {
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            
            // Add new page if not the first one
            if (i > 0) {
                pdf.addPage();
            }
            
            // Convert page to canvas using html2canvas-like approach
            await convertPageToPDF(page, pdf);
            
            // Update progress (optional)
            console.log(`Processed page ${i + 1} of ${pages.length}`);
        }
        
        // Save the PDF
        pdf.save('Connect-Aide-AI-Brochure.pdf');
        document.querySelector('html').classList.remove('active');
        adjustPageZoom(true);
    }
    
    // Convert individual page to PDF
    async function convertPageToPDF(pageElement, pdf) {
        try {
            // Use html2canvas to convert the page element to canvas
            const canvas = await html2canvas(pageElement, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                width: pageElement.offsetWidth,
                height: pageElement.offsetHeight,
                scrollX: 0,
                scrollY: 0
            });
            
            // Convert canvas to image data
            const imgData = canvas.toDataURL('image/png');
            
            // Calculate dimensions to fit A4 page
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate scaling to fit the page properly
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            const widthRatio = pageWidth / (canvasWidth * 0.264583); // Convert px to mm
            const heightRatio = pageHeight / (canvasHeight * 0.264583);
            const ratio = Math.min(widthRatio, heightRatio);
            
            const finalWidth = (canvasWidth * 0.264583) * ratio;
            const finalHeight = (canvasHeight * 0.264583) * ratio;
            
            // Center the image on the page
            const x = (pageWidth - finalWidth) / 2;
            const y = (pageHeight - finalHeight) / 2;
            
            // Add image to PDF
            pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
            
        } catch (error) {
            console.error('Error converting page to PDF:', error);
            
            // Fallback: Add a text indicating the page couldn't be converted
            pdf.setFontSize(12);
            pdf.text('Page could not be converted', 20, 30);
        }
    }
    
    // Start processing
    processPages().catch(error => {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    });
}

// Alternative approach using html2canvas directly if the above doesn't work perfectly
function downloadPDFAlternative() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pages = document.querySelectorAll('.page');
    let promises = [];
    
    pages.forEach((page, index) => {
        promises.push(
            html2canvas(page, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: page.offsetWidth,
                height: page.offsetHeight
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                
                if (index > 0) {
                    pdf.addPage();
                }
                
                // A4 dimensions in mm
                const pageWidth = 210;
                const pageHeight = 297;
                
                // Calculate dimensions maintaining aspect ratio
                const canvasAspectRatio = canvas.width / canvas.height;
                const pageAspectRatio = pageWidth / pageHeight;
                
                let finalWidth, finalHeight;
                if (canvasAspectRatio > pageAspectRatio) {
                    finalWidth = pageWidth;
                    finalHeight = pageWidth / canvasAspectRatio;
                } else {
                    finalHeight = pageHeight;
                    finalWidth = pageHeight * canvasAspectRatio;
                }
                
                // Center the image
                const x = (pageWidth - finalWidth) / 2;
                const y = (pageHeight - finalHeight) / 2;
                
                pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
            })
        );
    });
    
    Promise.all(promises).then(() => {
        pdf.save('Connect-Aide-AI-Brochure.pdf');
        document.querySelector('html').classList.remove('active');
        adjustPageZoom(true);
    }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    });
}

function adjustPageZoom(status) {
    if (status) {
      document.querySelector('html').style.overflow = 'hidden';
      document.querySelector('body').style.overflow = 'hidden';
    }

    let pageElements = document.querySelectorAll('.page'),
        windowWidth = window.innerWidth;

    if (windowWidth <= 1220) {
        // Calculate zoom factor based on window width
        // Zoom from 1.0 at 1220px down to a minimum (e.g., 0.5 at 320px)
        let minWidth = 320, // Minimum expected width
            maxWidth = 1220, // Width at which zoom starts
            minZoom = 0.48, // Minimum zoom level
            maxZoom = 1.0; // Maximum zoom level
        
        if (windowWidth <= 500) {
          minZoom = 0.41;
        }

        // Calculate zoom level (linear interpolation)
        let zoomLevel = minZoom + (maxZoom - minZoom) * 
            ((windowWidth - minWidth) / (maxWidth - minWidth));
        
        
        // Apply zoom to all .page elements (convert to percentage)
        pageElements.forEach(element => {
            element.style.zoom = Math.max(zoomLevel, minZoom) * 100 + '%';
        });
    } else {
        // Reset zoom when window width is greater than 1220px
        pageElements.forEach(element => {
            element.style.zoom = '100%';
        });
    }
  if (status) {
    document.querySelector('html').style.overflow = 'auto';
    document.querySelector('body').style.overflow = 'auto';
  }
}

// Add event listener for window resize
window.addEventListener('resize', () => {adjustPageZoom(false)});

// Call function initially to set proper zoom on page load
adjustPageZoom(true);