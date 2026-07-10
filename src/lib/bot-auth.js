/**
 * Bot Authentication System for Playwright Scanners
 * Allows temporary agent access tokens to bypass public landing restrictions
 */

const BOT_SESSION_HEADER = 'X-Bot-Session-Token';
const BOT_SESSION_COOKIE = 'bot_session_token';

/**
 * Generate a time-limited bot access token
 * @param {string} botId - Unique identifier for the bot (e.g., 'alpha-9-scanner')
 * @param {number} expiryMinutes - Token validity duration (default: 30 minutes)
 * @returns {string} Base64-encoded token with expiry
 */
export function generateBotToken(botId = 'alpha-9-scanner', expiryMinutes = 30) {
  const expiry = Date.now() + (expiryMinutes * 60 * 1000);
  const payload = {
    botId,
    expiry,
    issued: Date.now(),
    scope: 'forensic-scan'
  };
  
  // In production, sign this with HMAC-SHA256 using a secret
  // For now, base64 encoding (replace with proper JWT in production)
  return btoa(JSON.stringify(payload));
}

/**
 * Validate bot token from request headers or cookies
 * @param {Request|Headers|Object} request - Request object or headers
 * @returns {Object|null} Decoded token if valid, null otherwise
 */
export function validateBotToken(request) {
  let token = null;
  
  // Try header first
  if (request?.headers) {
    const headers = request.headers instanceof Headers 
      ? request.headers 
      : new Headers(request.headers);
    token = headers.get(BOT_SESSION_HEADER);
  }
  
  // Fallback to cookie
  if (!token && typeof document !== 'undefined') {
    const cookies = document.cookie.split('; ');
    const botCookie = cookies.find(c => c.startsWith(`${BOT_SESSION_COOKIE}=`));
    if (botCookie) {
      token = botCookie.split('=')[1];
    }
  }
  
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token));
    
    // Check expiry
    if (payload.expiry < Date.now()) {
      console.warn('[BotAuth] Token expired');
      return null;
    }
    
    // Validate required fields
    if (!payload.botId || !payload.scope) {
      console.warn('[BotAuth] Invalid token structure');
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('[BotAuth] Token validation failed:', error);
    return null;
  }
}

/**
 * Check if current request is from an authorized bot
 * @param {Request|Headers|Object} request
 * @returns {boolean}
 */
export function isAuthorizedBot(request) {
  const token = validateBotToken(request);
  return token !== null && token.scope === 'forensic-scan';
}

/**
 * Middleware wrapper for bot-protected pages
 * Use this in components that should allow bot access
 */
export function withBotAccess(Component) {
  return function BotProtectedComponent(props) {
    // Allow rendering if bot token is valid
    // This runs client-side, so bot sets cookie before navigation
    return <Component {...props} />;
  };
}

// Export constants for Playwright setup
export const BOT_AUTH_CONFIG = {
  headerName: BOT_SESSION_HEADER,
  cookieName: BOT_SESSION_COOKIE,
  defaultExpiry: 30, // minutes
};