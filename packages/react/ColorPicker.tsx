import React, { useState, useEffect, useRef } from 'react';
import { usePrefix } from './PrefixContext';
import { cn } from './cn';

export type ColorPickerVariant = 'swatches' | 'custom' | 'both';
export type ColorPickerSize = 'sm' | 'md' | 'lg';
export type ColorPickerColor =
  | 'rosewater'
  | 'flamingo'
  | 'pink'
  | 'mauve'
  | 'red'
  | 'maroon'
  | 'peach'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'sky'
  | 'sapphire'
  | 'blue'
  | 'lavender';

interface FlavorColors {
  rosewater: string;
  flamingo: string;
  pink: string;
  mauve: string;
  red: string;
  maroon: string;
  peach: string;
  yellow: string;
  green: string;
  teal: string;
  sky: string;
  sapphire: string;
  blue: string;
  lavender: string;
}

const flavorColors: Record<'latte' | 'frappe' | 'macchiato' | 'mocha', FlavorColors> = {
  latte: {
    rosewater: '#dc8a78',
    flamingo: '#dd7878',
    pink: '#ea76cb',
    mauve: '#8839ef',
    red: '#d20f39',
    maroon: '#e64553',
    peach: '#fe640b',
    yellow: '#df8e1d',
    green: '#40a02b',
    teal: '#179287',
    sky: '#04a5e5',
    sapphire: '#209fb5',
    blue: '#1e66f5',
    lavender: '#7287fd'
  },
  frappe: {
    rosewater: '#f2d5cf',
    flamingo: '#eebebe',
    pink: '#f4b8e4',
    mauve: '#ca9ee6',
    red: '#e78284',
    maroon: '#ea999c',
    peach: '#ef9f76',
    yellow: '#e5c890',
    green: '#a6d189',
    teal: '#81c8be',
    sky: '#99d1db',
    sapphire: '#85c1dc',
    blue: '#8caaee',
    lavender: '#babbf1'
  },
  macchiato: {
    rosewater: '#f4dbd6',
    flamingo: '#f0c6c6',
    pink: '#f5bde6',
    mauve: '#c6a0f6',
    red: '#ed8796',
    maroon: '#ee99a0',
    peach: '#f5a97f',
    yellow: '#eed49f',
    green: '#a6da95',
    teal: '#8bd5ca',
    sky: '#91d7e3',
    sapphire: '#7dc4e4',
    blue: '#8aadf4',
    lavender: '#b7bdf8'
  },
  mocha: {
    rosewater: '#f5e0dc',
    flamingo: '#f2cdcd',
    pink: '#f5c2e7',
    mauve: '#cba6f7',
    red: '#f38ba8',
    maroon: '#eba0ac',
    peach: '#fab387',
    yellow: '#f9e2af',
    green: '#a6e3a1',
    teal: '#94e2d5',
    sky: '#89dceb',
    sapphire: '#74c7ec',
    blue: '#89b4fa',
    lavender: '#b4befe'
  }
};

// Helper function to convert Hex to HSV
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let r = 0, g = 0, b = 0;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

// Helper function to convert HSV to Hex
function hsvToHex(h: number, s: number, v: number): string {
  const sat = s / 100;
  const val = v / 100;
  const c = val * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = val - c;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h <= 360) {
    r = c; g = 0; b = x;
  }
  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
  return `#${rHex}${gHex}${bHex}`;
}

export interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  flavor?: 'latte' | 'frappe' | 'macchiato' | 'mocha';
  variant?: ColorPickerVariant;
  size?: ColorPickerSize;
  color?: ColorPickerColor;
  showHexInput?: boolean;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  flavor = 'mocha',
  variant = 'both',
  size = 'md',
  color = 'mauve',
  showHexInput = true,
  className = '',
}) => {
  const prefix = usePrefix();
  const [localHex, setLocalHex] = useState(value);
  const [showPopover, setShowPopover] = useState(false);
  const [hsv, setHsv] = useState({ h: 280, s: 100, v: 100 });

  const popoverRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalHex(value);
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    if (hexRegex.test(value)) {
      setHsv(hexToHsv(value));
    }
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowPopover(false);
      }
    };
    if (showPopover) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showPopover]);

  const activeFlavorColors = flavorColors[flavor];

  const handleSwatchClick = (hexVal: string) => {
    const cleanHex = hexVal.toLowerCase();
    setLocalHex(cleanHex);
    onChange(cleanHex);
  };

  const handlePadChange = (e: MouseEvent | React.MouseEvent) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    const newS = Math.round(x * 100);
    const newV = Math.round((1 - y) * 100);
    
    const newHsv = { ...hsv, s: newS, v: newV };
    setHsv(newHsv);
    
    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    onChange(hex);
  };

  const handlePadMouseDown = (e: React.MouseEvent) => {
    handlePadChange(e);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      handlePadChange(moveEvent);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handlePadTouchChange = (e: TouchEvent | React.TouchEvent) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const touch = 'touches' in e ? e.touches[0] : (e as TouchEvent).touches[0];
    if (!touch) return;
    const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
    
    const newS = Math.round(x * 100);
    const newV = Math.round((1 - y) * 100);
    
    const newHsv = { ...hsv, s: newS, v: newV };
    setHsv(newHsv);
    
    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    onChange(hex);
  };

  const handlePadTouchStart = (e: React.TouchEvent) => {
    handlePadTouchChange(e);
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      handlePadTouchChange(moveEvent);
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleHueSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newH = parseInt(e.target.value);
    const newHsv = { ...hsv, h: newH };
    setHsv(newHsv);
    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    onChange(hex);
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let textVal = e.target.value;
    if (!textVal.startsWith('#')) {
      textVal = '#' + textVal;
    }
    textVal = textVal.substring(0, 7);
    setLocalHex(textVal);

    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    if (hexRegex.test(textVal)) {
      onChange(textVal.toLowerCase());
    }
  };

  const renderSwatches = () => {
    return (
      <div className={`${prefix}-colorpicker-swatches`}>
        {Object.entries(activeFlavorColors).map(([colorName, hexVal]) => {
          const isActive = value.toLowerCase() === hexVal.toLowerCase();
          return (
            <button
              key={colorName}
              type="button"
              className={`${prefix}-colorpicker-chip`}
              data-state={isActive ? 'active' : undefined}
              style={{ backgroundColor: hexVal }}
              onClick={() => handleSwatchClick(hexVal)}
              title={`${colorName.charAt(0).toUpperCase() + colorName.slice(1)} (${hexVal})`}
              aria-label={colorName}
              aria-pressed={isActive}
            />
          );
        })}
      </div>
    );
  };

  const renderCustomTrigger = () => {
    const hueColor = hsvToHex(hsv.h, 100, 100);

    return (
      <div className={`${prefix}-colorpicker-popover-wrapper`} ref={popoverRef}>
        <button
          type="button"
          className={`${prefix}-colorpicker-custom-trigger`}
          style={{ backgroundColor: value }}
          onClick={() => setShowPopover(!showPopover)}
          aria-label="Custom color spectrum picker"
          aria-expanded={showPopover}
        />
        
        {showPopover && (
          <div className={`${prefix}-colorpicker-popover`}>
            {/* SV Pad */}
            <div
              ref={padRef}
              className={`${prefix}-colorpicker-sv-pad`}
              style={{ backgroundColor: hueColor }}
              onMouseDown={handlePadMouseDown}
              onTouchStart={handlePadTouchStart}
            >
              <div className={`${prefix}-colorpicker-sv-gradient-s`} />
              <div className={`${prefix}-colorpicker-sv-gradient-v`} />
              <div
                className={`${prefix}-colorpicker-sv-marker`}
                style={{
                  left: `${hsv.s}%`,
                  top: `${100 - hsv.v}%`
                }}
              />
            </div>
            
            {/* Hue Slider */}
            <div className={`${prefix}-colorpicker-hue-container`}>
              <input
                type="range"
                min="0"
                max="360"
                value={hsv.h}
                onChange={handleHueSliderChange}
                className={`${prefix}-colorpicker-hue-slider`}
                aria-label="Hue spectrum selection"
              />
            </div>
            
            {/* Footer */}
            <div className={`${prefix}-colorpicker-popover-footer`}>
              <div
                className={`${prefix}-colorpicker-popover-preview`}
                style={{ backgroundColor: value }}
              />
              <span className={`${prefix}-colorpicker-popover-value`}>
                {value.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const containerClasses = cn(
    prefix,
    'colorpicker',
    [className],
  );

  return (
    <div className={containerClasses} data-size={size}>
      <div className={`${prefix}-colorpicker-row`}>
        {(variant === 'swatches' || variant === 'both') && renderSwatches()}
        {variant === 'both' && <div className={`${prefix}-colorpicker-divider`} />}
        {(variant === 'custom' || variant === 'both') && renderCustomTrigger()}

        {showHexInput && (
          <div className={`${prefix}-colorpicker-input-group`}>
            <span className={`${prefix}-colorpicker-input-prefix`}>#</span>
            <input
              type="text"
              className={`${prefix}-colorpicker-input`}
              value={localHex.replace('#', '').toUpperCase()}
              onChange={handleTextInputChange}
              placeholder="FFFFFF"
              aria-label="Hex color value"
            />
          </div>
        )}
      </div>
    </div>
  );
};

ColorPicker.displayName = 'ColorPicker';
