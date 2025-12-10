
import React from 'react';

const iconProps = {
  className: "h-6 w-6",
  strokeWidth: "2",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as "round",
  strokeLinejoin: "round" as "round"
};

export const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} className="h-5 w-5" {...props} viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
);

export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export const WifiIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
        <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
    </svg>
);

export const WifiOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24">
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
    </svg>
);

export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

export const BankIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export const PlayCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="10 8 16 12 10 16 10 8"></polygon>
  </svg>
);

export const MedicalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

export const DumbbellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M6.5 6.5l11 11"></path>
    <path d="M21 21l-1-1"></path>
    <path d="M3 3l1 1"></path>
    <path d="M18 22l-3-3 3-3"></path>
    <path d="M22 18l-3 3-3-3"></path>
    <path d="M6 2l3 3-3 3"></path>
    <path d="M2 6l3-3 3 3"></path>
  </svg>
);

export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
  </svg>
);

export const AlertCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
  </svg>
);

export const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export const PrinterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export const PauseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

export const StopIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <rect x="6" y="6" width="12" height="12"></rect>
  </svg>
);

export const ScissorsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <circle cx="6" cy="6" r="3"></circle>
    <circle cx="6" cy="18" r="3"></circle>
    <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
    <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
    <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
  </svg>
);

export const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export const LocationIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export const PenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
    <path d="M2 2l7.586 7.586"></path>
    <circle cx="11" cy="11" r="2"></circle>
  </svg>
);

export const EraserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z"></path>
    <path d="M17 17L7 7"></path>
  </svg>
);

export const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

export const GavelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M14 13l-9.5 9.5 9.5-9.5z"></path>
    <path d="M6.5 13.5L3 17l4 4 3.5-3.5"></path>
    <path d="M9 7l6-6 8 8-6 6"></path>
    <path d="M21 16l-5 5"></path>
  </svg>
);

export const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="9" y1="22" x2="9" y2="22"></line>
    <line x1="15" y1="22" x2="15" y2="22"></line>
    <line x1="12" y1="22" x2="12" y2="22"></line>
    <line x1="12" y1="2" x2="12" y2="2"></line>
    <line x1="4" y1="10" x2="20" y2="10"></line>
    <line x1="4" y1="14" x2="20" y2="14"></line>
    <line x1="4" y1="18" x2="20" y2="18"></line>
  </svg>
);

export const MapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
    <line x1="8" y1="2" x2="8" y2="18"></line>
    <line x1="16" y1="6" x2="16" y2="22"></line>
  </svg>
);

export const SwapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <polyline points="16 3 21 3 21 8"></polyline>
    <line x1="4" y1="20" x2="21" y2="3"></line>
    <polyline points="21 16 21 21 16 21"></polyline>
    <line x1="15" y1="15" x2="21" y2="21"></line>
    <line x1="4" y1="4" x2="9" y2="9"></line>
  </svg>
);

export const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

export const QrcodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

export const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export const MessageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

export const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

export const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

export const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export const MicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

export const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export const ActivityIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

export const KeyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
);

export const BrainIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
  </svg>
);

export const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);
