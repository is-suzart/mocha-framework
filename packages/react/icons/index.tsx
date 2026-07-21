import React from 'react';
import {
  Cat,
  PawPrint,
  Disc,
  Coffee,
  Laptop,
  Fish,
  Mouse,
  Moon,
  Sun,
  Cloud,
  Sparkles,
  Home,
  Settings,
  User,
  Bell,
  Search,
  Folder,
  FileText,
  Code,
  Heart,
  Star,
  Trash2,
  Calendar,
  MessageSquare,
  Shield,
  Info,
  Check,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Plug,
  Database,
  Network,
  GitBranch,
  Globe,
  RefreshCw,
  Puzzle,
  Link,
  Link2Off,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  MoreHorizontal,
  Menu,
  X,
  Plus,
  Minus,
  Edit3,
  Copy,
  Clipboard,
  Save,
  Download,
  Upload,
  Filter,
  ArrowUpDown,
  Eye,
  EyeOff,
  CupSoda,
  Wand2,
  Ghost,
  LucideIcon
} from 'lucide-react';
import { IconProps, resolveIconColor } from './IconProps';

export * from './IconProps';

// Higher-order component to wrap any Lucide icon and add Catppuccin color support
const createIcon = (LucideComponent: LucideIcon, name: string) => {
  const WrappedIcon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ size = 24, color = 'currentColor', strokeWidth = 2, ...props }, ref) => {
      const resolvedColor = resolveIconColor(color);
      return (
        <LucideComponent
          ref={ref as any}
          size={size}
          color={resolvedColor}
          strokeWidth={strokeWidth}
          {...props}
        />
      );
    }
  );
  WrappedIcon.displayName = name;
  return WrappedIcon;
};

// Batch 1: Cozy Icons
export const CatIcon = createIcon(Cat, 'CatIcon');
export const PawIcon = createIcon(PawPrint, 'PawIcon');
export const YarnIcon = createIcon(Disc, 'YarnIcon');
export const CupIcon = createIcon(Coffee, 'CupIcon');
export const LaptopIcon = createIcon(Laptop, 'LaptopIcon');
export const FishIcon = createIcon(Fish, 'FishIcon');
export const MouseIcon = createIcon(Mouse, 'MouseIcon');
export const MoonIcon = createIcon(Moon, 'MoonIcon');
export const SunIcon = createIcon(Sun, 'SunIcon');
export const CloudIcon = createIcon(Cloud, 'CloudIcon');
export const SparklesIcon = createIcon(Sparkles, 'SparklesIcon');
export const HomeIcon = createIcon(Home, 'HomeIcon');
export const SettingsIcon = createIcon(Settings, 'SettingsIcon');
export const UserIcon = createIcon(User, 'UserIcon');
export const BellIcon = createIcon(Bell, 'BellIcon');
export const SearchIcon = createIcon(Search, 'SearchIcon');
export const FolderIcon = createIcon(Folder, 'FolderIcon');
export const DocumentIcon = createIcon(FileText, 'DocumentIcon');
export const CodeIcon = createIcon(Code, 'CodeIcon');
export const HeartIcon = createIcon(Heart, 'HeartIcon');
export const StarIcon = createIcon(Star, 'StarIcon');
export const TrashIcon = createIcon(Trash2, 'TrashIcon');
export const CalendarIcon = createIcon(Calendar, 'CalendarIcon');
export const ChatIcon = createIcon(MessageSquare, 'ChatIcon');
export const ShieldIcon = createIcon(Shield, 'ShieldIcon');
export const InfoIcon = createIcon(Info, 'InfoIcon');
export const CheckIcon = createIcon(Check, 'CheckIcon');
export const AlertIcon = createIcon(AlertTriangle, 'AlertIcon');
export const HelpIcon = createIcon(HelpCircle, 'HelpIcon');
export const ExternalLinkIcon = createIcon(ExternalLink, 'ExternalLinkIcon');

// Batch 2: Connectivity & Data
export const PlugIcon = createIcon(Plug, 'PlugIcon');
export const DatabaseIcon = createIcon(Database, 'DatabaseIcon');
export const NodeIcon = createIcon(Network, 'NodeIcon');
export const WorkflowIcon = createIcon(GitBranch, 'WorkflowIcon');
export const GlobeIcon = createIcon(Globe, 'GlobeIcon');
export const SyncIcon = createIcon(RefreshCw, 'SyncIcon');
export const PuzzleIcon = createIcon(Puzzle, 'PuzzleIcon');
export const LinkIcon = createIcon(Link, 'LinkIcon');
export const UnlinkIcon = createIcon(Link2Off, 'UnlinkIcon');

// Batch 3: Directionals & Layout
export const ChevronUpIcon = createIcon(ChevronUp, 'ChevronUpIcon');
export const ChevronDownIcon = createIcon(ChevronDown, 'ChevronDownIcon');
export const ChevronLeftIcon = createIcon(ChevronLeft, 'ChevronLeftIcon');
export const ChevronRightIcon = createIcon(ChevronRight, 'ChevronRightIcon');
export const ArrowUpIcon = createIcon(ArrowUp, 'ArrowUpIcon');
export const ArrowDownIcon = createIcon(ArrowDown, 'ArrowDownIcon');
export const ArrowLeftIcon = createIcon(ArrowLeft, 'ArrowLeftIcon');
export const ArrowRightIcon = createIcon(ArrowRight, 'ArrowRightIcon');
export const MoreVerticalIcon = createIcon(MoreVertical, 'MoreVerticalIcon');
export const MoreHorizontalIcon = createIcon(MoreHorizontal, 'MoreHorizontalIcon');
export const MenuIcon = createIcon(Menu, 'MenuIcon');
export const CloseIcon = createIcon(X, 'CloseIcon');
export const PlusIcon = createIcon(Plus, 'PlusIcon');
export const MinusIcon = createIcon(Minus, 'MinusIcon');

// Batch 4: CRUD Actions
export const EditIcon = createIcon(Edit3, 'EditIcon');
export const CopyIcon = createIcon(Copy, 'CopyIcon');
export const PasteIcon = createIcon(Clipboard, 'PasteIcon');
export const SaveIcon = createIcon(Save, 'SaveIcon');
export const DownloadIcon = createIcon(Download, 'DownloadIcon');
export const UploadIcon = createIcon(Upload, 'UploadIcon');
export const FilterIcon = createIcon(Filter, 'FilterIcon');
export const SortIcon = createIcon(ArrowUpDown, 'SortIcon');
export const EyeIcon = createIcon(Eye, 'EyeIcon');
export const EyeOffIcon = createIcon(EyeOff, 'EyeOffIcon');

// Batch 5: Catppuccin Soul
export const BobaIcon = createIcon(CupSoda, 'BobaIcon');
export const MagicWandIcon = createIcon(Wand2, 'MagicWandIcon');
export const GhostIcon = createIcon(Ghost, 'GhostIcon');
