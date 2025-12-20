import React from 'react';

const iconProps = {
  className: "h-5 w-5",
  strokeWidth: "2",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as "round",
  strokeLinejoin: "round" as "round"
};

export const DashboardIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
export const RosterIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
export const ScheduleIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
export const FinanceIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
export const AiPlaybookIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>;
export const PracticeIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
export const VideoIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>;
export const WhistleIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"></path><path d="M12 12h5"></path></svg>;
export const TrophyIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><path d="M8 21h8m-4-9v9m-8-3h16M6 4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V4z"></path></svg>;
export const ShopIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>;
export const FlagIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>;
export const MegaphoneIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><path d="M3 11l18-5v12L3 14v-3z"></path><path d="M11.6 16.8L3 21v-3"></path></svg>;
export const BriefcaseIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
export const AcademyIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>;
export const TargetIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
export const SettingsNavIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
export const StarIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
export const GlobeIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
export const FootballIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6"></ellipse><path d="M12 6v12"></path><path d="M8 8v8"></path><path d="M16 8v8"></path></svg>;
export const BookIcon = (props: any) => <svg {...iconProps} {...props} viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;

// Fix: Added missing TicketIcon export to resolve errors in Commercial.tsx and EventDesk.tsx
export const TicketIcon = (props: any) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24">
    <path d="M3 6h18"></path>
    <path d="M3 18h18"></path>
    <path d="M19 6v12"></path>
    <path d="M5 6v12"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);