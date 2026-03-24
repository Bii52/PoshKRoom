/**
 * Vietroom Model Scraper
 * 
 * Script tự động lấy dữ liệu model từ poshkroom.com
 * và thêm vào database MongoDB thông qua API
 * 
 * Usage: node scrapeModel.js <model-slug>
 * Example: node scrapeModel.js rosie-viet
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
require('dotenv').config();


const API_URL = process.env.API_URL || process.env.BACKEND_URL || 'http://localhost:3000';
const MODEL_BASE_URL = 'https://www.poshkroom.com';

// ============ LOGGER ============
const logger = {
  log: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  info: (msg) => console.log(`📍 ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
};

// ============ SCRAPER FUNCTIONS ============

/**
 * Fetch HTML của trang model
 */
async function fetchModelPage(slug) {
  try {
    logger.log(`Fetching ${MODEL_BASE_URL}/${slug}...`);
    const response = await axios.get(`${MODEL_BASE_URL}/${slug}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch page: ${error.message}`);
    throw error;
  }
}

/**
 * Parse HTML và extract dữ liệu model
 */
function parseModelData(html, slug) {
  try {
    const $ = cheerio.load(html);
    
    // Extract name - thường là heading h1 hoặc h2
    const name = extractName($, slug);
    
    // Extract description
    const shortDescription = extractShortDescription($, slug);
    const description = extractDescription($);
    
    // Extract avatar/cover images
    const images = extractImages($);
    const avatar = images.avatar || '/images/placeholder.jpg';
    const cover = images.cover || '/images/placeholder.jpg';
    
    // Extract measurements và thông tin khác
    const additionalInfo = extractAdditionalInfo($);
    
    const modelData = {
      name,
      slug,
      shortDescription: shortDescription || 'Available',
      description: description || additionalInfo,
      avatar,
      cover,
      gallery: images.gallery || [],
      status: true
    };
    
    logger.success(`Parsed data for: ${name}`);
    logger.info(`Details: ${JSON.stringify(modelData, null, 2)}`);
    
    return modelData;
  } catch (error) {
    logger.error(`Error parsing model data: ${error.message}`);
    throw error;
  }
}

/**
 * Extract name từ HTML
 */
function extractName($, slug) {
  // Thử các selectors khác nhau
  let name = $('h1').first().text().trim();
  
  if (!name) {
    name = $('h2').first().text().trim();
  }
  
  if (!name) {
    // Fallback: convert slug to title case
    name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  return name || 'Unknown Model';
}

/**
 * Extract short description
 */
function extractShortDescription($, slug) {
  // Thường ở trong meta description hoặc first paragraph
  let desc = $('meta[name="description"]').attr('content');
  
  if (!desc) {
    desc = $('p').first().text().substring(0, 150).trim();
  }
  
  return desc || `${slug} - Available`;
}

/**
 * Extract full description
 */
function extractDescription($) {
  // Lấy tất cả paragraphs và join
  const paragraphs = [];
  
  $('p').each((i, elem) => {
    const text = $(elem).text().trim();
    if (text && text.length > 20) {
      paragraphs.push(text);
    }
  });
  
  return paragraphs.slice(0, 3).join('\n\n') || 'No description available';
}

/**
 * Extract images
 */
function extractImages($) {
  const images = {
    avatar: null,
    cover: null,
    gallery: []
  };
  
  let allImages = [];
  
  // Lấy tất cả images
  $('img').each((i, elem) => {
    const $img = $(elem);
    let src = $img.attr('src') || $img.attr('data-src');
    
    // Skip if no src
    if (!src) return;
    
    // Convert relative URLs to absolute
    if (!src.startsWith('http')) {
      src = 'https://www.poshkroom.com' + (src.startsWith('/') ? src : '/' + src);
    }
    
    // Skip logo/icon images
    if (src.includes('logo') || src.includes('icon') || src.includes('facebook') || src.includes('instagram')) return;
    
    allImages.push(src);
  });
  
  // Remove duplicates
  allImages = [...new Set(allImages)];
  
  // Phân loại hình ảnh
  if (allImages.length > 0) {
    // Hình ảnh đầu tiên là avatar
    images.avatar = allImages[0];
    logger.info(`Avatar: ${images.avatar}`);
  }
  
  if (allImages.length > 1) {
    // Hình ảnh cuối cùng là cover (thường là hình lớn nhất)
    images.cover = allImages[allImages.length - 1];
    logger.info(`Cover: ${images.cover}`);
  }
  
  // Các hình ảnh ở giữa vào gallery
  if (allImages.length > 2) {
    images.gallery = allImages.slice(1, -1);
    logger.info(`Gallery images: ${images.gallery.length} images`);
  }
  
  return images;
}

/**
 * Extract additional information (measurements, rates, etc.)
 */
function extractAdditionalInfo($) {
  const info = [];
  
  // Get text with "Height:", "Weight:", etc.
  $('*').each((i, elem) => {
    const text = $(elem).text().trim();
    if (text.match(/Height:|Weight:|Bust:|Waist:|Hips:|Service:|Rate:|TER:/i)) {
      info.push(text);
    }
  });
  
  return info.join(' | ') || '';
}

/**
 * Send data to API
 */
async function sendToAPI(modelData) {
  try {
    logger.log(`Sending data to API: ${API_URL}/api/technicians...`);
    
    const response = await axios.post(
      `${API_URL}/api/technicians`,
      modelData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    logger.success(`Model added successfully! ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    // Better error handling
    let errorMsg = error.message;
    
    if (error.response) {
      // Server responded with error status
      errorMsg = `API Error [${error.response.status}]: ${error.response.data?.error || error.response.statusText}`;
      
      if (error.response.status === 400) {
        logger.warn(`⚠️  Model slug already exists: ${modelData.slug}`);
        return { skipped: true, reason: 'Slug already exists' };
      }
    } else if (error.request) {
      // Request made but no response
      errorMsg = `No response from server. Is it running? (${API_URL})`;
    } else if (error.code === 'ECONNREFUSED') {
      errorMsg = `Connection refused. Server not running at ${API_URL}`;
    }
    
    logger.error(`Failed to send data to API: ${errorMsg}`);
    throw error;
  }
}

/**
 * Save data to JSON file for review
 */
function saveToFile(data, filename = 'scrapedData.json') {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    logger.success(`Data saved to ${filename}`);
  } catch (error) {
    logger.error(`Failed to save file: ${error.message}`);
  }
}

// ============ MAIN ============

async function scrapeAndSave(slug) {
  try {
    logger.info(`Starting scrape for model: ${slug}`);
    logger.log('='.repeat(60));
    
    // Step 1: Fetch page
    const html = await fetchModelPage(slug);
    
    // Step 2: Parse data
    const modelData = parseModelData(html, slug);
    
    // Step 3: Save to file for review
    saveToFile(modelData, `scraped_${slug}.json`);
    
    // Step 4: Send to API
    const result = await sendToAPI(modelData);
    
    logger.log('='.repeat(60));
    logger.success('✨ Scrape completed successfully!');
    
    return result;
  } catch (error) {
    logger.log('='.repeat(60));
    logger.error('❌ Scrape failed!');
    process.exit(1);
  }
}

// ============ RUN ============

// Get model slug from command line argument
const modelSlug = process.argv[2];

if (!modelSlug) {
  logger.error('Missing model slug argument');
  console.log('Usage: node scrapeModel.js <model-slug>');
  console.log('Example: node scrapeModel.js rosie-viet');
  process.exit(1);
}

scrapeAndSave(modelSlug);
