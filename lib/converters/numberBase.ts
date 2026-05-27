export function convertNumberBase(value: string, fromBase: number, toBase: number): string {
  const decimal = parseInt(value, fromBase);
  if (isNaN(decimal)) return '';
  return decimal.toString(toBase).toUpperCase();
}

export function isValidForBase(value: string, base: number): boolean {
  const validChars = '0123456789ABCDEF'.slice(0, base);
  return value.toUpperCase().split('').every(c => validChars.includes(c));
}

export const baseNames = { 2: 'Binary', 8: 'Octal', 10: 'Decimal', 16: 'Hexadecimal' };
