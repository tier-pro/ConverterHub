export function validateNumber(input: string): boolean {
  if (!input || input.trim() === '') return false;
  const num = parseFloat(input);
  return !isNaN(num) && isFinite(num);
}

export function validateFile(file: File, allowedTypes: string[], maxSize: number): { valid: boolean; error?: string } {
  const isValidType = allowedTypes.length === 0 || allowedTypes.some(t => file.type.includes(t) || file.name.endsWith(t));
  if (!isValidType) return { valid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` };
  if (file.size > maxSize) return { valid: false, error: `File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(0)}MB` };
  return { valid: true };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateUrl(url: string): boolean {
  try { new URL(url); return true; }
  catch { return false; }
}

export function validateHexColor(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

export function validateRomanNumeral(str: string): boolean {
  return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(str.toUpperCase());
}
