const qrForm = document.getElementById('qrForm');
const qrCodeDiv = document.getElementById('qrCode');
const downloadBtn = document.getElementById('downloadBtn');

qrForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const referrerId = document.getElementById('referrerId').value;

    // Validate referrerId (alphanumeric, change spaces to dash)
    const isValid = /^[a-zA-Z0-9\s]*$/.test(referrerId);
    if (!isValid) {
        alert('Referrer ID must be alphanumeric.');
        return;
    }

    const validatedReferrerId = referrerId.replace(/\s+/g, '-');

    // Generate QR code
    generateQRCode(validatedReferrerId);
});

function generateQRCode(referrerId) {
    qrCodeDiv.innerHTML = ""; // Clear previous QR code

    const qrcode = new QRCode(qrCodeDiv, {
        text: referrerId,
        width: 1600,
        height: 1600,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // Add padding, text, and logo (implementation needed)
    addPaddingTextLogo();

    downloadBtn.style.display = "block";
    downloadBtn.addEventListener('click', downloadQRCode);
}

function addPaddingTextLogo() {
    const canvas = qrCodeDiv.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Calculate padding
    const padding = width * 0.05;
    const bottomPadding = height * 0.1;

    // Save the current drawing state
    ctx.save();

    // Clear the entire canvas
    ctx.clearRect(0, 0, width, height);

    // Redraw the QR code with padding
    const qrCodeSize = width - 2 * padding;
    ctx.drawImage(canvas, padding, padding, qrCodeSize, qrCodeSize);

    // Add "Road to Türkiye" text
    ctx.font = `bold ${bottomPadding / 2}px Arial`; // Adjust font size as needed
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        "Road to Türkiye",
        width / 2,
        height - bottomPadding / 2
    );

    // Load and add the corporate logo
    const logo = new Image();
    logo.src = "logo.png"; // Assuming logo.png is in the same directory
    logo.onload = function() {
        const logoSize = qrCodeSize / 3; // Adjust logo size as needed
        const logoX = width / 2 - logoSize / 2;
        const logoY = height / 2 - logoSize / 2;
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

        // Restore the drawing state
        ctx.restore();

        // Convert canvas to image and update qrCodeDiv
        const qrCodeImg = document.createElement('img');
        qrCodeImg.src = canvas.toDataURL("image/png");
        qrCodeDiv.innerHTML = '';
        qrCodeDiv.appendChild(qrCodeImg);
    };
}

function downloadQRCode() {
    const qrCodeImg = qrCodeDiv.querySelector('img');
    if (qrCodeImg) {
        const link = document.createElement('a');
        link.href = qrCodeImg.src;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
