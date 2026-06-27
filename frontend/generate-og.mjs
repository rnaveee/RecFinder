import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const W = 1200;
const H = 630;
const LOGO_SIZE = 320;
const logoX = Math.round((W - LOGO_SIZE) / 2);
const logoY = Math.round((H - LOGO_SIZE) / 2);

const logoBuffer = readFileSync(path.join(__dirname, "public/logo.png"));
const resizedLogo = await sharp(logoBuffer).resize(LOGO_SIZE, LOGO_SIZE).toBuffer();

await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
})
  .composite([{ input: resizedLogo, left: logoX, top: logoY }])
  .png()
  .toFile(path.join(__dirname, "public/og-image.png"));

console.log("Generated public/og-image.png (1200x630)");
