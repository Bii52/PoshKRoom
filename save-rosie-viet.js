const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const url = 'https://www.poshkroom.com/rosie-viet';

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

    // Lấy HTML sạch
    console.log('💾 Lấy HTML...');
    const html = await page.content();

    // Lưu vào technicianDetailPage.js
    const jsContent = `// Auto-generated HTML content
export const technicianDetailPageHTML = \`
${html.replace(/`/g, '\\`')}
\`;
`;
    const jsPath = path.join(__dirname, 'technicianDetailPage.js');
    fs.writeFileSync(jsPath, jsContent);
    console.log(`✓ HTML đã lưu vào JS: ${jsPath} (${Math.round(html.length / 1024)} KB)`);

    // Lấy toàn bộ CSS đã render
    console.log('🎨 Lấy CSS...');
    const allCss = await page.evaluate(() => {
      let cssText = '';
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            cssText += rule.cssText + '\n';
          }
        } catch (e) {
          // Cross-origin CSS sẽ throw lỗi, bỏ qua
        }
      }
      return cssText;
    });

    // Lưu vào technicianDetailPage.css
    const cssPath = path.join(__dirname, 'technicianDetailPage.css');
    fs.writeFileSync(cssPath, allCss);
    console.log(`✓ CSS đã lưu: ${cssPath} (${Math.round(allCss.length / 1024)} KB)`);

    console.log('\n✅ Hoàn tất! HTML + CSS đã xuất ra JS + CSS riêng.');
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await browser.close();
  }
})();