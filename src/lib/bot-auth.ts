/**
 * Bot Authentication System for Playwright Scanners
 * Allows temporary agent access tokens to bypass public landing restrictions
 */

export const BOT_SESSION_HEADER = 'X-Bot-Session-Token';
export const BOT_SESSION_COOKIE = 'bot_session_token';

/**
 * Generate a time-limited bot access token
 * @param {string} botId - Unique identifier for the bot (e.g., 'alpha-9-scanner')
 * @param {number} expiryMinutes - Token validity duration (default: 30 minutes)
 * @returns {string} Base64-encoded token with expiry
 */
export function generateBotToken(botId: string = 'alpha-9-scanner', expiryMinutes: number = 30): string {
  const expiry = Date.now() + (expiryMinutes * 60 * 1000);
  const payload = {
    botId,
    expiry,
    issued: Date.now(),
    scope: 'forensic-scan'
  };

  // In production, sign this with HMAC-SHA256 using a secret
  // For now, base64 encoding
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Validate bot token from request headers or cookies
 * @param {any} request - Request object or headers
 * @returns {any|null} Decoded token if valid, null otherwise
 */
export function validateBotToken(request: any): any | null {
  let token = null;

  // Try header first
  if (request?.headers) {
    if (typeof request.headers.get === 'function') {
        token = request.headers.get(BOT_SESSION_HEADER);
    } else {
        token = request.headers[BOT_SESSION_HEADER.toLowerCase()] || request.headers[BOT_SESSION_HEADER];
    }
  }

  if (!token) return null;

  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));

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
 * @param {any} request
 * @returns {boolean}
 */
export function isAuthorizedBot(request: any): boolean {
  const token = validateBotToken(request);
  return token !== null && token.scope === 'forensic-scan';
}

// Export constants for Playwright setup
export const BOT_AUTH_CONFIG = {
  headerName: BOT_SESSION_HEADER,
  cookieName: BOT_SESSION_COOKIE,
  defaultExpiry: 30, // minutes
};
