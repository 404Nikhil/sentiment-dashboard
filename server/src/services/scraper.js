const fs = require('fs').promises;
const path = require('path');

async function scrapeInstagramProfile(username) {
  try {
    // load session cookies for authentication.
    console.log('[API Scraper]: Loading session cookies for authentication...');
    const cookiesPath = path.join(__dirname, '../../cookies.json');
    const cookiesString = await fs.readFile(cookiesPath);
    const cookies = JSON.parse(cookiesString);

    // essential cookies needed for the request headers.
    const sessionid = cookies.find(c => c.name === 'sessionid')?.value;
    const csrftoken = cookies.find(c => c.name === 'csrftoken')?.value;
    const ds_user_id = cookies.find(c => c.name === 'ds_user_id')?.value;

    if (!sessionid || !csrftoken || !ds_user_id) {
      throw new Error('Essential cookies (sessionid, csrftoken, ds_user_id) not found in cookies.json. Please re-export them.');
    }

    // format cookies into a single string for the 'cookie' header.
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    // full set of realistic browser headers.
    const headers = {
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "Cookie": cookieString,
      "Referer": `https://www.instagram.com/${username}/`,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      "X-ASBD-ID": "129477",
      "X-CSRFToken": csrftoken,
      "X-IG-App-ID": "936619743392459",
      "X-IG-WWW-Claim": "0",
      "X-Requested-With": "XMLHttpRequest"
    };

    // main profile data using the authenticated headers.
    console.log(`[API Scraper]: Fetching profile info for ${username}...`);
    const profileUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const profileResponse = await fetch(profileUrl, { headers });
    
    if (!profileResponse.ok) {
      const errorBody = await profileResponse.text();
      throw new Error(`Failed to fetch profile. Status: ${profileResponse.status}. Body: ${errorBody}`);
    }
    
    const profileJson = await profileResponse.json();
    const userData = profileJson.data.user;

    if (!userData) {
      throw new Error(`User not found or private profile: ${username}`);
    }
    
    const userId = userData.id;

    const basicInfo = {
      username: userData.username,
      fullName: userData.full_name,
      followers: userData.edge_followed_by.count,
      following: userData.edge_follow.count,
      postsCount: userData.edge_owner_to_timeline_media.count,
      profilePictureUrl: userData.profile_pic_url_hd,
    };

    // the user's post feed using their ID.
    console.log(`[API Scraper]: Fetching posts for user ID ${userId}...`);
    const feedUrl = `https://www.instagram.com/api/v1/feed/user/${userId}/`;
    const feedResponse = await fetch(feedUrl, { headers });
    if (!feedResponse.ok) {
        const errorBody = await feedResponse.text();
        throw new Error(`Failed to fetch user feed. Status: ${feedResponse.status}. Body: ${errorBody}`);
    }
    const feedJson = await feedResponse.json();
    
    const recentPosts = [];
    const recentReels = [];

    feedJson.items.forEach(item => {
      const isReel = item.media_type === 2; // media_type 2 is for videos/reels
      const imageUrl = item.image_versions2?.candidates[0]?.url || item.carousel_media?.[0]?.image_versions2?.candidates[0]?.url;

      const postData = {
        id: item.id,
        imageUrl: imageUrl,
        likes: item.like_count || 0,
        comments: item.comment_count || 0,
        caption: item.caption?.text || "",
        postUrl: `https://www.instagram.com/p/${item.code}/`
      };

      if (isReel) {
        postData.views = item.play_count || 0;
        if (recentReels.length < 5) {
          recentReels.push(postData);
        }
      } else {
        if (recentPosts.length < 10) {
          recentPosts.push(postData);
        }
      }
    });


    const finalData = { ...basicInfo, recentPosts, recentReels };

    const outputPath = path.join(__dirname, '../../output.json');
    await fs.writeFile(outputPath, JSON.stringify(finalData, null, 2));
    console.log(`[API Scraper]: Successfully wrote scraped data to ${outputPath}`);

    return finalData;

  } catch (error) {
    console.error('[API Scraper]: An error occurred:', error);
    return null;
  }
}

module.exports = { scrapeInstagramProfile };