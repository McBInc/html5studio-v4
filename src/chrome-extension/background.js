/* eslint-disable no-undef */
// HTML5STUDIO Chrome Extension — Background Service Worker

const PLATFORM_URLS = [
  { pattern: "developers.facebook.com/games",      platform: "meta",       label: "Meta Instant Games" },
  { pattern: "developers.facebook.com/docs/games",  platform: "meta",       label: "Meta Instant Games" },
  { pattern: "developers.tiktok.com",              platform: "tiktok",     label: "TikTok Mini Games" },
  { pattern: "discord.com/developers",             platform: "discord",    label: "Discord Activities" },
  { pattern: "developers.google.com/youtube",      platform: "youtube",    label: "YouTube Playables" },
  { pattern: "poki.com/en/developers",             platform: "poki",       label: "Poki" },
  { pattern: "developer.crazygames.com",           platform: "crazygames", label: "CrazyGames" },
  { pattern: "business.linkedin.com",              platform: "linkedin",   label: "LinkedIn Playables" },
];

// Update badge when navigating to a known dev portal
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;

  const match = PLATFORM_URLS.find(p => tab.url.includes(p.pattern));
  if (match) {
    chrome.action.setBadgeText({ tabId, text: "!" });
    chrome.action.setBadgeBackgroundColor({ tabId, color: "#1e6ff0" });
    chrome.action.setTitle({ tabId, title: `HTML5STUDIO — ${match.label} compliance guide available` });
  } else {
    chrome.action.setBadgeText({ tabId, text: "" });
    chrome.action.setTitle({ tabId, title: "HTML5STUDIO Compliance Wizard" });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UNLOCK_STATUS") {
    chrome.storage.local.get(["unlocked"], (data) => {
      sendResponse({ unlocked: data.unlocked || false });
    });
    return true;
  }
});