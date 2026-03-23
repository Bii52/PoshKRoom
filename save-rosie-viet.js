const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const url = 'https://www.poshkroom.com/rosie-viet';
const htmlFileName = 'rosie-viet-header.html';
const cssFileName = 'rosie-viet-header.css';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

  // 1. Lấy HTML của phần header
  const headerHTML = await page.evaluate(() => {
    const header = document.querySelector('header') || document.querySelector('nav');
    return header ? header.outerHTML : '';
  });

  fs.writeFileSync(path.join(__dirname, htmlFileName), headerHTML);
  console.log(`✓ HTML Header đã lưu: ${htmlFileName} (${Math.round(headerHTML.length / 1024)} KB)`);

  // 2. Lấy tất cả CSS áp dụng lên header
  const headerCSS = await page.evaluate(() => {
    const header = document.querySelector('header') || document.querySelector('nav');
    if (!header) return '';

    let cssText = '';
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.cssText.includes(header.tagName.toLowerCase())) {
            cssText += rule.cssText + '\n';
          }
        }
      } catch (e) {
        // Cross-origin CSS sẽ bị lỗi, bỏ qua
      }
    }
    return cssText;
  });

  fs.writeFileSync(path.join(__dirname, cssFileName), headerCSS);
  console.log(`✓ CSS Header đã lưu: ${cssFileName} (${Math.round(headerCSS.length / 1024)} KB)`);

  await browser.close();
})();