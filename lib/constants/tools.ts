import type { ToolCategory } from '@/types';

export const toolCategories: ToolCategory[] = [
  {
    id: 'converters',
    name: 'Unit Converters',
    icon: 'ArrowLeftRight',
    tools: [
      { id: 'length-converter', name: 'Length Converter', path: '/converters/length-converter', description: 'Convert between millimeters, centimeters, meters, kilometers, inches, feet, yards, miles, and nautical miles.', icon: 'Ruler' },
      { id: 'weight-converter', name: 'Weight Converter', path: '/converters/weight-converter', description: 'Convert between milligrams, grams, kilograms, metric tons, ounces, pounds, stones, and US tons.', icon: 'Weight' },
      { id: 'temperature-converter', name: 'Temperature Converter', path: '/converters/temperature-converter', description: 'Convert between Celsius, Fahrenheit, and Kelvin with reference points.', icon: 'Thermometer' },
      { id: 'area-converter', name: 'Area Converter', path: '/converters/area-converter', description: 'Convert between square units, acres, and hectares.', icon: 'Square' },
      { id: 'volume-converter', name: 'Volume Converter', path: '/converters/volume-converter', description: 'Convert between liters, gallons, quarts, cups, and cooking measurements.', icon: 'Beaker' },
      { id: 'speed-converter', name: 'Speed Converter', path: '/converters/speed-converter', description: 'Convert between m/s, km/h, mph, ft/s, and knots.', icon: 'Zap' },
      { id: 'time-converter', name: 'Time Converter', path: '/converters/time-converter', description: 'Convert between nanoseconds, seconds, hours, days, years, and centuries.', icon: 'Clock' },
      { id: 'data-storage-converter', name: 'Data Storage Converter', path: '/converters/data-storage-converter', description: 'Convert between bits, bytes, KB, MB, GB, TB with decimal and binary modes.', icon: 'HardDrive' },
    ],
  },
  {
    id: 'text-tools',
    name: 'Text Tools',
    icon: 'Type',
    tools: [
      { id: 'case-converter', name: 'Case Converter', path: '/text-tools/case-converter', description: 'Convert text between UPPERCASE, lowercase, Title Case, CamelCase, snake_case, and more.', icon: 'CaseSensitive' },
      { id: 'word-counter', name: 'Word & Character Counter', path: '/text-tools/word-counter', description: 'Count words, characters, sentences, paragraphs, and analyze keyword density.', icon: 'Sigma' },
      { id: 'text-formatter', name: 'Text Formatter & Cleaner', path: '/text-tools/text-formatter', description: 'Remove extra spaces, line breaks, duplicates, sort lines, and clean text.', icon: 'AlignLeft' },
      { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', path: '/text-tools/lorem-ipsum', description: 'Generate Lorem Ipsum placeholder text by paragraphs, words, or bytes.', icon: 'FileText' },
      { id: 'text-reverser', name: 'Text Reverser & Manipulator', path: '/text-tools/text-reverser', description: 'Reverse text, words, lines, shuffle content, and create upside down text.', icon: 'Repeat' },
    ],
  },
  {
    id: 'color-tools',
    name: 'Color Tools',
    icon: 'Palette',
    tools: [
      { id: 'color-converter', name: 'Color Converter', path: '/color-tools/color-converter', description: 'Convert colors between HEX, RGB, RGBA, HSL, HSLA, CMYK, and HSV formats.', icon: 'SwatchBook' },
      { id: 'color-picker', name: 'Color Picker & Palette', path: '/color-tools/color-picker', description: 'Pick colors visually and generate monochromatic, analogous, complementary palettes.', icon: 'Eyedropper' },
      { id: 'gradient-generator', name: 'Gradient Generator', path: '/color-tools/gradient-generator', description: 'Create beautiful linear and radial gradients with multiple color stops.', icon: 'Droplets' },
      { id: 'contrast-checker', name: 'Color Contrast Checker', path: '/color-tools/contrast-checker', description: 'Check WCAG compliance of color combinations for accessibility.', icon: 'Accessibility' },
    ],
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    icon: 'Image',
    tools: [
      { id: 'image-resizer', name: 'Image Resizer', path: '/image-tools/image-resizer', description: 'Resize images by percentage, dimensions, or preset social media sizes.', icon: 'Maximize' },
      { id: 'image-compressor', name: 'Image Compressor', path: '/image-tools/image-compressor', description: 'Compress images with quality control and before/after preview.', icon: 'FileDown' },
      { id: 'image-format-converter', name: 'Image Format Converter', path: '/image-tools/image-format-converter', description: 'Convert images between JPG, PNG, WebP, BMP, and GIF formats.', icon: 'Repeat2' },
      { id: 'image-cropper', name: 'Image Cropper', path: '/image-tools/image-cropper', description: 'Crop images with free selection or preset aspect ratios.', icon: 'Crop' },
      { id: 'image-to-base64', name: 'Image to Base64', path: '/image-tools/image-to-base64', description: 'Convert images to Base64 encoded strings and vice versa.', icon: 'FileCode' },
      { id: 'background-remover', name: 'Background Remover', path: '/image-tools/background-remover', description: 'Remove image backgrounds instantly with AI — 100% free, private, and client-side.', icon: 'ImageMinus' },
      { id: 'video-to-gif', name: 'Video to GIF Maker', path: '/image-tools/video-to-gif', description: 'Convert any video clip to an animated GIF. Free, no upload, no watermark.', icon: 'Film' },
    ],
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    icon: 'File',
    tools: [
      { id: 'pdf-to-images', name: 'PDF to Images', path: '/pdf-tools/pdf-to-images', description: 'Convert PDF pages to JPG or PNG images.', icon: 'FileImage' },
      { id: 'merge-pdf', name: 'Merge PDF', path: '/pdf-tools/merge-pdf', description: 'Combine multiple PDF files into a single document.', icon: 'Combine' },
      { id: 'split-pdf', name: 'Split PDF', path: '/pdf-tools/split-pdf', description: 'Split PDF into separate pages or extract specific pages.', icon: 'Split' },
      { id: 'pdf-page-remover', name: 'PDF Page Remover', path: '/pdf-tools/pdf-page-remover', description: 'Remove unwanted pages from PDF documents.', icon: 'Trash2' },
      { id: 'pdf-to-word', name: 'PDF to Word/Text', path: '/pdf-tools/pdf-to-word', description: 'Extract text from PDF and download as Word document or plain text.', icon: 'FileText' },
    ],
  },
  {
    id: 'dev-tools',
    name: 'Developer Tools',
    icon: 'Code',
    tools: [
      { id: 'base64-encoder', name: 'Base64 Encoder/Decoder', path: '/dev-tools/base64-encoder', description: 'Encode and decode text and files to/from Base64 format.', icon: 'FileCode2' },
      { id: 'url-encoder', name: 'URL Encoder/Decoder', path: '/dev-tools/url-encoder', description: 'Encode and decode URLs and URI components.', icon: 'Link' },
      { id: 'hash-generator', name: 'Hash Generator', path: '/dev-tools/hash-generator', description: 'Generate MD5, SHA-1, SHA-256, SHA-512, and RIPEMD-160 hashes.', icon: 'Fingerprint' },
      { id: 'password-generator', name: 'Password Generator', path: '/dev-tools/password-generator', description: 'Generate strong, secure passwords with customizable options.', icon: 'Key' },
      { id: 'qr-code-generator', name: 'QR Code Generator', path: '/dev-tools/qr-code-generator', description: 'Generate QR codes for text, URLs, contacts, and more.', icon: 'QrCode' },
      { id: 'json-formatter', name: 'JSON Formatter/Validator', path: '/dev-tools/json-formatter', description: 'Format, validate, minify, and convert JSON to CSV.', icon: 'Braces' },
      { id: 'html-encoder', name: 'HTML Encoder/Decoder', path: '/dev-tools/html-encoder', description: 'Encode and decode HTML entities safely.', icon: 'Code2' },
    ],
  },
  {
    id: 'date-time-tools',
    name: 'Date & Time Tools',
    icon: 'Calendar',
    tools: [
      { id: 'age-calculator', name: 'Age Calculator', path: '/date-time-tools/age-calculator', description: 'Calculate exact age in years, months, days with zodiac signs.', icon: 'Cake' },
      { id: 'date-difference', name: 'Date Difference Calculator', path: '/date-time-tools/date-difference', description: 'Calculate the duration between two dates in various units.', icon: 'CalendarRange' },
      { id: 'unix-timestamp', name: 'Unix Timestamp Converter', path: '/date-time-tools/unix-timestamp', description: 'Convert between Unix timestamps and human-readable dates.', icon: 'Timer' },
      { id: 'world-clock', name: 'World Clock & Timezone Converter', path: '/date-time-tools/world-clock', description: 'View current time worldwide and convert between timezones.', icon: 'Globe' },
    ],
  },
  {
    id: 'financial-tools',
    name: 'Financial Calculators',
    icon: 'Wallet',
    tools: [
      { id: 'percentage-calculator', name: 'Percentage Calculator', path: '/financial-tools/percentage-calculator', description: 'Calculate percentages, increases, decreases, and differences.', icon: 'Percent' },
      { id: 'discount-calculator', name: 'Discount Calculator', path: '/financial-tools/discount-calculator', description: 'Calculate discounts, savings, and final prices.', icon: 'Tag' },
      { id: 'tip-calculator', name: 'Tip Calculator', path: '/financial-tools/tip-calculator', description: 'Calculate tips and split bills between multiple people.', icon: 'DollarSign' },
      { id: 'loan-calculator', name: 'Loan/EMI Calculator', path: '/financial-tools/loan-calculator', description: 'Calculate monthly payments, total interest, and amortization schedules.', icon: 'Landmark' },
      { id: 'currency-converter', name: 'Currency Converter', path: '/financial-tools/currency-converter', description: 'Convert between world currencies with current exchange rates.', icon: 'RefreshCw' },
      { id: 'invoice-generator', name: 'Invoice Generator', path: '/financial-tools/invoice-generator', description: 'Create professional invoices with line items, tax, and totals — download as PDF.', icon: 'Receipt' },
    ],
  },
  {
    id: 'number-tools',
    name: 'Number & Math Tools',
    icon: 'Hash',
    tools: [
      { id: 'number-base-converter', name: 'Number Base Converter', path: '/number-tools/number-base-converter', description: 'Convert between binary, octal, decimal, and hexadecimal.', icon: 'Binary' },
      { id: 'roman-numeral', name: 'Roman Numeral Converter', path: '/number-tools/roman-numeral', description: 'Convert between numbers and Roman numerals (1-3999).', icon: 'Omega' },
      { id: 'fraction-decimal', name: 'Fraction/Decimal Converter', path: '/number-tools/fraction-decimal', description: 'Convert between fractions and decimals with simplification.', icon: 'Divide' },
    ],
  },
  {
    id: 'misc-tools',
    name: 'Miscellaneous',
    icon: 'Grid',
    tools: [
      { id: 'random-generator', name: 'Random Number Generator', path: '/misc-tools/random-generator', description: 'Generate random numbers with various options.', icon: 'Shuffle' },
      { id: 'bmi-calculator', name: 'BMI Calculator', path: '/misc-tools/bmi-calculator', description: 'Calculate Body Mass Index and ideal weight range.', icon: 'Heart' },
      { id: 'stopwatch-timer', name: 'Stopwatch & Timer', path: '/misc-tools/stopwatch-timer', description: 'Count up or count down with lap times and presets.', icon: 'Timer' },
    ],
  },
];

export const allTools = toolCategories.flatMap((c) => c.tools);

export function getToolByPath(path: string) {
  return allTools.find((t) => t.path === path);
}

export const popularTools = [
  'length-converter', 'weight-converter', 'temperature-converter', 'case-converter',
  'word-counter', 'color-converter', 'password-generator', 'qr-code-generator',
  'json-formatter', 'percentage-calculator', 'bmi-calculator', 'number-base-converter',
  'background-remover', 'video-to-gif', 'pdf-to-word', 'invoice-generator',
];
