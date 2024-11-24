const QRCode = require('qrcode');

// Use your computer's local IP address instead of localhost
const url = 'http://192.168.1.XXX:3000/preview'; // Replace with your IP

console.log('Generating QR code for URL:', url);

QRCode.toFile('qr-code.png', url, {
    errorCorrectionLevel: 'H',
    type: 'png',
    quality: 1,
    margin: 4,
    width: 1024,
    color: {
        dark: '#000000',
        light: '#FFFFFF'
    }
}, function(err) {
    if (err) throw err;
    console.log('QR code has been generated and saved as qr-code.png');
}); 