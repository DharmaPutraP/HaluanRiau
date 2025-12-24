/**
 * Image Optimization Script
 *
 * This script helps you optimize images in the public folder.
 * Run this before deploying to reduce image sizes.
 *
 * Usage:
 * 1. Install sharp: npm install -D sharp
 * 2. Run: node scripts/optimize-images.js
 */

import sharp from "sharp";
import { readdir, stat, mkdir } from "fs/promises";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, "..", "public");
const OUTPUT_DIR = join(PUBLIC_DIR, "optimized");

// Image optimization settings
const QUALITY_SETTINGS = {
  jpeg: { quality: 80, mozjpeg: true },
  png: { quality: 80, compressionLevel: 9 },
  webp: { quality: 80 },
};

// Max dimensions
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

async function optimizeImage(inputPath, outputPath) {
  try {
    const ext = extname(inputPath).toLowerCase();
    const file = basename(inputPath, ext);

    console.log(`📸 Optimizing: ${basename(inputPath)}`);

    // Get original file size
    const originalStats = await stat(inputPath);
    const originalSize = (originalStats.size / 1024).toFixed(2);

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Resize if too large
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      image.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Process based on format
    if (ext === ".jpg" || ext === ".jpeg") {
      await image.jpeg(QUALITY_SETTINGS.jpeg).toFile(outputPath);
    } else if (ext === ".png") {
      await image.png(QUALITY_SETTINGS.png).toFile(outputPath);
    } else if (ext === ".webp") {
      await image.webp(QUALITY_SETTINGS.webp).toFile(outputPath);
    } else {
      console.log(`⏭️  Skipping unsupported format: ${ext}`);
      return;
    }

    // Also create WebP version for better compression
    const webpPath = outputPath.replace(ext, ".webp");
    await sharp(inputPath)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp(QUALITY_SETTINGS.webp)
      .toFile(webpPath);

    // Get optimized file sizes
    const optimizedStats = await stat(outputPath);
    const optimizedSize = (optimizedStats.size / 1024).toFixed(2);
    const webpStats = await stat(webpPath);
    const webpSize = (webpStats.size / 1024).toFixed(2);

    const savings = (
      (1 - optimizedStats.size / originalStats.size) *
      100
    ).toFixed(1);
    const webpSavings = (
      (1 - webpStats.size / originalStats.size) *
      100
    ).toFixed(1);

    console.log(`   ✅ Original: ${originalSize}KB`);
    console.log(
      `   ✅ Optimized (${ext}): ${optimizedSize}KB (${savings}% smaller)`
    );
    console.log(`   ✅ WebP: ${webpSize}KB (${webpSavings}% smaller)`);
  } catch (error) {
    console.error(`   ❌ Error optimizing ${inputPath}:`, error.message);
  }
}

async function processDirectory(dir, outputDir) {
  try {
    const files = await readdir(dir);

    for (const file of files) {
      const filePath = join(dir, file);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory()) {
        // Skip node_modules and other directories
        if (file !== "node_modules" && file !== "optimized") {
          const newOutputDir = join(outputDir, file);
          await mkdir(newOutputDir, { recursive: true });
          await processDirectory(filePath, newOutputDir);
        }
      } else {
        const ext = extname(file).toLowerCase();
        if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
          const outputPath = join(outputDir, file);
          await optimizeImage(filePath, outputPath);
        }
      }
    }
  } catch (error) {
    console.error("Error processing directory:", error);
  }
}

async function main() {
  console.log("🚀 Starting image optimization...\n");

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Process all images
  await processDirectory(PUBLIC_DIR, OUTPUT_DIR);

  console.log("\n✅ Image optimization complete!");
  console.log(`📁 Optimized images saved to: ${OUTPUT_DIR}`);
  console.log("\n💡 Next steps:");
  console.log("1. Review the optimized images");
  console.log("2. Replace original images with optimized versions");
  console.log("3. Update your components to use <OptimizedImage> component");
  console.log("4. Consider using WebP format for better compression");
}

main().catch(console.error);
