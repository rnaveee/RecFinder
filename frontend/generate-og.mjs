import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const W = 1200;
const H = 630;
const HALF = W / 2;

const collageBuffer = readFileSync(path.join(__dirname, "public/recfinder-collage-stacked.png"));
const { height: srcH, width: srcW } = await sharp(collageBuffer).metadata();
const photoH = Math.round(srcH / 2);

// Left panel: top photo, cover crop to 600x630 (no stretch)
const leftBuf = await sharp(collageBuffer)
  .extract({ left: 0, top: 0, width: srcW, height: photoH })
  .resize(HALF, H, { fit: "cover", position: "centre" })
  .toBuffer();

// Right panel: bottom photo, cover crop to 600x630 (no stretch)
const rightBuf = await sharp(collageBuffer)
  .extract({ left: 0, top: photoH, width: srcW, height: photoH })
  .resize(HALF, H, { fit: "cover", position: "centre" })
  .toBuffer();

// Composite both panels onto a 1200x630 canvas — hard split, no blend
const bgBuf = await sharp({
  create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } },
})
  .composite([
    { input: leftBuf, left: 0, top: 0 },
    { input: rightBuf, left: HALF, top: 0 },
  ])
  .png()
  .toBuffer();

// Logo centred, enlarged
const LOGO_SIZE = 220;
const logoX = Math.round((W - LOGO_SIZE) / 2);
const logoY = Math.round((H - LOGO_SIZE) / 2);

const logoBuf = await sharp(readFileSync(path.join(__dirname, "public/logo.png")))
  .resize(LOGO_SIZE, LOGO_SIZE)
  .toBuffer();

await sharp(bgBuf)
  .composite([{ input: logoBuf, left: logoX, top: logoY }])
  .png()
  .toFile(path.join(__dirname, "public/og-image.png"));

console.log("Generated public/og-image.png (1200x630)");
