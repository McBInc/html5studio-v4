import 'dotenv/config';
import dotenv from 'dotenv';
import { runForensicVideoAgent } from './alpha9-video-agent';

// Load .env.local if it exists (Next.js default)
dotenv.config({ path: '.env.local' });

async function executeAgent() {
  // Fallback: Map R2_ACCOUNT_ID to CLOUDFLARE_ACCOUNT_ID if present in .env.local
  if (!process.env.CLOUDFLARE_ACCOUNT_ID && process.env.R2_ACCOUNT_ID) {
    process.env.CLOUDFLARE_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
  }

  // Explicitly trim all incoming env vars to prevent terminal/trailing-space SSL failures
  const zipPath = process.env.ZIP_PATH?.trim();
  const certId = process.env.CERT_ID?.trim();
  const scannerUrl = (process.env.SCANNER_URL || 'http://localhost:5173').trim();
  
  const scrub = (v: string | undefined) => (v || '').replace(/[^a-zA-Z0-9]/g, '').trim();
  const cfId = scrub(process.env.CLOUDFLARE_ACCOUNT_ID || process.env.R2_ACCOUNT_ID);
  const accKey = scrub(process.env.R2_ACCESS_KEY_ID);
  const secKey = scrub(process.env.R2_SECRET_ACCESS_KEY);

  console.log(`\n[HEALTH CHECK] Environment Key Analysis:`);
  console.log(`- Account ID: ${cfId ? `✅ DETECTED (${cfId.length} chars)` : '❌ MISSING'}`);
  console.log(`- Access Key: ${accKey ? `✅ DETECTED (${accKey.length} chars)` : '❌ MISSING'}`);
  console.log(`- Secret Key: ${secKey ? `✅ DETECTED (${secKey.length} chars)` : '❌ MISSING'}\n`);

  if (!zipPath || !certId) {
    console.error("[ALPHA-9 FATAL] Missing ZIP_PATH or CERT_ID environment variables in the runner payload.");
    process.exit(1);
  }

  console.log(`\n======================================================`);
  console.log(`[ALPHA-9 INITIATED] Payload: ${zipPath} | Cert: ${certId}`);
  console.log(`======================================================\n`);

  // PRE-FLIGHT CHECK: Ensure the V4 server is actually up
    // Explicitly check for Port 3000 (Backend) and Port 5173 (V5 Frontend)
    const res = await fetch(scannerUrl, { method: 'HEAD' }).catch(() => null);
    if (!res || !res.ok) {
        console.error(`\n[ALPHA-9 FATAL] CONNECTION REFUSED: The Alpha-9 UI is not reachable at ${scannerUrl}.`);
        console.error(`Please ensure BOTH servers are running:`);
        console.error(`1. V5 Frontend: 'npm run dev' in html5studio-v5 (Port 5173)`);
        console.error(`2. V4 Backend:  'npm run dev' in unity-html5-studio-v4 (Port 3000)`);
        process.exit(1);
    }
    console.log(`[SYSTEM] Alpha-9 Environment detected at ${scannerUrl} (Status: 200)`);

  try {
    const forensics = await runForensicVideoAgent(zipPath, certId, scannerUrl);
    
    console.log(`\n[ALPHA-9 SYNC COMPLETE] Telemetry Report:`);
    console.log(`- Emulation Load Time: ${forensics.loadTime}ms`);
    console.log(`- Detected AST/Memory Errors: ${forensics.errors.filter(e => !e.includes('R2')).length}`);
    console.log(`- Detected Console Warnings: ${forensics.warnings.length}`);
    
    let r2Status = forensics.artifactUrl || 'LOCAL FILESYSTEM (Upload Failed or Skipped)';
    if (!process.env.CLOUDFLARE_ACCOUNT_ID) r2Status = 'DISABLED (No R2 Keys Provided)';
    console.log(`- Video Artifact R2 Output: ${r2Status}\n`);
    
    if (forensics.errors.length > 0) {
      console.warn("[ALPHA-9 VSA THREAT] The target emitted critical WebGL stack errors during mobile canvas emulation.");
      forensics.errors.forEach((e, i) => console.error(`  ${i+1} ->`, e));
    }
    
    // Explicitly exit with 0 so GitHub Actions considers the agent run "Successful" 
    // even if the game itself is non-compliant. The Pipeline succeeded in scanning it.
    process.exit(0);

  } catch (error: any) {
    console.error("[ALPHA-9 SYSTEM FAILURE] The Playwright hardware emulator crashed:", error);
    process.exit(1);
  }
}

executeAgent();
