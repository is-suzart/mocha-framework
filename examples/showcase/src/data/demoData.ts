import type { StepItem } from '@mocha-ds/react';
import type { ButtonVariant, ButtonColor, ButtonSize, ButtonShape } from '@mocha-ds/react';
import type { FieldSchema, MultiSelectOption, TreeNode } from '@mocha-ds/react';

export const demoSteps: StepItem[] = [
  { label: 'Account', description: 'Configure profile credentials', icon: '👤' },
  { label: 'Address', description: 'Provide delivery destinations', icon: '📍' },
  { label: 'Payment', description: 'Authorize credit card processing', icon: '💳' },
  { label: 'Finish', description: 'Receipt and order verification', icon: '🎉' }
];

export const stepContents = [
  { title: '📦 Step 1: Account Information', details: 'Setup your standard developer account. Enter username, email, and configure multi-factor security rules.' },
  { title: '✉️ Step 2: Shipping Destination', details: 'Choose shipping locations. Specify residential addresses, zip codes, and pick logistics service providers.' },
  { title: '💳 Step 3: Payment Method', details: 'Complete transaction securely using global processing. Pay with Credit Card, PayPal, or crypto-assets.' },
  { title: '🎉 Step 4: System Confirmation', details: 'Your order was successfully transmitted. Check registered email for trackable delivery status notifications.' }
];

export interface GalleryItem {
  title: string;
  text: string;
  variant: ButtonVariant;
  color: ButtonColor;
  size: ButtonSize;
  shape: ButtonShape;
  isLoading: boolean;
  disabled: boolean;
  leftIcon: boolean;
  rightIcon: boolean;
}

export const galleryItems: GalleryItem[] = [
  { title: 'Primary Call-To-Action', text: 'Get Started', variant: 'filled', color: 'mauve', size: 'md', shape: 'rounded', isLoading: false, disabled: false, leftIcon: false, rightIcon: true },
  { title: 'Danger Alert', text: 'Delete Account', variant: 'filled', color: 'red', size: 'md', shape: 'rounded', isLoading: false, disabled: false, leftIcon: true, rightIcon: false },
  { title: 'Pill Accent Outline', text: 'Explore Flavors', variant: 'outline', color: 'blue', size: 'sm', shape: 'pill', isLoading: false, disabled: false, leftIcon: false, rightIcon: false },
  { title: 'Subtle Ghost Info', text: 'Learn More', variant: 'ghost', color: 'lavender', size: 'lg', shape: 'rounded', isLoading: false, disabled: false, leftIcon: false, rightIcon: false },
  { title: 'Loading Feedback', text: 'Uploading Files', variant: 'filled', color: 'green', size: 'md', shape: 'rounded', isLoading: true, disabled: false, leftIcon: false, rightIcon: false },
  { title: 'Disabled State', text: 'Locked Feature', variant: 'tonal', color: 'peach', size: 'md', shape: 'rounded', isLoading: false, disabled: true, leftIcon: false, rightIcon: false }
];

export const initialFormSchema: FieldSchema[] = [
  { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. John Doe', required: true, width: 50 },
  { id: 'emailAddress', label: 'Email Address', type: 'email', placeholder: 'john@catppuccin.com', required: true, width: 50 },
  { id: 'userRole', label: 'System Role', type: 'select', defaultValue: 'developer', options: [{ label: 'Software Developer', value: 'developer' }, { label: 'Product Manager', value: 'pm' }, { label: 'UX/UI Designer', value: 'designer' }], required: true, width: 33 },
  { id: 'experienceYears', label: 'Years of Experience', type: 'slider', defaultValue: 3, validation: { min: 0, max: 20 }, required: false, width: 50 },
  { id: 'skills', label: 'Preferred Stack Options', type: 'radio', defaultValue: 'react', options: [{ label: 'React.js', value: 'react' }, { label: 'Vue.js', value: 'vue' }, { label: 'Angular.js', value: 'angular' }], required: false, width: 100 },
  { id: 'termsChecked', label: 'Accept Cozy Guidelines', type: 'switch', defaultValue: false, required: true, placeholder: 'Agree to community terms of service', width: 100 },
  { id: 'specialRequests', label: 'Special Workspace Instructions', type: 'textarea', placeholder: 'Any extra hardware details...', required: false, width: 100 }
];

export const selectTechOptions: MultiSelectOption[] = [
  { label: 'React.js', value: 'react' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'Angular.js', value: 'angular' },
  { label: 'Svelte.js', value: 'svelte' },
  { label: 'Next.js', value: 'next' },
  { label: 'Nuxt.js', value: 'nuxt' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'JavaScript', value: 'js' },
  { label: 'Node.js', value: 'node' },
  { label: 'Rust', value: 'rust' }
];

export const selectTreeData: TreeNode[] = [
  {
    label: 'projeto-catppuccin',
    value: 'root',
    children: [
      {
        label: 'apps',
        value: 'apps',
        children: [
          { label: 'showcase', value: 'showcase' },
          { label: 'docs', value: 'docs' }
        ]
      },
      {
        label: 'packages',
        value: 'packages',
        children: [
          { label: 'react', value: 'react-pkg' },
          { label: 'css', value: 'css-pkg' },
          { label: 'vue', value: 'vue-pkg' }
        ]
      },
      {
        label: 'configuracoes',
        value: 'configs',
        children: [
          { label: 'package.json', value: 'package-json' },
          { label: 'tsconfig.json', value: 'tsconfig-json' }
        ]
      },
      { label: 'README.md', value: 'readme' }
    ]
  }
];

export const mockPorts = [
  { name: 'VS Code Theme', category: 'Editors', stars: '4.8k', developer: 'Catppuccin Org' },
  { name: 'Neovim Theme', category: 'Editors', stars: '3.5k', developer: 'catppuccin/nvim' },
  { name: 'Alacritty Theme', category: 'Terminals', stars: '1.2k', developer: 'alacritty-theme' },
  { name: 'Kitty Theme', category: 'Terminals', stars: '980', developer: 'kitty-theme' },
  { name: 'Tmux plugin', category: 'Utilities', stars: '1.4k', developer: 'tmux-plugins' },
  { name: 'Discord theme', category: 'Chat', stars: '2.1k', developer: 'discord-css' },
  { name: 'Slack theme', category: 'Chat', stars: '450', developer: 'slack-theme' },
  { name: 'Firefox theme', category: 'Browsers', stars: '1.6k', developer: 'firefox-gnome' },
  { name: 'Chrome theme', category: 'Browsers', stars: '820', developer: 'chrome-theme' },
  { name: 'Spicetify theme', category: 'Music', stars: '1.1k', developer: 'spicetify-themes' },
  { name: 'Windows Terminal theme', category: 'Terminals', stars: '750', developer: 'win-terminal' },
  { name: 'Zsh Syntax Highlighting', category: 'Terminals', stars: '2.3k', developer: 'zsh-users' },
  { name: 'Dunst theme', category: 'Desktop', stars: '310', developer: 'dunst-theme' },
  { name: 'Rofi theme', category: 'Desktop', stars: '640', developer: 'rofi-theme' },
  { name: 'Polybar theme', category: 'Desktop', stars: '520', developer: 'polybar-theme' },
  { name: 'i3wm theme', category: 'Desktop', stars: '890', developer: 'i3-theme' },
  { name: 'Sway theme', category: 'Desktop', stars: '430', developer: 'sway-theme' },
  { name: 'GitHub web theme', category: 'Websites', stars: '2.5k', developer: 'github-userstyles' },
  { name: 'YouTube web theme', category: 'Websites', stars: '1.8k', developer: 'youtube-css' },
  { name: 'Reddit web theme', category: 'Websites', stars: '920', developer: 'reddit-theme' },
  { name: 'Obsidian theme', category: 'Editors', stars: '1.5k', developer: 'obsidian-community' },
  { name: 'Emacs theme', category: 'Editors', stars: '410', developer: 'hl-todo' },
  { name: 'Helix editor theme', category: 'Editors', stars: '830', developer: 'helix-editor' },
  { name: 'GIMP theme', category: 'Creative', stars: '190', developer: 'gimp-theme' },
  { name: 'Inkscape theme', category: 'Creative', stars: '250', developer: 'inkscape-styles' },
  { name: 'Blender theme', category: 'Creative', stars: '670', developer: 'blender-addon' },
  { name: 'Steam skin', category: 'Gaming', stars: '1.3k', developer: 'steam-skin' },
  { name: 'Lutris theme', category: 'Gaming', stars: '320', developer: 'lutris-runners' },
  { name: 'RetroArch assets', category: 'Gaming', stars: '280', developer: 'retroarch-assets' },
  { name: 'KDE Plasma theme', category: 'Desktop', stars: '1.7k', developer: 'kde-plasma-theme' },
  { name: 'GNOME Shell styles', category: 'Desktop', stars: '1.9k', developer: 'gnome-shell-styles' },
  { name: 'GTK Themes pack', category: 'Desktop', stars: '2.2k', developer: 'gtk-themes' },
];
