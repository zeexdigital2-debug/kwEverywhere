import exifr from 'exifr';
import piexif from 'piexifjs';

/**
 * File size formatter
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Convert any File/Blob to a Base64 Data URL
 */
export function fileToDataURL(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Convert a Base64 Data URL to a binary Blob
 */
export function dataURLtoBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Determine if a tag is privacy-sensitive and classify category
 */
export function classifyMetadataTag(tagKey) {
  const key = String(tagKey).toLowerCase();

  // GPS / Geolocation - High Risk
  if (
    key.includes('gps') ||
    key.includes('latitude') ||
    key.includes('longitude') ||
    key.includes('altitude') ||
    key.includes('position') ||
    key.includes('destbearing') ||
    key.includes('imgdirection') ||
    key.includes('location')
  ) {
    return {
      isSensitive: true,
      category: 'GPS Location',
      riskLevel: 'high',
      riskLabel: 'High Risk (Physical Location)'
    };
  }

  // Device & Serial Numbers - High/Medium Risk
  if (
    key.includes('serial') ||
    key.includes('bodyid') ||
    key.includes('lensid') ||
    key.includes('uniqueid') ||
    key.includes('deviceid')
  ) {
    return {
      isSensitive: true,
      category: 'Device Hardware ID',
      riskLevel: 'high',
      riskLabel: 'High Risk (Hardware Identifier)'
    };
  }

  // Timestamps - Medium Risk
  if (
    key.includes('date') ||
    key.includes('time') ||
    key.includes('subsectime') ||
    key.includes('created') ||
    key.includes('modified')
  ) {
    return {
      isSensitive: true,
      category: 'Date & Time',
      riskLevel: 'medium',
      riskLabel: 'Medium Risk (Exact Timestamp)'
    };
  }

  // Personal / Author Identity - Medium Risk
  if (
    key.includes('author') ||
    key.includes('artist') ||
    key.includes('owner') ||
    key.includes('creator') ||
    key.includes('copyright') ||
    key.includes('comment') ||
    key.includes('description') ||
    key.includes('title') ||
    key.includes('subject') ||
    key.includes('keywords')
  ) {
    return {
      isSensitive: true,
      category: 'Personal & Author',
      riskLevel: 'medium',
      riskLabel: 'Medium Risk (Personal Info)'
    };
  }

  // Camera & Lens Specs - Low/Medium Risk
  if (
    key.includes('make') ||
    key.includes('model') ||
    key.includes('lens') ||
    key.includes('camera') ||
    key.includes('software') ||
    key.includes('hostcomputer') ||
    key.includes('firmware')
  ) {
    return {
      isSensitive: true,
      category: 'Camera & Software',
      riskLevel: 'low',
      riskLabel: 'Low Risk (Gear & Software)'
    };
  }

  // Capture / Exposure Settings
  if (
    key.includes('iso') ||
    key.includes('focal') ||
    key.includes('exposure') ||
    key.includes('fnumber') ||
    key.includes('aperture') ||
    key.includes('shutter') ||
    key.includes('metering') ||
    key.includes('flash') ||
    key.includes('whitebalance')
  ) {
    return {
      isSensitive: false,
      category: 'Photo Exposure',
      riskLevel: 'none',
      riskLabel: 'Standard Photo Setting'
    };
  }

  // Structure / Technical
  return {
    isSensitive: false,
    category: 'Image Structure',
    riskLevel: 'none',
    riskLabel: 'Technical Spec'
  };
}

/**
 * Format tag values into human-readable strings
 */
export function formatTagValue(value, key = '') {
  if (value === null || value === undefined) return 'None';

  if (value instanceof Date) {
    return value.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
  }

  if (typeof value === 'number') {
    // Check if key is latitude or longitude
    const lowerKey = key.toLowerCase();
    if (lowerKey === 'latitude' || lowerKey === 'gpslatitude') {
      const dir = value >= 0 ? 'N' : 'S';
      return `${Math.abs(value).toFixed(6)}° ${dir}`;
    }
    if (lowerKey === 'longitude' || lowerKey === 'gpslongitude') {
      const dir = value >= 0 ? 'E' : 'W';
      return `${Math.abs(value).toFixed(6)}° ${dir}`;
    }
    // General number
    if (!Number.isInteger(value)) {
      return Number(value.toFixed(4)).toString();
    }
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    // If array of numbers/strings
    if (typeof value[0] === 'number' || typeof value[0] === 'string') {
      return value.slice(0, 10).join(', ') + (value.length > 10 ? ` (+${value.length - 10} more)` : '');
    }
    return `Array (${value.length} items)`;
  }

  if (value instanceof Uint8Array || value instanceof ArrayBuffer) {
    return `Binary Data (${value.byteLength || value.length} bytes)`;
  }

  if (typeof value === 'object') {
    try {
      const str = JSON.stringify(value);
      return str.length > 120 ? `${str.slice(0, 120)}...` : str;
    } catch {
      return '[Object]';
    }
  }

  return String(value);
}

/**
 * Inspect an image file and return all metadata tags with categorization
 */
export async function inspectMetadata(fileOrBlob) {
  try {
    const raw = await exifr.parse(fileOrBlob, {
      tiff: true,
      xmp: true,
      icc: false, // ICC profile is color data, not privacy metadata
      jfif: true,
      ihdr: true,
      iptc: true,
      gps: true,
      mergeOutput: true,
      reviveValues: true,
      translateKeys: true,
      translateValues: true,
    });

    if (!raw || Object.keys(raw).length === 0) {
      return {
        tags: [],
        count: 0,
        hasGps: false,
        sensitiveCount: 0,
        summary: {
          camera: null,
          lens: null,
          date: null,
          gps: null,
          software: null,
        },
        raw: {}
      };
    }

    const tags = [];
    let sensitiveCount = 0;
    let hasGps = false;

    // Check GPS
    const lat = raw.latitude ?? raw.GPSLatitude;
    const lon = raw.longitude ?? raw.GPSLongitude;
    const gpsCoords = (lat !== undefined && lon !== undefined && !isNaN(Number(lat)) && !isNaN(Number(lon)))
      ? `${Number(lat).toFixed(5)}, ${Number(lon).toFixed(5)}`
      : null;

    if (gpsCoords) {
      hasGps = true;
    }

    for (const [key, value] of Object.entries(raw)) {
      // Skip undefined or empty values
      if (value === undefined || value === null) continue;

      const classification = classifyMetadataTag(key);
      if (classification.isSensitive) sensitiveCount++;

      tags.push({
        key,
        label: key,
        value: formatTagValue(value, key),
        rawValue: value,
        isSensitive: classification.isSensitive,
        category: classification.category,
        riskLevel: classification.riskLevel,
        riskLabel: classification.riskLabel,
      });
    }

    // Sort tags: High risk first, then medium, then low, then alphabetical
    const riskPriority = { high: 0, medium: 1, low: 2, none: 3 };
    tags.sort((a, b) => {
      const pDiff = (riskPriority[a.riskLevel] ?? 3) - (riskPriority[b.riskLevel] ?? 3);
      if (pDiff !== 0) return pDiff;
      return a.key.localeCompare(b.key);
    });

    // Summary highlights
    const camera = raw.Make ? (raw.Model ? `${raw.Make} ${raw.Model}` : raw.Make) : (raw.Model || null);
    const lens = raw.LensModel || raw.Lens || null;
    const date = raw.DateTimeOriginal || raw.CreateDate || raw.ModifyDate || null;
    const software = raw.Software || raw.HostComputer || null;

    return {
      tags,
      count: tags.length,
      hasGps,
      sensitiveCount,
      summary: {
        camera,
        lens,
        date: date ? formatTagValue(date, 'date') : null,
        gps: gpsCoords,
        software
      },
      raw
    };
  } catch (err) {
    console.warn('Metadata inspection notice:', err);
    return {
      tags: [],
      count: 0,
      hasGps: false,
      sensitiveCount: 0,
      summary: { camera: null, lens: null, date: null, gps: null, software: null },
      raw: {}
    };
  }
}

/**
 * Strip metadata from JPEG using piexifjs
 * Preserves orientation if rotation is specified, or clears all EXIF.
 */
export async function stripJpeg(fileOrBlob) {
  const dataUrl = await fileToDataURL(fileOrBlob);

  // Check orientation first so we don't cause image rotation
  let orientation = null;
  try {
    const raw = await exifr.parse(fileOrBlob, ['Orientation']);
    if (raw && raw.Orientation) {
      orientation = Number(raw.Orientation);
    }
  } catch {
    orientation = null;
  }

  let cleanedDataUrl;

  try {
    if (orientation && orientation > 1) {
      // Keep only Orientation in an otherwise completely blank EXIF object
      // All GPS, serials, dates, thumbnails, camera info are 100% stripped!
      const blankExif = {
        '0th': {
          [piexif.ImageIFD.Orientation]: orientation
        },
        'Exif': {},
        'GPS': {},
        'Interop': {},
        '1st': {},
        'thumbnail': null
      };
      const exifBytes = piexif.dump(blankExif);
      // Remove any existing EXIF first
      const strippedDataUrl = piexif.remove(dataUrl);
      cleanedDataUrl = piexif.insert(exifBytes, strippedDataUrl);
    } else {
      // Normal orientation (1 or none): remove EXIF segment entirely
      cleanedDataUrl = piexif.remove(dataUrl);
    }
  } catch (err) {
    // If piexif.remove fails (e.g. image had no APP1 marker or was non-standard), fallback to canvas redraw
    return stripPngOrWebp(fileOrBlob, 'image/jpeg');
  }

  const cleanedBlob = dataURLtoBlob(cleanedDataUrl);
  return {
    blob: cleanedBlob,
    preservedOrientation: orientation && orientation > 1 ? orientation : null
  };
}

/**
 * Strip metadata from PNG or WebP by redrawing onto an HTML canvas
 * Canvas re-encoding completely drops any EXIF/XMP/tEXt chunks.
 */
export async function stripPngOrWebp(fileOrBlob, targetMime = null) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(fileOrBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        const mime = targetMime || (fileOrBlob.type === 'image/webp' ? 'image/webp' : 'image/png');

        // Fill background if converting transparent to JPEG
        if (mime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to generate stripped image blob'));
              return;
            }
            resolve({ blob, preservedOrientation: null });
          },
          mime,
          mime === 'image/png' ? undefined : 0.96
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for metadata stripping'));
    };

    img.src = url;
  });
}

/**
 * Strip metadata from HEIC / HEIF
 * Converts to JPEG via heic2any first, then strips EXIF
 */
export async function stripHeic(fileOrBlob) {
  const heic2anyModule = await import('heic2any');
  const heic2any = heic2anyModule.default || heic2anyModule;

  const convertedBlob = await heic2any({
    blob: fileOrBlob,
    toType: 'image/jpeg',
    quality: 0.95
  });

  const jpegBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
  return await stripJpeg(jpegBlob);
}

/**
 * Clean metadata for any supported image file
 */
export async function cleanImageMetadata(file) {
  const fileName = file.name || 'image';
  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type?.toLowerCase() || '';

  let result;
  let outputExtension = fileExt;
  let outputMime = mimeType;

  // Determine format and process
  if (fileExt === 'heic' || fileExt === 'heif' || mimeType.includes('heic') || mimeType.includes('heif')) {
    result = await stripHeic(file);
    outputExtension = 'jpg';
    outputMime = 'image/jpeg';
  } else if (fileExt === 'png' || mimeType.includes('png')) {
    result = await stripPngOrWebp(file, 'image/png');
    outputExtension = 'png';
    outputMime = 'image/png';
  } else if (fileExt === 'webp' || mimeType.includes('webp')) {
    result = await stripPngOrWebp(file, 'image/webp');
    outputExtension = 'webp';
    outputMime = 'image/webp';
  } else {
    // Default to JPEG handling
    result = await stripJpeg(file);
    outputExtension = (fileExt === 'jpeg' || fileExt === 'jpg') ? fileExt : 'jpg';
    outputMime = 'image/jpeg';
  }

  // Construct clean output file name: "photo-clean.jpg"
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  const cleanFileName = `${baseName}-clean.${outputExtension}`;

  // Re-inspect the cleaned blob with exifr to verify
  const verification = await inspectMetadata(result.blob);

  return {
    cleanedBlob: result.blob,
    cleanFileName,
    outputMime,
    tagsRemaining: verification.count,
    remainingTags: verification.tags,
    preservedOrientation: result.preservedOrientation,
    cleanedSize: result.blob.size
  };
}
