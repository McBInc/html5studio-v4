import { PrismaClient, PlatformTarget } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { scanWebglBuildZip } from "../src/lib/scanners/scanWebglBuildZip";
import { generateCertId } from "../src/lib/cert/generateCertId";
import { patchPlatformHooksInZip } from "../src/lib/patchers/platformInjection";
import AdmZip from "adm-zip";
import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function ingest(filePath: string, platformTarget: PlatformTarget) {
    console.log(`\n[INGESTOR] Processing: ${path.basename(filePath)}...`);
    
    try {
        const buffer = await fs.readFile(filePath);
        const certId = await generateCertId();
        const emulationPath = path.join(process.cwd(), "public", "temp-builds", certId);

        // 0. Auto-Injection (V55 Expansion) 100% Automated
        let finalBuffer = buffer;
        if (["POKI", "CRAZYGAMES", "TENCENT_WECHAT"].includes(platformTarget)) {
            console.log(`[V55-INJECTOR] Patching ${platformTarget} Hooks...`);
            const { outZip } = await patchPlatformHooksInZip(buffer);
            finalBuffer = outZip;
        }

        // 1. Extraction
        await fs.mkdir(emulationPath, { recursive: true });
        const zip = new AdmZip(finalBuffer);
        zip.extractAllTo(emulationPath, true);

        // 2. Forensic Scan
        const scan = await scanWebglBuildZip(finalBuffer, platformTarget);

        // 3. Database Sync (2-STAGE COMMIT for Large JSON Stability)
        let user = await prisma.user.findFirst({ where: { email: "mikmcb@gmail.com" } });
        if (!user) {
            user = await prisma.user.create({ data: { email: "mikmcb@gmail.com", name: "Alpha-9 Agent" } });
        }

        let project = await prisma.project.findFirst({ 
            where: { userId: user.id, name: "Alpha-9 Forensic Suite" } 
        });
        if (!project) {
            project = await prisma.project.create({
                data: { userId: user.id, name: "Alpha-9 Forensic Suite" }
            });
        }

        // Stage 1: Create Basic Record
        console.log(`[STAGING] Creating build header...`);
        const build = await prisma.build.create({
            data: {
                certId,
                projectId: project.id,
                userId: user.id,
                status: "certified",
                platformTarget: "WEB" as PlatformTarget,
                reportStatus: "draft",
                scannedAt: new Date(),
            }
        });

        // Stage 2: Update with Forensic Data
        console.log(`[STAGING] Committing forensic JSON payload...`);
        await prisma.build.update({
            where: { id: build.id },
            data: {
                scanResult: { ...scan as any, originalTarget: platformTarget },
                emulationReadiness: (scan as any).emulation_readiness || null,
                quickScore: (scan as any).quick_score || 0,
                brotliPresent: (scan as any).compression?.brotli_present ?? false,
                gzipPresent: (scan as any).compression?.gzip_present ?? false,
            }
        });

        console.log(`[SUCCESS] ${path.basename(filePath)} -> ${certId}`);
        console.log(`[URL] http://localhost:3000/report/${certId}`);
        
    } catch (err: any) {
        console.error(`[FAILED] ${path.basename(filePath)}: ${err.message}`);
    }
}

async function run() {
    const desktop = "C:/Users/mikmc/Desktop";
    const files = [
        { path: path.join(desktop, "Dragon-Crashers", "dragon-crashers_generic_repo-ready.zip"), platform: "WEB" as PlatformTarget },
    ];

    for (const file of files) {
        await ingest(file.path, file.platform);
    }
}

run()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
