import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

// Runtime must be nodejs for sharp and fs
export const runtime = "nodejs";

// Allowed external hostnames (security whitelist)
const ALLOWED_HOSTS = [
    "admin.unicodeconverter.info",
    "admin.felnatech.com",
    "rambd.com",
];

// Cache directory
const CACHE_DIR = path.join(process.cwd(), ".next", "cache", "image-proxy");

async function ensureCacheDir() {
    try {
        await fs.access(CACHE_DIR);
    } catch {
        await fs.mkdir(CACHE_DIR, { recursive: true });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const width = parseInt(searchParams.get("w") || "800", 10);
    const quality = parseInt(searchParams.get("q") || "75", 10);

    if (!url) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    // Security: only allow whitelisted hosts
    let parsedUrl: URL;
    try {
        parsedUrl = new URL(url);
    } catch {
        return new NextResponse("Invalid url", { status: 400 });
    }

    if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
        return new NextResponse("Host not allowed", { status: 403 });
    }

    try {
        await ensureCacheDir();

        // 1. Detect format support from Accept header
        const acceptHeader = request.headers.get("accept") || "";
        const prefersAvif = acceptHeader.includes("image/avif");
        const format = prefersAvif ? "avif" : "webp";

        // 2. Generate Cache Key
        const cacheKey = crypto
            .createHash("md5")
            .update(`${url}-${width}-${quality}-${format}`)
            .digest("hex");
        const cacheFilePath = path.join(CACHE_DIR, `${cacheKey}.${format}`);

        // 3. Check Cache
        try {
            const cachedData = await fs.readFile(cacheFilePath);
            return new NextResponse(new Uint8Array(cachedData), {
                status: 200,
                headers: {
                    "Content-Type": `image/${format}`,
                    "Cache-Control": "public, max-age=31536000, immutable",
                    "Vary": "Accept",
                    "X-Image-Cache": "HIT",
                },
            });
        } catch {
            // Cache miss, proceed to fetch and process
        }

        // Fetch with browser-like headers so PHP backend doesn't block
        const res = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                Referer: "https://rambd.com/",
                "Cache-Control": "no-cache",
            },
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
            return new NextResponse(`Failed to fetch image: ${res.status}`, {
                status: res.status,
            });
        }

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.startsWith("image/")) {
            return new NextResponse("Not an image", { status: 400 });
        }

        const buffer = Buffer.from(await res.arrayBuffer());

        // 4. Optimization Pipeline
        let transformer = sharp(buffer)
            .rotate()
            .resize(width, undefined, {
                withoutEnlargement: true,
                fit: "inside",
            });

        let finalContentType = `image/${format}`;
        let finalBuffer: Buffer;

        if (prefersAvif) {
            finalBuffer = await transformer
                .avif({
                    quality: Math.max(quality - 15, 40),
                    effort: 4
                })
                .toBuffer();
        } else {
            finalBuffer = await transformer
                .webp({
                    quality: Math.max(quality - 5, 50),
                    effort: 6
                })
                .toBuffer();
        }

        // 5. Save to Cache (Fire and forget, don't block the response)
        fs.writeFile(cacheFilePath, finalBuffer).catch(err =>
            console.error("[image-proxy] Cache write error:", err)
        );

        return new NextResponse(new Uint8Array(finalBuffer), {
            status: 200,
            headers: {
                "Content-Type": finalContentType,
                "Cache-Control": "public, max-age=31536000, immutable",
                "Vary": "Accept",
                "X-Image-Cache": "MISS",
            },
        });
    } catch (error) {
        console.error("[image-proxy] Error:", error);
        return new NextResponse("Image fetch failed", { status: 500 });
    }
}
