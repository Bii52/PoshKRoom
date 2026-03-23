const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const url = 'https://www.poshkroom.com/rosie-viet';
const pagePrefix = 'rosie-viet'; // Dùng để đặt tên file

(async () => {
  console.log('🚀 Khởi động browser...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('📥 Tải trang...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Xóa tất cả thẻ <script>
    await page.evaluate(() => {
      const scripts = document.querySelectorAll('script');
      scripts.forEach(s => s.remove());
    });

    // Lấy HTML sạch (không có script)
    console.log('💾 Lưu HTML sạch...');
    const html = await page.content();
    const htmlPath = path.join(__dirname, `${pagePrefix}-downloaded.html`);
    fs.writeFileSync(htmlPath, html);
    console.log(`✓ HTML sạch đã lưu: ${htmlPath} (${Math.round(html.length / 1024)}kb)`);

    console.log('\n✅ Hoàn tất! HTML không có script đã lưu.');
    
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await browser.close();
  }
})();