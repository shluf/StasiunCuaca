import type { InputHTMLAttributes } from 'react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  onChange,
  label,
  showValue = true,
  formatValue,
  className,
  disabled,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || min);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
              {displayValue}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={clsx(
            'w-full h-2 rounded-lg appearance-none cursor-pointer',
            'bg-gray-200 dark:bg-gray-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            // Thumb styles
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-4',
            '[&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-sky-500',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:hover:bg-sky-600',
            '[&::-webkit-slider-thumb]:active:scale-110',
            '[&::-webkit-slider-thumb]:transition-all',
            // Firefox thumb styles
            '[&::-moz-range-thumb]:w-4',
            '[&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-sky-500',
            '[&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:shadow-md',
            '[&::-moz-range-thumb]:hover:bg-sky-600'
          )}
          style={{
            background: `linear-gradient(to right, rgb(14 165 233) 0%, rgb(14 165 233) ${percentage}%, rgb(229 231 235) ${percentage}%, rgb(229 231 235) 100%)`,
          }}
          {...props}
        />
      </div>

      {/* Optional min/max labels */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatValue ? formatValue(min) : min}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatValue ? formatValue(max) : max}
        </span>
      </div>
    </div>
  );
}

// Range slider for selecting min/max values
export interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  values?: [number, number];
  onChange?: (values: [number, number]) => void;
  label?: string;
  formatValue?: (value: number) => string;
}

export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  values = [min, max],
  onChange,
  label,
  formatValue,
}: RangeSliderProps) {
  const [minValue, maxValue] = values;

  const handleMinChange = (newMin: number) => {
    const validMin = Math.min(newMin, maxValue - step);
    onChange?.([validMin, maxValue]);
  };

  const handleMaxChange = (newMax: number) => {
    const validMax = Math.max(newMax, minValue + step);
    onChange?.([minValue, validMax]);
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <Slider
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
        label="Min"
        formatValue={formatValue}
      />

      <Slider
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
        label="Max"
        formatValue={formatValue}
      />

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Range: {formatValue ? formatValue(minValue) : minValue} - {formatValue ? formatValue(maxValue) : maxValue}
      </div>
    </div>
  );
}
