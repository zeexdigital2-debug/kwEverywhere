import exifr from 'exifr';
import piexif from 'piexifjs';

/**
 * Convert decimal degrees to EXIF DMS rational format
 * Returns [[deg, 1], [min, 1], [sec * 10000, 10000]]
 */
export function decimalToDMS(decimal) {
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesNotTruncated = (abs - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = (minutesNotTruncated - minutes) * 60;

  return [
    [degrees, 1],
    [minutes, 1],
    [Math.round(seconds * 10000), 10000]
  ];
}

/**
 * Convert EXIF DMS rational format back to decimal degrees
 */
export function dmsToDecimal(dms, ref) {
  if (!dms || dms.length < 3) return null;
  const deg = dms[0][0] / dms[0][1];
  const min = dms[1][0] / dms[1][1];
  const sec = dms[2][0] / dms[2][1];
  let dec = deg + min / 60 + sec / 3600;
  if (ref === 'S' || ref === 'W') {
    dec = -dec;
  }
  return dec;
}

/**
 * Convert a UTF-8 string to a UCS-2 / UTF-16LE byte array for Windows XP EXIF tags
 * XPKeywords (40094), XPComment (40092), XPTitle (40091)
 */
export function stringToUCS2ByteArray(str) {
  if (!str) return [];
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    bytes.push(code & 0xff);
    bytes.push((code >> 8) & 0xff);
  }
  // Null terminator in UTF-16LE
  bytes.push(0);
  bytes.push(0);
  return bytes;
}

/**
 * Decode UCS-2 / UTF-16LE byte array back to JavaScript string
 */
export function ucs2ByteArrayToString(bytes) {
  if (!bytes || !Array.isArray(bytes) || bytes.length < 2) return '';
  let str = '';
  for (let i = 0; i < bytes.length - 1; i += 2) {
    const code = bytes[i] | (bytes[i + 1] << 8);
    if (code === 0) break;
    str += String.fromCharCode(code);
  }
  return str;
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
 * If file is PNG or WebP, convert to high-quality JPEG via canvas.
 * If already JPEG, return original blob.
 */
export function convertToJpegBlob(file) {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      resolve({ blob: file, converted: false });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        // Fill white background for transparent PNGs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas conversion to JPEG failed'));
              return;
            }
            resolve({ blob, converted: true });
          },
          'image/jpeg',
          0.95
        );
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to read image for format conversion'));
    };
    img.src = url;
  });
}

/**
 * Read existing EXIF GPS, description, keywords, title using exifr
 */
export async function readImageMetadata(fileOrBlob) {
  try {
    const raw = await exifr.parse(fileOrBlob, {
      tiff: true,
      xmp: true,
      icc: false,
      jfif: true,
      ihdr: true,
      gps: true,
      mergeOutput: true,
    });

    if (!raw) {
      return { hasGps: false, latitude: null, longitude: null, description: '', keywords: '', title: '' };
    }

    const latitude = raw.latitude !== undefined && raw.latitude !== null ? Number(Number(raw.latitude).toFixed(6)) : null;
    const longitude = raw.longitude !== undefined && raw.longitude !== null ? Number(Number(raw.longitude).toFixed(6)) : null;
    const hasGps = latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude);

    // Extract Description
    let description = '';
    if (raw.ImageDescription) {
      description = typeof raw.ImageDescription === 'string' ? raw.ImageDescription : '';
    } else if (raw.description?.value) {
      description = raw.description.value;
    } else if (typeof raw.description === 'string') {
      description = raw.description;
    }

    // Extract Keywords
    let keywords = '';
    if (Array.isArray(raw.Keywords)) {
      keywords = raw.Keywords.join(', ');
    } else if (typeof raw.Keywords === 'string') {
      keywords = raw.Keywords;
    } else if (raw.XPKeywords) {
      if (typeof raw.XPKeywords === 'string') {
        keywords = raw.XPKeywords;
      } else if (Array.isArray(raw.XPKeywords)) {
        keywords = ucs2ByteArrayToString(raw.XPKeywords);
      }
    } else if (Array.isArray(raw.subject)) {
      keywords = raw.subject.join(', ');
    } else if (typeof raw.subject === 'string') {
      keywords = raw.subject;
    }

    // Extract Title
    let title = '';
    if (raw.XPTitle) {
      title = typeof raw.XPTitle === 'string' ? raw.XPTitle : ucs2ByteArrayToString(raw.XPTitle);
    } else if (raw.title?.value) {
      title = raw.title.value;
    } else if (typeof raw.title === 'string') {
      title = raw.title;
    }

    return {
      hasGps,
      latitude,
      longitude,
      description,
      keywords,
      title,
      raw
    };
  } catch (err) {
    console.warn('Could not read existing EXIF:', err);
    return { hasGps: false, latitude: null, longitude: null, description: '', keywords: '', title: '' };
  }
}

/**
 * Write GPS and IPTC/XP metadata into a JPEG DataURL using piexifjs
 */
export function writeExifToDataUrl(jpegDataUrl, { latitude, longitude, description, keywords, title }) {
  let exifObj = { '0th': {}, 'Exif': {}, 'GPS': {}, 'Interop': {}, '1st': {}, 'thumbnail': null };

  try {
    const existing = piexif.load(jpegDataUrl);
    if (existing) {
      exifObj = existing;
    }
  } catch (e) {
    // If no existing EXIF segment, start with blank
    exifObj = { '0th': {}, 'Exif': {}, 'GPS': {}, 'Interop': {}, '1st': {}, 'thumbnail': null };
  }

  if (!exifObj['0th']) exifObj['0th'] = {};
  if (!exifObj['Exif']) exifObj['Exif'] = {};
  if (!exifObj['GPS']) exifObj['GPS'] = {};

  // GPS tags
  if (latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude)) {
    const latRef = latitude >= 0 ? 'N' : 'S';
    const lonRef = longitude >= 0 ? 'E' : 'W';
    const latDms = decimalToDMS(latitude);
    const lonDms = decimalToDMS(longitude);

    exifObj['GPS'][piexif.GPSIFD.GPSVersionID] = [2, 2, 0, 0];
    exifObj['GPS'][piexif.GPSIFD.GPSLatitudeRef] = latRef;
    exifObj['GPS'][piexif.GPSIFD.GPSLatitude] = latDms;
    exifObj['GPS'][piexif.GPSIFD.GPSLongitudeRef] = lonRef;
    exifObj['GPS'][piexif.GPSIFD.GPSLongitude] = lonDms;
  }

  // Description (ImageDescription tag 270 + XPComment tag 40092)
  if (description && description.trim()) {
    exifObj['0th'][piexif.ImageIFD.ImageDescription] = description.trim();
    exifObj['0th'][40092] = stringToUCS2ByteArray(description.trim());
  }

  // Keywords (XPKeywords tag 40094)
  if (keywords && keywords.trim()) {
    exifObj['0th'][40094] = stringToUCS2ByteArray(keywords.trim());
  }

  // Document Title (XPTitle tag 40091)
  if (title && title.trim()) {
    exifObj['0th'][40091] = stringToUCS2ByteArray(title.trim());
  }

  const exifBytes = piexif.dump(exifObj);
  const newJpegDataUrl = piexif.insert(exifBytes, jpegDataUrl);
  return newJpegDataUrl;
}
