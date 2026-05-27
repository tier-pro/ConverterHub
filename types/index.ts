export type Theme = 'light' | 'dark';

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  tools: ToolItem[];
}

export interface ToolItem {
  id: string;
  name: string;
  path: string;
  description: string;
  icon: string;
}

export interface ConversionResult {
  value: number;
  unit: string;
  formula: string;
}

export interface UnitConfig {
  label: string;
  value: string;
  symbol: string;
}

export type LengthUnit = 'millimeter' | 'centimeter' | 'meter' | 'kilometer' | 'inch' | 'foot' | 'yard' | 'mile' | 'nautical-mile';
export type WeightUnit = 'milligram' | 'gram' | 'kilogram' | 'metric-ton' | 'ounce' | 'pound' | 'stone' | 'us-ton';
export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';
export type AreaUnit = 'sq-mm' | 'sq-cm' | 'sq-m' | 'sq-km' | 'sq-in' | 'sq-ft' | 'sq-yd' | 'acre' | 'hectare' | 'sq-mile';
export type VolumeUnit = 'milliliter' | 'liter' | 'cubic-meter' | 'gallon-us' | 'gallon-uk' | 'quart' | 'pint' | 'cup' | 'fluid-ounce' | 'tablespoon' | 'teaspoon';
export type SpeedUnit = 'mps' | 'kmph' | 'mph' | 'fps' | 'knot';
export type TimeUnit = 'nanosecond' | 'microsecond' | 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' | 'decade' | 'century';
export type DataUnit = 'bit' | 'byte' | 'kilobyte' | 'kibibyte' | 'megabyte' | 'mebibyte' | 'gigabyte' | 'gibibyte' | 'terabyte' | 'tebibyte' | 'petabyte' | 'pebibyte';
export type NumberBase = 'binary' | 'octal' | 'decimal' | 'hexadecimal';
export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'bmp' | 'gif';
