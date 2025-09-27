const fs = require('fs').promises;
const path = require('path');
const { scrapeInstagramProfile } = require('./src/services/scraper.js');

const runTest = async () => {
  console.log('--- Starting Scraper Test ---');
  require('dotenv').config(); 

  const usernameToTest = 'nasa'; 
  console.log(`Attempting to scrape profile for: ${usernameToTest}`);

  const scrapedData = await scrapeInstagramProfile(usernameToTest);

  if (scrapedData) {
    console.log('--- Scraping Successful! ---');
    
    const outputPath = path.join(__dirname, 'output.json');
    
    await fs.writeFile(outputPath, JSON.stringify(scrapedData, null, 2));
    
    console.log(`Successfully wrote scraped data to: ${outputPath}`);
    console.log(`\nPreview of Full Name: ${scrapedData.fullName}`);
    console.log(`Followers: ${scrapedData.followers}`);
    console.log(`Found ${scrapedData.recentPosts.length} posts.`);

  } else {
    console.error('--- Scraping Failed ---');
    console.log('The scraper returned null. Check the error messages above.');
  }
};

runTest();