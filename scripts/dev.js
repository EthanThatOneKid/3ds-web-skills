const sirv = require('sirv');
const http = require('http');
const { tunnelmole } = require('tunnelmole');
const qrcode = require('qrcode-terminal');

const PORT = 8000;

// Start local static file server
const assets = sirv('.', { dev: true });
const server = http.createServer((req, res) => assets(req, res));

server.listen(PORT, async (err) => {
  if (err) {
    console.error('❌ Failed to start local server:', err);
    process.exit(1);
  }

  console.log(`📡 Local server running at http://localhost:${PORT}`);
  console.log('🔗 Establishing public tunnel...');

  try {
    const rawUrl = await tunnelmole({ port: PORT });
    
    // Convert to HTTP to prevent the 3DS SSL/TLS handshake error (032-1035)
    const httpUrl = rawUrl.replace('https://', 'http://');

    console.clear();
    console.log('==================================================');
    console.log('🎮  3DS WEB DEV COMMAND CENTER  🎮');
    console.log('==================================================\n');
    console.log(`🌍 Public Tunnel URL: ${httpUrl}`);
    console.log('📱 Scan the QR code below on your Nintendo 3DS:');
    console.log('   (Press L/R on Home Screen, tap QR code button)\n');

    // Generate terminal QR code
    qrcode.generate(httpUrl, { small: true });

    console.log('\n--------------------------------------------------');
    console.log('💡 Tunnelmole runs with NO interstitial warning screens!');
    console.log('   Your 3DS will connect directly and instantly.');
    console.log('==================================================\n');

  } catch (tunnelErr) {
    console.error('❌ Failed to establish tunnelmole:', tunnelErr);
    console.log('💡 Note: You can still test locally on the same Wi-Fi using your local IP.');
  }
});
