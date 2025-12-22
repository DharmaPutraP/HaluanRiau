/**
 * Utility function to parse TikTok share URLs and convert them to embed URLs
 * Only supports share links: https://www.tiktok.com/@username/video/1234567890123456789
 */

/**
 * Parse TikTok share URL and return both embed URL and original TikTok URL
 * @param {string} url - TikTok share URL
 * @returns {Object|null} - Object with embedUrl, tiktokUrl, and videoId, or null if parsing fails
 */
export function parseTikTokUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  try {
    // Pattern: https://www.tiktok.com/@username/video/VIDEO_ID
    const regex = /tiktok\.com\/@([^\/]+)\/video\/(\d+)/;
    const match = url.match(regex);

    if (!match) {
      console.warn("Could not extract video ID from URL:", url);
      return null;
    }

    const username = match[1];
    const videoId = match[2];

    return {
      embedUrl: `https://www.tiktok.com/embed/v2/${videoId}?lang=en-US`,
      tiktokUrl: `https://www.tiktok.com/@${username}/video/${videoId}`,
      videoId,
      username,
    };
  } catch (error) {
    console.error("Error parsing TikTok URL:", error);
    return null;
  }
}
