/**
 * Client-side image processing utilities for SnapSolve AI
 * Optimized for speed, mobile bandwidth, and high-precision OCR readability.
 */

export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 20MB limit.`,
    };
  }

  // Check file type / extension
  const fileName = file.name.toLowerCase();
  const validExtension = /\.(jpe?g|png|webp|svg)$/i.test(fileName);
  const validType = SUPPORTED_MIME_TYPES.includes(file.type) || file.type === 'image/svg+xml';

  if (!validExtension && !validType) {
    return {
      valid: false,
      error: 'Unsupported image format. Please upload JPG, JPEG, PNG, or WEBP.',
    };
  }

  return { valid: true };
}

/**
 * Intelligently compresses and resizes high-resolution screenshots
 * to a maximum dimension of 1600px and exports as clean JPEG (0.88 quality)
 * to achieve sub-second network upload times while preserving 100% OCR text clarity.
 */
export async function optimizeScreenshot(
  fileOrDataUrl: File | string,
  maxDimension = 1600
): Promise<{ dataUrl: string; mimeType: string; originalSize?: number; optimizedSize?: number }> {
  return new Promise((resolve, reject) => {
    const processImageSource = (src: string, originalMime: string, origBytes?: number) => {
      // If it's an SVG data URL, convert to high-def PNG
      if (src.startsWith('data:image/svg+xml')) {
        svgToPngDataUrl(src)
          .then((png) => resolve({ dataUrl: png, mimeType: 'image/png' }))
          .catch(reject);
        return;
      }

      // If data URL is already lightweight (under 350KB), use directly to save CPU
      if (src.startsWith('data:') && src.length < 450000 && !src.startsWith('data:image/svg')) {
        const detectedMime = originalMime || 'image/png';
        resolve({
          dataUrl: src,
          mimeType: detectedMime,
          originalSize: origBytes,
          optimizedSize: Math.round(src.length * 0.75),
        });
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        let { width, height } = img;

        // If dimensions are within bounds and already JPEG/WEBP, avoid unnecessary redraw
        if (
          width <= maxDimension &&
          height <= maxDimension &&
          src.startsWith('data:') &&
          (originalMime === 'image/jpeg' || originalMime === 'image/webp') &&
          src.length < 800000
        ) {
          resolve({
            dataUrl: src,
            mimeType: originalMime,
            originalSize: origBytes,
            optimizedSize: Math.round(src.length * 0.75),
          });
          return;
        }

        // Scale down proportionally
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: false });

        if (!ctx) {
          resolve({ dataUrl: src, mimeType: originalMime || 'image/png' });
          return;
        }

        // Fill background white to ensure transparent areas don't render black in JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG at 0.88 quality (sharp text, ~200-300KB size)
        const targetMime = 'image/jpeg';
        const optimizedDataUrl = canvas.toDataURL(targetMime, 0.88);
        const estSize = Math.round(optimizedDataUrl.length * 0.75);

        resolve({
          dataUrl: optimizedDataUrl,
          mimeType: targetMime,
          originalSize: origBytes,
          optimizedSize: estSize,
        });
      };

      img.onerror = () => {
        resolve({ dataUrl: src, mimeType: originalMime || 'image/png' });
      };

      img.src = src;
    };

    if (typeof fileOrDataUrl === 'string') {
      const mimeMatch = fileOrDataUrl.match(/^data:([^;]+);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/png';
      processImageSource(fileOrDataUrl, mime, fileOrDataUrl.length);
    } else {
      const origSize = fileOrDataUrl.size;
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        processImageSource(src, fileOrDataUrl.type || 'image/png', origSize);
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

/**
 * Converts an SVG data URL or SVG markup into a high-resolution PNG data URL
 */
export async function svgToPngDataUrl(
  svgDataUrl: string,
  targetWidth = 1000,
  targetHeight = 750
): Promise<string> {
  return new Promise((resolve) => {
    if (
      svgDataUrl.startsWith('data:image/png') ||
      svgDataUrl.startsWith('data:image/jpeg') ||
      svgDataUrl.startsWith('data:image/webp')
    ) {
      resolve(svgDataUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(svgDataUrl);
          return;
        }

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const pngUrl = canvas.toDataURL('image/png', 0.95);
        resolve(pngUrl);
      } catch (err) {
        console.warn('Canvas conversion failed, fallback to original', err);
        resolve(svgDataUrl);
      }
    };

    img.onerror = (e) => {
      console.warn('Image load error for SVG conversion', e);
      resolve(svgDataUrl);
    };

    img.src = svgDataUrl;
  });
}
