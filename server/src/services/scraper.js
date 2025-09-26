const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

/**
 * The main function to scrape an Instagram profile.
 * It uses a two-phase approach:
 * 1. Scrape the main profile page for basic info and post links.
 * 2. Visit each post link individually to get detailed engagement data.
 * @param {string} username The Instagram username to scrape.
 * @returns {Promise<object|null>} An object with the scraped profile data or null on failure.
 */
async function scrapeInstagramProfile(username) {
  let browser = null;
  try {
    console.log('[Scraper]: Launching browser...');
    // headless: true runs the browser in the background. Set to false to watch it work.
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    console.log('[Scraper]: Loading and performing definitive cleaning of session cookies...');
    const cookiesPath = path.join(__dirname, '../../cookies.json');
    const cookiesString = await fs.readFile(cookiesPath);
    const originalCookies = JSON.parse(cookiesString);

    const cleanedCookies = originalCookies.map(cookie => {
      let sameSite = 'Lax'; 
      if (cookie.sameSite === 'no_restriction') {
        sameSite = 'None';
      } else if (cookie.sameSite === 'lax' || cookie.sameSite === 'Lax') {
        sameSite = 'Lax';
      } else if (cookie.sameSite === 'strict' || cookie.sameSite === 'Strict') {
        sameSite = 'Strict';
      }
      
      return {
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        expires: cookie.expirationDate ? Math.round(cookie.expirationDate) : -1,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: sameSite
      };
    });

    // Load the cleaned cookies into the browser context.
    await context.addCookies(cleanedCookies);
    console.log('[Scraper]: Cookies loaded successfully!');

    const page = await context.newPage();
    const profileUrl = `https://www.instagram.com/${username}/`;
    console.log(`[Scraper]: Navigating to ${profileUrl}...`);
    await page.goto(profileUrl);
    // Wait for the main content to be visible, indicating the page has loaded.
    await page.waitForSelector('main', { timeout: 10000 });
    await page.waitForTimeout(3000); // Extra wait for dynamic content.

    // the main profile page 
    const basicInfo = await page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return { fullName: 'N/A' };

        const fullNameElement = header.querySelector('h1, h2');
        // This is a more resilient selector that looks for follower/following links.
        const statsElements = header.querySelectorAll('ul li a[role="link"]');
        const profilePicElement = header.querySelector('img');

        const getStatText = (element) => element?.querySelector('span > span')?.innerText || element?.querySelector('span')?.innerText || '0';

        return {
            fullName: fullNameElement ? fullNameElement.innerText.trim() : 'N/A',
            postsCount: getStatText(statsElements[0]),
            followers: getStatText(statsElements[1]),
            following: getStatText(statsElements[2]),
            profilePictureUrl: profilePicElement ? profilePicElement.src : null,
        };
    });
    
    console.log('[Scraper]: Scraping post URLs...');
    const postLinks = await page.evaluate(() => {
        const links = new Set();
        // This selector targets links that go to a post (/p/) or a reel (/reel/).
        document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').forEach(a => {
            if (links.size < 10) {
                links.add(a.href);
            }
        });
        return Array.from(links);
    });

    if (postLinks.length === 0) {
      throw new Error("No post links found. The profile may be private, empty, or Instagram's layout has changed.");
    }
    
    //  Scrape each post individually
    const postsData = [];
    console.log(`[Scraper]: Found ${postLinks.length} posts. Getting details...`);
    for (const link of postLinks) {
        await page.goto(link);
        await page.waitForSelector('article', { timeout: 10000 });
        await page.waitForTimeout(1500 + Math.random() * 1000);

        const postDetails = await page.evaluate(() => {
            const likesElement = document.querySelector('section span a[role="link"] span, section span button span');
            const captionElement = document.querySelector('h1, ._aacl._aaco._aacu._aacx._aad7._aade');
            const mediaUrl = document.querySelector('article video, article img._aap0, article ._aa6g img')?.src;
            // A simple proxy for comment count by counting list items in the comments section.
            const commentCount = document.querySelectorAll('ul._a9z6._a9z7 li').length;

            return {
                likes: likesElement ? likesElement.innerText : '0',
                caption: captionElement ? captionElement.innerText : '',
                imageUrl: mediaUrl,
                comments: commentCount,
            };
        });
        
        postsData.push({
            postUrl: link,
            likes: parseInt(String(postDetails.likes).replace(/,/g, ''), 10) || 0,
            comments: postDetails.comments || 0,
            caption: postDetails.caption,
            imageUrl: postDetails.imageUrl,
        });
    }

    console.log('[Scraper]: Scraping complete!');
    return { ...basicInfo, recentPosts: postsData };

  } catch (error) {
    console.error('[Scraper]: An error occurred during the scraping process:', error);
    return null;
  } finally {
    // Ensure the browser is always closed, even if an error occurs.
    if (browser) {
      await browser.close();
      console.log('[Scraper]: Browser closed.');
    }
  }
}

module.exports = { scrapeInstagramProfile };