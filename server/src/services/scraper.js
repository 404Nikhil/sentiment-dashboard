const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function scrapeInstagramProfile(username) {
  let browser = null;
  try {
    console.log('[Scraper]: Launching browser...');
    // IMPORTANT: For debugging, change headless to false to watch the browser work
    browser = await chromium.launch({ headless: true }); 
    const context = await browser.newContext();

    // ... (Cookie loading logic remains the same)
    console.log('[Scraper]: Loading and performing definitive cleaning of session cookies...');
    const cookiesPath = path.join(__dirname, '../../cookies.json');
    const cookiesString = await fs.readFile(cookiesPath);
    const originalCookies = JSON.parse(cookiesString);
    const cleanedCookies = originalCookies.map(cookie => {
      let sameSite = 'Lax';
      if (cookie.sameSite === 'no_restriction') sameSite = 'None';
      else if (cookie.sameSite?.toLowerCase() === 'lax') sameSite = 'Lax';
      else if (cookie.sameSite?.toLowerCase() === 'strict') sameSite = 'Strict';
      return { ...cookie, sameSite, expires: cookie.expirationDate ? Math.round(cookie.expirationDate) : -1 };
    });
    await context.addCookies(cleanedCookies);
    console.log('[Scraper]: Cookies loaded successfully!');

    const page = await context.newPage();
    const profileUrl = `https://www.instagram.com/${username}/`;
    console.log(`[Scraper]: Navigating to ${profileUrl}...`);
    await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);

    const basicInfo = await page.evaluate(() => { /* ... (This part is likely fine) ... */ return {}; });
    
    console.log('[Scraper]: Scraping post URLs...');
    const postLinks = await page.evaluate(() => {
        const links = new Set();
        document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').forEach(a => {
            if (links.size < 10) links.add(a.href);
        });
        return Array.from(links);
    });

    if (postLinks.length === 0) {
      throw new Error("No post links found.");
    }
    
    const postsData = [];
    console.log(`[Scraper]: Found ${postLinks.length} posts. Getting details...`);
    for (const link of postLinks) {
      try {
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 15000 });
        
        // --- START OF THE FIX ---
        // Instead of waiting for a generic 'article', we wait for the main media element.
        // This is a more specific and reliable target.
        const mediaSelector = 'article video, article img._aap0, article ._aa6g img';
        await page.waitForSelector(mediaSelector, { timeout: 15000 });
        // --- END OF THE FIX ---

        await page.waitForTimeout(1500 + Math.random() * 1000);

        const postDetails = await page.evaluate(() => {
            // Updated, more specific selectors
            const likesElement = document.querySelector('section[class*="ltpnav"] span[class*="xdj266r"]');
            const captionElement = document.querySelector('h1, ._aacl._aaco._aacu._aacx._aad7._aade');
            const imageUrl = document.querySelector(mediaSelector)?.src;
            return {
                likes: likesElement ? likesElement.innerText : '0',
                caption: captionElement ? captionElement.innerText : '',
                imageUrl: imageUrl,
            };
        });
        
        postsData.push({
            postUrl: link,
            likes: parseInt(String(postDetails.likes).replace(/,/g, ''), 10) || 0,
            caption: postDetails.caption,
            imageUrl: postDetails.imageUrl,
        });
      } catch (postError) {
        console.warn(`Could not scrape post at ${link}. Skipping. Error: ${postError.message}`);
      }
    }

    console.log('[Scraper]: Scraping complete!');
    return { ...basicInfo, recentPosts: postsData };

  } catch (error) {
    console.error('[Scraper]: An error occurred during the scraping process:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
      console.log('[Scraper]: Browser closed.');
    }
  }
}

module.exports = { scrapeInstagramProfile };