const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ============================================================
// PNG chunk helpers
// ============================================================

function crc32(data) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    c ^= data[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 0) & 1 ? (c >>> 1) ^ 0xEDB88320 : c >>> 1;
    }
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function pngSignature() {
  return Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
}

function ihdrChunk(width, height, bitDepth, colorType, compression, filter, interlace) {
  const data = Buffer.alloc(13);
  data.writeUInt32BE(width, 0);
  data.writeUInt32BE(height, 4);
  data[8] = bitDepth;
  data[9] = colorType;       // 2 = RGB, 6 = RGBA
  data[10] = compression;    // 0
  data[11] = filter;         // 0
  data[12] = interlace;      // 0
  return chunk('IHDR', data);
}

function rawImageData(width, height, opts) {
  const scanlines = [];
  for (let y = 0; y < height; y++) {
    const scanline = Buffer.alloc(width * opts.bpp + 1);
    scanline[0] = 0;
    for (let x = 0; x < width; x++) {
      const pixel = opts.getPixel(x, y);
      for (let c = 0; c < opts.bpp; c++) {
        scanline[1 + x * opts.bpp + c] = pixel[c];
      }
    }
    scanlines.push(scanline);
  }
  return Buffer.concat(scanlines);
}

function idatChunk(rawData) {
  const compressed = zlib.deflateSync(rawData, {level: 9});
  return chunk('IDAT', compressed);
}

function iendChunk() {
  return chunk('IEND', Buffer.alloc(0));
}

function createPng(width, height, bitDepth, colorType, getPixel) {
  const bpp = colorType === 6 ? 4 : 3; // RGBA or RGB
  const raw = rawImageData(width, height, { bpp, getPixel });
  return Buffer.concat([
    pngSignature(),
    ihdrChunk(width, height, bitDepth, colorType, 0, 0, 0),
    idatChunk(raw),
    iendChunk(),
  ]);
}

// ============================================================
// Pixel generators
// ============================================================

// --- Icon: Blue background + Gold circle (Algerian identity) ---
function iconPixel(x, y) {
  const cx = 512, cy = 512, r = 420;
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  if (dist <= r) {
    // Gold circle
    return [245, 166, 35]; // #F5A623
  }
  // Blue background
  return [26, 46, 107];   // #1A2E6B
}

// --- Splash: Solid blue background ---
function splashPixel() {
  return [26, 46, 107]; // #1A2E6B
}

// --- Adaptive icon: Blue circle on gold-ish (reversed identity) ---
function adaptivePixel(x, y) {
  const cx = 512, cy = 512, r = 420;
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  if (dist <= r) {
    return [26, 46, 107]; // #1A2E6B (blue circle on gold)
  }
  return [245, 166, 35]; // #F5A623 (gold background)
}

// --- Favicon: Small blue square with gold dot ---
function faviconPixel(x, y) {
  const cx = 32, cy = 32;
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  if (dist <= 20) {
    return [245, 166, 35];
  }
  return [26, 46, 107];
}

// ============================================================
// Generate assets
// ============================================================

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

console.log('🎨 Generating Algerian Blue-Gold assets...');

// Icon (1024x1024, RGB)
const iconBuf = createPng(1024, 1024, 8, 2, iconPixel);
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuf);
console.log(`  ✓ icon.png (${iconBuf.length} bytes, 1024×1024)`);

// Splash (1024x1024, RGB, solid blue)
function splashRow(x, y) { return [26, 46, 107]; }
const splashBuf = createPng(1024, 1024, 8, 2, splashRow);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splashBuf);
console.log(`  ✓ splash.png (${splashBuf.length} bytes, 1024×1024)`);

// Adaptive icon (1024x1024, RGB, gold bg + blue circle)
const adaptiveBuf = createPng(1024, 1024, 8, 2, adaptivePixel);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptiveBuf);
console.log(`  ✓ adaptive-icon.png (${adaptiveBuf.length} bytes, 1024×1024)`);

// Favicon (64x64, RGB)
const faviconBuf = createPng(64, 64, 8, 2, faviconPixel);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), faviconBuf);
console.log(`  ✓ favicon.png (${faviconBuf.length} bytes, 64×64)`);

// Remove any stray JPEG files with .png extension
const files = fs.readdirSync(assetsDir);
files.forEach(f => {
  if (f.endsWith('.png') || f.endsWith('.PNG')) {
    const buf = fs.readFileSync(path.join(assetsDir, f));
    if (buf[0] === 0xFF && buf[1] === 0xD8) {
      fs.unlinkSync(path.join(assetsDir, f));
      console.log(`  ✗ Removed JPEG-mislabeled: ${f}`);
    }
  }
});

console.log('\n✅ All assets regenerated as valid PNG files');
console.log('\n🇨🇩 Algerian Blue-Gold Identity:');
console.log('   #1A2E6B — Blue (primary background)');
console.log('   #F5A623 — Gold (accent / circle)');
