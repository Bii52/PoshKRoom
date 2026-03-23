/**
 * POSH K-ROOM Batch Scraper
 * 
 * Scrape nhiều models cùng lúc từ danh sách
 * 
 * Usage: node scraperBatch.js
 */

const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// Import scraper functions
const { scrapeModelData } = require('./scrapeModel');

// ============ CONFIGURATION ============
const API_URL = process.env.API_URL || 'http://localhost:3000';
const DEFAULT_MODELS = [
  'rosie-viet',
  'juju',
  'yua',
  'karina',
  'yena',
  'lora',
];

// ============ LOGGER ============
const logger = {
  log: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  info: (msg) => console.log(`📍 ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
  header: (msg) => console.log(`\n${'═'.repeat(60)}\n${msg}\n${'═'.repeat(60)}`),
};

// ============ BATCH SCRAPER ============

async function scrapeBatch(modelSlugs, concurrency = 2) {
  logger.header('🚀 POSH K-ROOM Batch Scraper');
  
  const results = {
    success: [],
    failed: [],
    skipped: [],
    startTime: new Date(),
  };
  
  logger.log(`Total models to scrape: ${modelSlugs.length}`);
  logger.log(`Concurrency: ${concurrency}`);
  
  // Process in batches to avoid overwhelming the server
  for (let i = 0; i < modelSlugs.length; i += concurrency) {
    const batch = modelSlugs.slice(i, i + concurrency);
    logger.info(`\nProcessing batch ${Math.floor(i / concurrency) + 1} of ${Math.ceil(modelSlugs.length / concurrency)}`);
    
    const promises = batch.map(async (slug) => {
      try {
        logger.log(`Scraping: ${slug}...`);
        const result = await scrapeAndAddModel(slug);
        
        if (result.skipped) {
          results.skipped.push({ slug, reason: result.reason });
          logger.warn(`Skipped: ${slug} (${result.reason})`);
        } else {
          results.success.push({ slug, id: result.id });
          logger.success(`Added: ${slug}`);
        }
      } catch (error) {
        results.failed.push({ slug, error: error.message });
        logger.error(`Failed to scrape ${slug}: ${error.message}`);
      }
    });
    
    await Promise.all(promises);
  }
  
  results.endTime = new Date();
  results.duration = (results.endTime - results.startTime) / 1000;
  
  // Print summary
  printSummary(results);
  
  // Save report
  saveReport(results);
  
  return results;
}

async function scrapeAndAddModel(slug) {
  // This would call the scrapeModel.js logic
  // For now, returning a placeholder
  try {
    const response = await axios.post(`${API_URL}/api/scrape`, { slug });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.error?.includes('already exists')) {
      return { skipped: true, reason: 'Model slug already exists' };
    }
    throw error;
  }
}

function printSummary(results) {
  logger.header('📊 Scrape Summary');
  
  console.log(`
✅ Successful:  ${results.success.length}
⚠️  Skipped:    ${results.skipped.length}
❌ Failed:     ${results.failed.length}
⏱️  Duration:   ${results.duration.toFixed(2)}s
`);
  
  if (results.success.length > 0) {
    console.log('✅ Added models:');
    results.success.forEach(item => console.log(`   - ${item.slug}`));
  }
  
  if (results.skipped.length > 0) {
    console.log('\n⚠️  Skipped models:');
    results.skipped.forEach(item => console.log(`   - ${item.slug}: ${item.reason}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed models:');
    results.failed.forEach(item => console.log(`   - ${item.slug}: ${item.error}`));
  }
}

function saveReport(results) {
  const reportFile = `scrape_report_${Date.now()}.json`;
  fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
  logger.success(`Report saved to: ${reportFile}`);
}

// ============ RUN ============

const args = process.argv.slice(2);
let modelSlugs = DEFAULT_MODELS;
let concurrency = 2;

// Parse arguments
if (args.length > 0) {
  if (args[0] === '--file' && args[1]) {
    // Load from JSON file
    try {
      const data = JSON.parse(fs.readFileSync(args[1], 'utf8'));
      modelSlugs = data.models || data;
      logger.log(`Loaded ${modelSlugs.length} models from ${args[1]}`);
    } catch (error) {
      logger.error(`Failed to load file: ${error.message}`);
      process.exit(1);
    }
  } else if (args[0].includes(',')) {
    // Split comma-separated values
    modelSlugs = args[0].split(',').map(s => s.trim());
  } else {
    modelSlugs = args;
  }
}

// Get concurrency from env or args
if (args.includes('--fast')) {
  concurrency = 5;
} else if (args.includes('--slow')) {
  concurrency = 1;
}

scrapeBatch(modelSlugs, concurrency);
