# HTML5STUDIO Compliance Wizard — Chrome Extension

A Chrome extension that puts the HTML5STUDIO Compliance Wizard directly in the browser, auto-detecting which game dev portal you're on.

## Features

- **Auto-detects** when you're on Meta, TikTok, Discord, YouTube, Poki, CrazyGames, or LinkedIn developer portals
- **Badge notification** appears on the extension icon when a known portal is detected
- **Content script** injects a subtle compliance reminder on dev portals
- **3-step wizard** — select platform → select engine → view guide
- **Free steps** shown with full code, locked steps redirect to HTML5STUDIO for unlock ($17)
- **Copy-to-clipboard** on all free code blocks

## File Structure

```
chrome-extension/
├── manifest.json        # Extension manifest (MV3)
├── popup.html           # Extension popup shell
├── popup.css            # Popup styles (dark theme, 400px wide)
├── popup.js             # All popup logic — vanilla JS, no dependencies
├── background.js        # Service worker — badge management
├── content.js           # Content script — portal reminder injection
├── content.css          # Content script CSS isolation
└── icons/
    ├── icon16.png        # 16×16 toolbar icon
    ├── icon48.png        # 48×48 store icon
    └── icon128.png       # 128×128 store listing icon
```

## Loading as Unpacked Extension (Dev/Test)

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load unpacked**
4. Select this `chrome-extension/` folder
5. The extension icon appears in your toolbar

## Before Chrome Web Store Submission

1. **Generate icons** — create PNG icons at 16×16, 48×48, and 128×128 px
   - Use the HTML5STUDIO logo / "H5" branding on dark background
   - Save to `chrome-extension/icons/`

2. **Add a Privacy Policy** — add `/privacy` page to HTML5STUDIO app
   - Required for Chrome Web Store submission
   - Must disclose: `activeTab` and `storage` permissions usage

3. **Zip the folder** — zip just the contents of `chrome-extension/` (not the folder itself)

4. **Submit at**: https://chrome.google.com/webstore/devconsole
   - One-time $5 developer registration fee
   - Approval: typically 1–3 business days

## Permissions Explained (for Store Listing)

| Permission  | Why |
|-------------|-----|
| `activeTab` | Detects which game dev portal you're currently on to auto-select the platform |
| `storage`   | Remembers your unlock status across sessions |

No browsing history, no data collection, no external servers.

## Updating Guides

Guide content is in `popup.js` under the `GUIDES` object. Add new platforms/engines by:
1. Adding to `PLATFORMS` and `ENGINES` arrays
2. Adding a `GUIDES["platform-engine"]` entry
3. Re-zip and re-submit to the Web Store