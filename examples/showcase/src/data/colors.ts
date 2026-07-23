export interface ColorInfo {
  name: string;
  variable: string;
  hexCodes: {
    macchiato: string;
    mocha: string;
    frappe: string;
    latte: string;
    vercel: string;
    'vercel-light': string;
  };
}

export type Theme = 'macchiato' | 'mocha' | 'frappe' | 'latte' | 'vercel' | 'vercel-light';

export const colors: ColorInfo[] = [
  { name: 'Rosewater', variable: '--ctp-rosewater', hexCodes: { macchiato: '#f4dbd6', mocha: '#f5e0dc', frappe: '#f2d5cf', latte: '#dc8a78', vercel: '#f5e0dc', 'vercel-light': '#dc8a78' } },
  { name: 'Flamingo', variable: '--ctp-flamingo', hexCodes: { macchiato: '#f0c6c6', mocha: '#f2cdcd', frappe: '#eebebe', latte: '#dd7878', vercel: '#f2cdcd', 'vercel-light': '#dd7878' } },
  { name: 'Pink', variable: '--ctp-pink', hexCodes: { macchiato: '#f5bde6', mocha: '#f5c2e7', frappe: '#f4b8e4', latte: '#ea76cb', vercel: '#f5c2e7', 'vercel-light': '#ea76cb' } },
  { name: 'Mauve', variable: '--ctp-mauve', hexCodes: { macchiato: '#c6a0f6', mocha: '#cba6f7', frappe: '#ca9ee6', latte: '#8839ef', vercel: '#cba6f7', 'vercel-light': '#8839ef' } },
  { name: 'Red', variable: '--ctp-red', hexCodes: { macchiato: '#ed8796', mocha: '#f38ba8', frappe: '#e78284', latte: '#d20f39', vercel: '#ee0000', 'vercel-light': '#ee0000' } },
  { name: 'Maroon', variable: '--ctp-maroon', hexCodes: { macchiato: '#ee99a0', mocha: '#eba0ac', frappe: '#ea999c', latte: '#e64553', vercel: '#ee0000', 'vercel-light': '#ee0000' } },
  { name: 'Peach', variable: '--ctp-peach', hexCodes: { macchiato: '#f5a97f', mocha: '#fab387', frappe: '#ef9f76', latte: '#fe640b', vercel: '#f5a623', 'vercel-light': '#f5a623' } },
  { name: 'Yellow', variable: '--ctp-yellow', hexCodes: { macchiato: '#eed49f', mocha: '#f9e2af', frappe: '#e5c890', latte: '#df8e1d', vercel: '#f5a623', 'vercel-light': '#f5a623' } },
  { name: 'Green', variable: '--ctp-green', hexCodes: { macchiato: '#a6da95', mocha: '#a6e3a1', frappe: '#a6d189', latte: '#40a02b', vercel: '#50e3c2', 'vercel-light': '#007a22' } },
  { name: 'Teal', variable: '--ctp-teal', hexCodes: { macchiato: '#8bd5ca', mocha: '#94e2d5', frappe: '#81c8be', latte: '#179287', vercel: '#50e3c2', 'vercel-light': '#007a22' } },
  { name: 'Sky', variable: '--ctp-sky', hexCodes: { macchiato: '#91d7e3', mocha: '#89dceb', frappe: '#99d1db', latte: '#04a5e5', vercel: '#89dceb', 'vercel-light': '#04a5e5' } },
  { name: 'Sapphire', variable: '--ctp-sapphire', hexCodes: { macchiato: '#7dc4e4', mocha: '#74c7ec', frappe: '#85c1dc', latte: '#209fb5', vercel: '#74c7ec', 'vercel-light': '#209fb5' } },
  { name: 'Blue', variable: '--ctp-blue', hexCodes: { macchiato: '#8aadf4', mocha: '#89b4fa', frappe: '#8caaee', latte: '#1e66f5', vercel: '#89b4fa', 'vercel-light': '#1e66f5' } },
  { name: 'Lavender', variable: '--ctp-lavender', hexCodes: { macchiato: '#b7bdf8', mocha: '#b4befe', frappe: '#babbf1', latte: '#7287fd', vercel: '#b4befe', 'vercel-light': '#7287fd' } },
  { name: 'Primary', variable: '--ctp-primary', hexCodes: { macchiato: '#c6a0f6', mocha: '#cba6f7', frappe: '#ca9ee6', latte: '#8839ef', vercel: '#ffffff', 'vercel-light': '#000000' } },
  { name: 'Secondary', variable: '--ctp-secondary', hexCodes: { macchiato: '#b7bdf8', mocha: '#b4befe', frappe: '#babbf1', latte: '#7287fd', vercel: '#444444', 'vercel-light': '#999999' } },
  { name: 'Success', variable: '--ctp-success', hexCodes: { macchiato: '#a6da95', mocha: '#a6e3a1', frappe: '#a6d189', latte: '#40a02b', vercel: '#50e3c2', 'vercel-light': '#007a22' } },
  { name: 'Warning', variable: '--ctp-warning', hexCodes: { macchiato: '#eed49f', mocha: '#f9e2af', frappe: '#e5c890', latte: '#df8e1d', vercel: '#f5a623', 'vercel-light': '#f5a623' } },
  { name: 'Danger', variable: '--ctp-danger', hexCodes: { macchiato: '#ed8796', mocha: '#f38ba8', frappe: '#e78284', latte: '#d20f39', vercel: '#ee0000', 'vercel-light': '#ee0000' } },
  { name: 'Info', variable: '--ctp-info', hexCodes: { macchiato: '#91d7e3', mocha: '#89dceb', frappe: '#99d1db', latte: '#04a5e5', vercel: '#50e3c2', 'vercel-light': '#007a22' } },
];
