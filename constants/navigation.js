// constants/navigation.js
import { 
  MdDashboard, MdSchool, MdPeople, MdAccessTime, MdAttachMoney, 
  MdAccountBalanceWallet, MdAccountBalance, MdBarChart, MdWidgets, 
  MdEmail, MdEventNote, MdShoppingBasket, MdDomain, MdCalendarToday, 
  MdSentimentSatisfied, MdNearMe, MdMenuBook, MdPlayArrow, MdLayers, 
  MdBusinessCenter, MdTrendingDown, MdVpnKey, MdSettings, MdLanguage
} from 'react-icons/md';

export const NAVIGATION = [
  {
    label: 'Dashboard',
    icon: MdDashboard,
    href: '/dashboard',
  },
  {
    label: 'Student',
    icon: MdSchool,
    href: '#',
    subItems: [
      {
        label: 'Student Data', // এটি 2nd level
        href: '#',
        subItems: [ // এটি 3rd level (Sub-item এর sub-item)
          { label: 'Active Students', href: '/students' },
          { label: 'Inactive Students', href: '/students/inactive' },
        ]
      },
      { label: 'Admission', href: '/students/admission' },
      { label: 'Student Update', href: '/students/update' },
      { label: 'Disciplinary Action', href: '/students/action' },
      { label: 'Scholarship', href: '/students/scholarship' },
      { label: 'Report', href: '/students/report' },
    ],
  },
  {
    label: 'Teacher / Staff',
    icon: MdPeople,
    href: '#',
    subItems: [
      { label: 'List', href: '/teachers' },
      { label: 'Add New', href: '/teachers/add' },
      { label: 'Attendance Report', href: '/teachers/report' },
    ],
  },
  {
    label: 'Attendance',
    icon: MdAccessTime,
    href: '#',
    subItems: [
      { label: 'Student Attendance', href: '/attendance/students' },
      { label: 'Teacher Attendance', href: '/attendance/teachers' },
    ],
  },
  {
    label: 'Student Fees',
    icon: MdAttachMoney,
    href: '#',
    subItems: [
      { label: 'Collect Fee', href: '/fees/collect' },
      { label: 'Fee Report', href: '/fees/report' },
    ],
  },
  {
    label: 'Payroll',
    icon: MdAccountBalanceWallet,
    href: '/payroll',
  },
  {
    label: 'Basic Accounts',
    icon: MdAccountBalance,
    href: '/accounts',
  },
  {
    label: 'Result',
    icon: MdBarChart,
    href: '#',
    subItems: [
      { label: 'Tabulation Sheet', href: '/results' },
      { label: 'Mark Input', href: '/results/add' },
    ],
  },
  {
    label: 'Accessories',
    icon: MdWidgets,
    href: '/accessories',
  },
  {
    label: 'SMS',
    icon: MdEmail,
    href: '/sms',
  },
  {
    label: 'Routine',
    icon: MdEventNote,
    href: '/routine',
  },
  {
    label: 'Inventory',
    icon: MdShoppingBasket,
    href: '/inventory',
  },
  {
    label: 'Hostel',
    icon: MdDomain,
    href: '/hostel',
  },
  {
    label: 'Notebook',
    icon: MdCalendarToday,
    href: '/notebook',
  },
  {
    label: 'Call Center',
    icon: MdSentimentSatisfied,
    href: '/call-center',
  },
  {
    label: 'Self Service',
    icon: MdNearMe,
    href: '/self-service',
  },
  {
    label: 'Library',
    icon: MdMenuBook,
    href: '/library',
  },
  {
    label: 'Video Classes',
    icon: MdPlayArrow,
    href: '/video-classes',
  },
  {
    label: 'Donation Book',
    icon: MdLayers,
    href: '/donation-book',
  },
  {
    label: 'Career',
    icon: MdBusinessCenter,
    href: '/career',
  },
  {
    label: 'Inspection',
    icon: MdTrendingDown,
    href: '/inspection',
  },
  {
    label: 'Security',
    icon: MdVpnKey,
    href: '/security',
  },
  
  // আপনার ছবি (nav 2.PNG) অনুযায়ী হুবহু Configuration
  {
    label: 'Configuration',
    icon: MdSettings,
    href: '#',
    subItems: [
      { 
        label: 'User Management', 
        href: '#',
        subItems: [
          { label: 'User Information', href: '/config/users' },
          { label: 'User Batch Add', href: '/config/users/batch-add' },
          { label: 'Student User', href: '/config/users/students' },
          { label: 'User Roles', href: '/config/users/roles' },
          { label: 'Change Password', href: '/config/users/password' },
        ]
      },
      { 
        label: 'Basic Settings', 
        href: '#',
        subItems: [
          {
            label: 'Academic',
            href: '#',
            subItems: [
              { label: 'Institute Information', href: '/config/settings/basic/institute' },
              { label: 'Branch', href: '/config/settings/basic/branch' },
              { label: 'Data Copy', href: '/config/settings/basic/data-copy' },
              { label: 'Student ID Configuration', href: '/config/settings/basic/student-id' },
              { label: 'Class', href: '/config/settings/basic/classes' },
              { label: 'Section', href: '/config/settings/basic/section' },
              { label: 'Faculty', href: '/config/settings/basic/faculty' },
              { label: 'Group', href: '/config/settings/basic/group' },
              { label: 'Student Category', href: '/config/settings/basic/student-category' },
              { label: 'Shift', href: '/config/settings/basic/shift' },
              { label: 'Subject', href: '/config/settings/basic/subject' },
              { label: 'Room No', href: '/config/settings/basic/room' },
              { label: 'Semester', href: '/config/settings/basic/semester' },
              { label: 'Term', href: '/config/settings/basic/term' },
              { label: 'Main Marking Head', href: '/config/settings/basic/main-marking-head' },
              { label: 'Grade Point Configuration', href: '/config/settings/basic/grade-point-calculation' },
              { label: 'Session', href: '/config/settings/basic/session' },
              { label: 'Route', href: '/config/settings/basic/route' },
            ]
          },
          { 
            label: 'Mapping', 
            href: '#',
            subItems: [
              { label: 'Class Section Mapping', href: '/config/settings/basic/mapping/class-section' },
              { label: 'Class Group Mapping', href: '/config/settings/basic/mapping/class-group' },
              { label: 'Class Subject Mapping', href: '/config/settings/basic/mapping/class-subject' },
              { label: 'Class Year Month Mapping', href: '/config/settings/basic/mapping/class-year-month' },
              { label: 'Class Semester Mapping', href: '/config/settings/basic/mapping/class-semester' },
              { label: 'Class Wise Config', href: '/config/settings/basic/mapping/class-wise-config' },
            ]
          },
          { 
            label: 'Regioanl Data', // স্ক্রিনশটের বানান অনুযায়ী
            href: '#',
            subItems: [
              { label: 'District', href: '/config/settings/basic/regional/district' },
              { label: 'Upazila List', href: '/config/settings/basic/regional/upazila' },
              { label: 'Post Office', href: '/config/settings/basic/regional/post-office' },
            ]
          }
        ]
      },
      { 
        label: 'General Settings', 
        href: '#',
        subItems: [
          {
            label: 'General Settings',
            href: '#',
            subItems: [
              { label: 'Global Configuration', href: '/config/settings/general/global-config' },
              { label: 'General Configuration', href: '/config/settings/general/general-config' },
              { label: 'Class Wise Config', href: '/config/settings/general/class-wise-config' },
              { label: 'Co-curricular Activities', href: '/config/settings/general/co-curricular' },
              { label: 'Moral Behaviors', href: '/config/settings/general/moral-behaviors' },
              { label: 'Occupations', href: '/config/settings/general/occupations' },
              { label: 'Board', href: '/config/settings/general/board' },
              { label: 'Accessories Template', href: '/config/settings/general/accessories-template' },
            ]
          },
          { 
            label: 'Design', 
            href: '#',
            subItems: [
              { label: 'Template Settings', href: '/config/settings/general/design/template' },
              { label: 'Marksheet Design', href: '/config/settings/general/design/marksheet' },
              { label: 'Admit Card Design', href: '/config/settings/general/design/admit-card' },
              { label: 'Seat Plan Design', href: '/config/settings/general/design/seat-plan' },
              { label: 'Student ID Card Configuration', href: '/config/settings/general/design/student-id' },
              { label: 'Teacher ID Card Configuration', href: '/config/settings/general/design/teacher-id' },
              { label: 'Pad Configuration', href: '/config/settings/general/design/pad' },
            ]
          },
          { 
            label: 'Signature', 
            href: '#',
            subItems: [
              { label: 'Signature', href: '/config/settings/general/signature/main' },
              { label: 'Class Wise Signature', href: '/config/settings/general/signature/class-wise' },
              { label: 'Subject Wise Signature', href: '/config/settings/general/signature/subject-wise' },
            ]
          },
          { 
            label: 'Student Fees', 
            href: '#',
            subItems: [
              { label: 'User Wise Asset Head', href: '/config/settings/general/fees/user-asset-head' },
              { label: 'Online Payment Setup', href: '/config/settings/general/fees/online-payment' },
              { label: 'Payslip Settings', href: '/config/settings/general/fees/payslip' },
              { label: 'Waiver Settings', href: '/config/settings/general/fees/waiver' },
            ]
          }
        ]
      }
    ],
  },
  
  // আপনার ছবি (nav 3.PNG) অনুযায়ী হুবহু Website & Admission
  {
    label: 'Website & Admission',
    icon: MdLanguage,
    href: '#',
    subItems: [
      { label: 'Settings', href: '/website/settings' },
      { label: 'Admission', href: '/website/admission' },
      { label: 'Alumni', href: '/website/alumni' },
      { label: 'Website', href: '/website/portal' }, // Button হিসেবে লিংকে যাবে
    ],
  },
];