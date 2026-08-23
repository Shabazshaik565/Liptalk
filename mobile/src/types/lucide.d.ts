import 'lucide-react-native';

declare module 'lucide-react-native' {
  import { FC, ReactNode } from 'react';
  import { SvgProps } from 'react-native-svg';

  export interface LucideProps extends SvgProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    children?: ReactNode;
  }

  export type LucideIcon = FC<LucideProps>;

  export const Home: LucideIcon;
  export const Users: LucideIcon;
  export const Briefcase: LucideIcon;
  export const Handshake: LucideIcon;
  export const User: LucideIcon;
  export const Compass: LucideIcon;
  export const Sparkles: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCheck: LucideIcon;
  export const X: LucideIcon;
  export const Repeat: LucideIcon;
  export const MapPin: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Zap: LucideIcon;
  export const Search: LucideIcon;
  export const Filter: LucideIcon;
  export const UserCheck: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Building: LucideIcon;
  export const Building2: LucideIcon;
  export const Calendar: LucideIcon;
  export const IndianRupee: LucideIcon;
  export const DollarSign: LucideIcon;
  export const FileText: LucideIcon;
  export const Tag: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Copy: LucideIcon;
  export const Bell: LucideIcon;
  export const Mail: LucideIcon;
  export const Lock: LucideIcon;
  export const Phone: LucideIcon;
  export const Globe: LucideIcon;
  export const Layers: LucideIcon;
  export const Clock: LucideIcon;
  export const Plus: LucideIcon;
  export const Send: LucideIcon;
  export const Award: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const Gift: LucideIcon;
  export const LogOut: LucideIcon;
}
