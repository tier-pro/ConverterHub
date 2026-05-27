export function formatNumber(value: number, decimals: number = 6): string {
  if (!isFinite(value)) return '0';
  if (Math.abs(value) < 1e-10) return '0';
  if (Math.abs(value) >= 1e15) return value.toExponential(4);
  return value.toPrecision(decimals).replace(/\.?0+$/, '');
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || singular + 's');
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

export function camelCase(str: string): string {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase());
}

export function snakeCase(str: string): string {
  return str.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
}

export function kebabCase(str: string): string {
  return str.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
}

export function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function sentenceCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function alternatingCase(str: string): string {
  return str.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join('');
}

export function reverseText(str: string): string {
  return str.split('').reverse().join('');
}

export function reverseWords(str: string): string {
  return str.split(/\s+/).map(w => w.split('').reverse().join('')).join(' ');
}

export function reverseLines(str: string): string {
  return str.split('\n').reverse().join('\n');
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function upsideDownText(str: string): string {
  const map: Record<string, string> = {
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ɓ',
    'h': 'ɥ', 'i': 'ı', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u',
    'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n',
    'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
    'A': '∀', 'B': '𐐒', 'C': 'Ↄ', 'D': '◖', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁',
    'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '⅂', 'M': 'W', 'N': 'N',
    'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ', 'S': 'S', 'T': '⊥', 'U': '∩',
    'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': 'ʎ', 'Z': 'Z',
    '0': '0', '1': '⇂', '2': '↊', '3': '↋', '4': 'ᔭ', '5': 'ഖ', '6': '9',
    '7': 'ㄥ', '8': '8', '9': '6',
    '.': '˙', ',': "'", '?': '¿', '!': '¡', '"': '„', "'": ',', '(': ')', ')': '(',
    '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋',
    '_': '‾', '`': ',', ';': '؛', ':': 'ː',
  };
  return str.split('').reverse().map(c => map[c] || c).join('');
}

export function mirrorText(str: string): string {
  const map: Record<string, string> = {
    'a': 'ɒ', 'b': 'd', 'd': 'b', 'e': 'ɘ', 'f': 'Ꮈ', 'g': 'ǫ', 'h': 'ʜ',
    'p': 'q', 'q': 'p', 's': 'ꙅ', 't': 'ƚ',
  };
  return str.split('').map(c => map[c] || c).join('');
}
