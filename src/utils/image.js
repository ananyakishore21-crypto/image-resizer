export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB input
export const MAX_SIDE = 10000; // max output width/height
export const MAX_PIXELS = 50_000_000; // max output pixels (canvas safety)

export const FORMATS = {
  jpeg: { label: 'JPG', mime: 'image/jpeg', ext: 'jpg' },
  png: { label: 'PNG', mime: 'image/png', ext: 'png' },
  webp: { label: 'WEBP', mime: 'image/webp', ext: 'webp' },
};

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function validateFile(file) {
  if (!file) return 'No file selected.';
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Unsupported file type. Please choose a JPG, PNG or WEBP image.';
  }
  if (file.size > MAX_FILE_BYTES) {
    return `This file is too large (${formatBytes(file.size)}). The maximum is ${formatBytes(MAX_FILE_BYTES)}.`;
  }
  return null;
}

export function validateDimensions(w, h) {
  if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1) {
    return 'Width and height must be whole numbers of at least 1 pixel.';
  }
  if (w > MAX_SIDE || h > MAX_SIDE) {
    return `Width and height cannot exceed ${MAX_SIDE.toLocaleString()} px.`;
  }
  if (w * h > MAX_PIXELS) {
    return 'Those dimensions are too large for your browser to process safely.';
  }
  return null;
}

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      resolve({ url, element: img, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This image could not be read. The file may be corrupted.'));
    };
    img.src = url;
  });
}

export function resizeImage(imgEl, width, height, formatKey, quality) {
  return new Promise((resolve, reject) => {
    try {
      const { mime } = FORMATS[formatKey];
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas is not supported in this browser.');
      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff'; // JPG has no transparency
        ctx.fillRect(0, 0, width, height);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(imgEl, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Processing failed. Try smaller dimensions.'));
          if (blob.type !== mime) {
            return reject(new Error(`Your browser can't export ${FORMATS[formatKey].label}. Try another format.`));
          }
          resolve(blob);
        },
        mime,
        quality / 100
      );
    } catch (err) {
      reject(err instanceof Error ? err : new Error('Processing failed.'));
    }
  });
}

export function baseName(name) {
  return name.replace(/\.[^.]+$/, '') || 'image';
}
