# Medical Travel QR Code Generator

A modern, user-friendly QR code generator specifically designed for Medical Travel referrals in Türkiye. This web application creates customizable QR codes with an embedded logo and professional styling.

## Features

- **Custom QR Code Generation**
  - Generates QR codes linking to: `https://medicaltravel.ch/contact/?referrerId=[ID]`
  - Configurable QR code size (default: 1600px)
  - Custom color selection for QR code and frame
  - Embedded Medical Travel logo in the center
  - Stylish "Your journey to Türkiye" text at the bottom

- **Modern UI/UX**
  - Clean, responsive design
  - Turkish tourism-themed red gradient background
  - Elegant Playfair Display and Poppins fonts
  - Smooth animations and transitions
  - User-friendly form controls

- **Functionality**
  - Download QR codes as PNG files
  - Automatic filename generation: `medicaltravel-[referrerId]-[date].png`
  - Open QR code in new window
  - Input validation for referrer IDs
  - High-quality QR code generation (Error Correction Level H)

## Technologies Used

- HTML5
- CSS3
  - Modern CSS features (Flexbox, Grid)
  - CSS Variables
  - Gradients and Animations
- JavaScript (ES6+)
- QRCode.js Library
- Google Fonts (Playfair Display, Poppins, Dancing Script)

## Usage

1. Enter your Referrer ID in the input field
2. (Optional) Customize the QR code:
   - Adjust the size (500px - 3000px)
   - Choose custom colors for the QR code and frame
3. Click "Generate QR Code"
4. Use the buttons below to:
   - Download the QR code as PNG
   - Open in a new window

## Live Demo

The application is live at: [https://serhanco.github.io/qr_mac_gemfl2/](https://serhanco.github.io/qr_mac_gemfl2/)

## Development

To run this project locally:

1. Clone the repository
2. Open `index.html` in your browser
3. No build process or dependencies required

## Credits

- QR Code generation: [QRCode.js](https://github.com/davidshimjs/qrcodejs)
- Fonts: Google Fonts (Playfair Display, Poppins, Dancing Script)
- Logo: Medical Travel Türkiye
