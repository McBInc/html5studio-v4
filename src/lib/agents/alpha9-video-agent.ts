import { chromium, devices } from 'playwright';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import { generateBotToken, BOT_AUTH_CONFIG } from '../bot-auth';

export interface ForensicResult {
  errors: string[];
  warnings: string[];
  loadTime: number;
  artifactUrl?: string;
}

/**
 * Alpha-9 Video Certification Agent
 * Bootstraps a headless iPhone 14, navigates to the V4 scanner environment, uploads the .zip, and records the artifact.
 */
export async function runForensicVideoAgent(zipPath: string, certId: string, scannerUrl: string = 'http://localhost:3000/landing'): Promise<ForensicResult> {
  let serverCertId = certId; // Default to input ID unless server overrides with sequence
  const scrub = (v: string | undefined) => (v || '').replace(/[^a-zA-Z0-9]/g, '').trim();

  if (process.env.CLOUDFLARE_ACCOUNT_ID || process.env.R2_ACCOUNT_ID) {
    process.env.CLOUDFLARE_ACCOUNT_ID = scrub(process.env.CLOUDFLARE_ACCOUNT_ID || process.env.R2_ACCOUNT_ID);
    process.env.R2_ACCESS_KEY_ID = scrub(process.env.R2_ACCESS_KEY_ID);
    process.env.R2_SECRET_ACCESS_KEY = scrub(process.env.R2_SECRET_ACCESS_KEY);
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true, 
  });

  const iPhone = devices['iPhone 14'];
  const videoDir = path.resolve(process.cwd(), 'tmp_videos');

  // Ensure temp directory exists
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }
  
  // 2. Headless Hardware Acceleration Configuration
  const browser = await chromium.launch({
    args: ['--use-gl=egl', '--ignore-gpu-blocklist'] // Force WebGL compatibility
  });
  
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }, // 1080p HD
      recordVideo: {
        dir: videoDir,
        size: { width: 1920, height: 1080 }
      }
    });
  
  const page = await context.newPage();
  
  let ss1: Buffer | undefined;
  let ss2: Buffer | undefined;
  let ss3: Buffer | undefined;

  const forensics: ForensicResult = {
    errors: [],
    warnings: [],
    loadTime: 0
  };

  // Generate and inject Bot Auth Token
  const botToken = generateBotToken('alpha-9-scanner', 60);
  
  // Cookie injection (The most stable bridge for Vite/DevServer/Proxy)
  const domain = new URL(scannerUrl).hostname;
  await context.addCookies([{
    name: BOT_AUTH_CONFIG.cookieName,
    value: botToken,
    domain: domain === 'localhost' ? 'localhost' : domain,
    path: '/',
  }]);

  console.log(`[AGENT] Bot Authentication (Cookie-Bridge) injected.`);

  const start = Date.now();

  // Parse Live Console Memory/Compliance Errors
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    
    // Squelch expected Base44 SDK noise for Bots
    if (text.includes('401: Authentication required') || text.includes('User/me')) {
       console.log(`[BROWSER ${type.toUpperCase()}] (Squelched SDK Noise) ${text}`);
       return;
    }

    console.log(`[BROWSER ${type.toUpperCase()}] ${text}`);
    if (type === 'error') forensics.errors.push(text);
    if (type === 'warning') forensics.warnings.push(text);
  });

  // Track Network Failures (500s, 401s, CORS)
  page.on('requestfailed', request => {
    const err = `[NETWORK FAIL] ${request.method()} ${request.url()} - ${request.failure()?.errorText}`;
    console.error(err);
    forensics.errors.push(err);
  });

  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (status >= 400) {
      // Ignore expected 401s from the native SDK's auto-auth check
      if (status === 401 && url.includes('/entities/User/me')) {
        console.log(`[AGENT] Ignoring expected SDK 401 for User/me`);
        return;
      }
      const err = `[NETWORK ERROR] ${status} ${url}`;
      console.error(err);
      forensics.errors.push(err);
    }
  });

  try {
    // 3. The Emulation & Validation Phase
    console.log(`\n[AGENT] [V15-DIAGNOSTICS-ACTIVE] Starting forensic sequence...`);
    console.log(`[AGENT] Navigating to Scanner UI: ${scannerUrl}`);
    
    // Reduce network-idle dependency to avoid 30s timeout on heavy assets
    // Navigate and scroll to the scanner container (Visible)
    await page.goto(scannerUrl, { waitUntil: 'load', timeout: 60000 });
    console.log(`[AGENT] Landing Page Loaded.`);
    
    await page.evaluate((id: string) => {
        (window as any).ALPHA9_CERT_ID = id;
        console.log(`[AGENT] Injected Forensic CERT_ID: ${id}`);
        const el = document.getElementById('diagnostics');
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'center' });
    }, certId);

    await page.waitForTimeout(2000); // Wait for repaint
    
    const fileInput = await page.waitForSelector('#alpha9-upload', { state: 'attached' });
    console.log(`[AGENT] Injecting Payload: ${zipPath}`);
    await fileInput.setInputFiles(zipPath);
    
    // 3. Dedicated Capture Bridge (Independent of HUD)
    // We listen for the Backend response to get the Official Sequential ID
    console.log(`[AGENT] Payload Ingested. Waiting for Sequential ID Assignment...`);
    const resp = await page.waitForResponse(r => r.url().includes('/api/scanbuild') && r.status() === 200, { timeout: 120000 });
    const data = await resp.json();
    const serverCertId = data.certId; // The Database-assigned ID (e.g. WGL-CERT-000001)
    const directGameUrl = `http://localhost:3000${data.emulationUrl}`;

    console.log(`[AGENT] Ingestion Confirmed. Official ID: ${serverCertId}. Navigating to Emulator: ${directGameUrl}`);
    
    await page.goto(directGameUrl, { waitUntil: 'load', timeout: 60000 });
    console.log(`[AGENT] Dedicated Emulation Window Established.`);
    
    // Record 25 seconds of 'Gameplay' (Allows WebGL to init and show visuals)
    console.log(`[AGENT] Game Detected. Commencing 25s Emulation Recording with heartbeats...`);
    
    // Visual Heartbeat 1 (Start)
    await page.waitForTimeout(5000);
    ss1 = await page.screenshot({ fullPage: false, type: 'jpeg', quality: 80 });
    console.log(`[AGENT] Visual Heartbeat 1 (5s) Captured.`);
    
    // Visual Heartbeat 2 (Mid)
    await page.waitForTimeout(10000);
    ss2 = await page.screenshot({ fullPage: false, type: 'jpeg', quality: 80 });
    console.log(`[AGENT] Visual Heartbeat 2 (15s) Captured.`);
    
    // Visual Heartbeat 3 (End)
    await page.waitForTimeout(10000);
    ss3 = await page.screenshot({ fullPage: false, type: 'jpeg', quality: 80 });
    console.log(`[AGENT] Visual Heartbeat 3 (25s) Captured.`);

    // Finalizing forensic sequence for R2
    console.log(`[AGENT] Dedicated Capture Complete. Finalizing 25s Video Artifact...`);
    forensics.loadTime = Date.now() - start;

  } catch (error: any) {
    console.error(`[ALPHA-9 FATAL] ${error.message}`);
    
    // FORENSIC DUMP: Capture what the bot was seeing at the time of failure
    try {
      const html = await page.content();
      console.log('--- BEGIN DOM DUMP ---');
      console.log(html.substring(0, 500) + '...'); // Snippet of start
      if (html.includes('Login') || html.includes('Sign in')) {
        console.log('[FORENSIC] Detected Login Redirect - Auth likely failed.');
      }
      if (html.includes('Internal Server Error') || html.includes('500')) {
        console.log('[FORENSIC] Detected Server Error text on page.');
      }
      console.log('--- END DOM DUMP ---');
      
      const screenshotPath = path.resolve(videoDir, `failure-${serverCertId}-${Date.now()}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`[FORENSIC] Failure screenshot saved to: ${screenshotPath}`);
    } catch (dumpErr) {
      console.error('[FORENSIC] Failed to capture DOM dump:', dumpErr);
    }

    forensics.errors.push(`Agent Emulation Failure: ${error.message}`);
  } finally {
    const videoPath = await page.video()?.path();
    await context.close();
    await browser.close();

    // 4. Cloudflare R2 Artifact Handoff
    const uploadToR2 = async (buffer: Buffer, name: string, contentType: string) => {
        const scrubBucket = (v: string | undefined) => (v || '').replace(/[^a-zA-Z0-9.\-_]/g, '').trim();
        const bucket = scrubBucket(process.env.R2_BUCKET_UPLOADS || 'alpha9-artifacts');
        const key = `forensics/${serverCertId}/${name}`;
        if (process.env.CLOUDFLARE_ACCOUNT_ID) {
            await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType }));
            return `https://r2.html5studio.com/${key}`;
        }
        return null;
    };

    if (videoPath && fs.existsSync(videoPath)) {
      try {
        const url = await uploadToR2(fs.readFileSync(videoPath), `alpha9_forensic_capture.webm`, "video/webm");
        if (url) {
            forensics.artifactUrl = url;
            fs.unlinkSync(videoPath);
        }
      } catch (e: any) {
         console.error("[AGENT] Video Upload Failed:", e);
         forensics.errors.push(`Video R2 Error: ${e.message}`);
      }
    }

    // Upload Heartbeats (Simplified)
    try {
        if (typeof ss1 !== 'undefined') await uploadToR2(ss1 as Buffer, `visual_heartbeat_1.jpg`, "image/jpeg");
        if (typeof ss2 !== 'undefined') await uploadToR2(ss2 as Buffer, `visual_heartbeat_2.jpg`, "image/jpeg");
        if (typeof ss3 !== 'undefined') await uploadToR2(ss3 as Buffer, `visual_heartbeat_3.jpg`, "image/jpeg");
    } catch (e: any) {
        console.error("[AGENT] Heartbeat Upload Failed:", e);
    }
  }
  
  return forensics;
}
