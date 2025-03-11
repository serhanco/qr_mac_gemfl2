const qrForm = document.getElementById('qrForm');
const qrCodeDiv = document.getElementById('qrCode');
const downloadBtn = document.getElementById('downloadBtn');
const openBtn = document.getElementById('openBtn');

qrForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const referrerId = document.getElementById('referrerId').value;
    const darkColor = document.getElementById('darkColor').value;
    const frameColor = document.getElementById('frameColor').value;
    const qrWidth = parseInt(document.getElementById('qrWidth').value) || 1600;
    const qrHeight = parseInt(document.getElementById('qrHeight').value) || 1600;

    // Validate referrerId (alphanumeric, change spaces to dash)
    const isValid = /^[a-zA-Z0-9\s]*$/.test(referrerId);
    if (!isValid) {
        alert('Referrer ID must be alphanumeric.');
        return;
    }

    const validatedReferrerId = referrerId.replace(/\s+/g, '-');
    
    // Format the full URL for the QR code
    const qrCodeText = "https://medicaltravel.ch/contact/?referrerId=" + validatedReferrerId;

    // Generate QR code with selected colors and dimensions
    generateQRCode(qrCodeText, darkColor, frameColor, qrWidth, qrHeight);
});

function generateQRCode(qrText, darkColor, frameColor, width, height) {
    qrCodeDiv.innerHTML = ""; // Clear previous QR code

    // Extract referrerId from the URL for the filename
    const referrerId = qrText.split('referrerId=')[1];

    // Use default values if not provided
    const qrWidth = width || 1600;
    const qrHeight = height || 1600;

    // Create QR code
    const qrcode = new QRCode(qrCodeDiv, {
        text: qrText,
        width: qrWidth,
        height: qrHeight,
        colorDark : darkColor || "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // Store the referrer ID and colors for later use
    qrCodeDiv.dataset.referrerId = referrerId;
    qrCodeDiv.dataset.darkColor = darkColor;
    qrCodeDiv.dataset.frameColor = frameColor;
    qrCodeDiv.dataset.width = qrWidth;
    qrCodeDiv.dataset.height = qrHeight;

    // Wait a bit for the QR code to render completely
    setTimeout(() => {
        // Get the QR code image and canvas
        const qrImg = qrCodeDiv.querySelector('img');
        const qrCanvas = qrCodeDiv.querySelector('canvas');
        
        if (qrCanvas) {
            // Create a new canvas for our final QR code with logo
            createQRWithLogo(qrCanvas);
        } else {
            console.error('QR code canvas not found');
        }
    }, 200);
}

// New function to create QR code with logo
function createQRWithLogo(qrCanvas) {
    // Create a new canvas
    const canvas = document.createElement('canvas');
    const size = qrCanvas.width; // Use the original QR code size
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Calculate padding
    const padding = Math.floor(size * 0.05);
    const bottomTextArea = Math.floor(size * 0.10);
    
    // Draw the QR code (slightly smaller to accommodate padding)
    const qrSize = size - (padding * 2);
    ctx.drawImage(qrCanvas, padding, padding, qrSize, qrSize - bottomTextArea);
    
    // Use the preloaded logo image from HTML
    const logoImg = document.getElementById('logoImage');
    
    // Function to finalize the QR code with or without logo
    function finalizeQRCode(withLogo) {
        // Get the frame color from the dataset
        const frameColor = qrCodeDiv.dataset.frameColor || '#1a1a1a';
        
        // Draw a colored frame around the QR code
        ctx.strokeStyle = frameColor;
        ctx.lineWidth = Math.floor(size * 0.02); // 2% of size for frame thickness
        ctx.strokeRect(padding/2, padding/2, size - padding, size - padding);
        
        if (withLogo && logoImg && logoImg.complete) {
            // Calculate logo size - 20% of QR code
            const logoSize = Math.floor(qrSize * 0.2);
            
            // Calculate position to center the logo exactly in the middle of the QR code area
            const logoX = padding + Math.floor((qrSize - logoSize) / 2);
            const logoY = padding + Math.floor((qrSize - bottomTextArea - logoSize) / 2);
            
            // Draw white square behind logo
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
            
            // Draw the logo
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            console.log('Logo added at position:', logoX, logoY, 'with size', logoSize);
        }
        
        // Add text at the bottom - properly centered in the bottom padding area
        const bottomTextY = size - (bottomTextArea / 2);
        
        ctx.font = `italic ${Math.floor(bottomTextArea * 0.4)}px 'Dancing Script'`;
        ctx.fillStyle = '#1a1a1a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            'Your journey to Türkiye',
            size / 2,
            bottomTextY
        );
        
        // Draw a subtle line above the text for better separation
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, size - bottomTextArea);
        ctx.lineTo(size - padding, size - bottomTextArea);
        ctx.stroke();
        
        // Convert to image and replace the QR code
        const finalImg = document.createElement('img');
        finalImg.src = canvas.toDataURL('image/png', 1.0);
        qrCodeDiv.innerHTML = '';
        qrCodeDiv.appendChild(finalImg);
        
        // Make sure buttons are visible and have event listeners
        downloadBtn.style.display = 'block';
        openBtn.style.display = 'block';
        
        // Re-attach event listeners to ensure they work
        downloadBtn.addEventListener('click', downloadQRCode);
        openBtn.addEventListener('click', openInNewWindow);
        
        console.log('QR code finalized', withLogo ? 'with logo' : 'without logo');
    }
    
    // Try to use the logo if it's loaded
    if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
        console.log('Logo is already loaded, using it directly');
        finalizeQRCode(true);
    } else if (logoImg) {
        console.log('Waiting for logo to load...');
        // Wait for the logo to load
        logoImg.onload = function() {
            console.log('Logo loaded successfully');
            finalizeQRCode(true);
        };
        
        logoImg.onerror = function() {
            console.error('Failed to load logo image');
            finalizeQRCode(false);
        };
        
        // Set a timeout in case the logo takes too long to load
        setTimeout(function() {
            if (!logoImg.complete || logoImg.naturalWidth === 0) {
                console.warn('Logo loading timeout');
                finalizeQRCode(false);
            }
        }, 1000);
    } else {
        console.error('Logo element not found');
        finalizeQRCode(false);
    }
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function downloadQRCode() {
    const qrCodeImg = qrCodeDiv.querySelector('img');
    if (qrCodeImg) {
        // Get the referrer ID from the dataset or from the input field
        const referrerId = qrCodeDiv.dataset.referrerId || document.getElementById('referrerId').value.replace(/\s+/g, '-');
        const date = new Date().toISOString().split('T')[0];
        const fileName = `medicaltravel-${referrerId}-${date}.png`;
        
        const link = document.createElement('a');
        link.href = qrCodeImg.src;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function openInNewWindow() {
    const qrCodeImg = qrCodeDiv.querySelector('img');
    if (qrCodeImg) {
        const newWindow = window.open('');
        newWindow.document.write('<html><head><title>QR Code</title></head><body style="margin:0;display:flex;justify-content:center;align-items:center;background:#f5f5f5;"><img src="' + qrCodeImg.src + '" style="max-width:90vw;max-height:90vh;"></body></html>');
    }
}

// Add event listeners
downloadBtn.addEventListener('click', downloadQRCode);
openBtn.addEventListener('click', openInNewWindow);
