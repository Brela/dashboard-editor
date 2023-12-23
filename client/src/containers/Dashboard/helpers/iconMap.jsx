//
// these aren't all of the icons from heroicons - we could add the rest to give user more options in 'add custom widget' modal
import {
  AdjustmentsHorizontalIcon as AdjustmentsHorizontal,
  ArchiveBoxArrowDownIcon as ArchiveBoxArrowDown,
  ArchiveBoxIcon as ArchiveBox,
  ArchiveBoxXMarkIcon as ArchiveBoxXMark,
  ArrowLeftOnRectangleIcon as ArrowLeftRectangle,
  ArrowPathIcon as ArrowPathLoop,
  ArrowRightOnRectangleIcon as ArrowRightRectangle,
  ArrowTrendingUpIcon as ArrowTrendingUp,
  BanknotesIcon as Banknotes,
  BarsArrowDownIcon as BarsArrowDown,
  BarsArrowUpIcon as BarsArrowUp,
  BeakerIcon as Beaker,
  BellAlertIcon as BellAlert,
  BoltIcon as Bolt,
  BookmarkIcon as Bookmark,
  BookmarkSlashIcon as BookmarkSlash,
  BriefcaseIcon as Briefcase,
  BugAntIcon as BugAnt,
  BuildingOffice2Icon as BuildingOffice2,
  BuildingOfficeIcon as BuildingOffice,
  CalendarDaysIcon as CalendarDays,
  CalendarIcon as Calendar,
  CalculatorIcon as Calculator,
  CheckBadgeIcon as CheckBadge,
  CheckIcon as CheckMark,
  ChartBarIcon as ChartBar,
  ChartPieIcon as ChartPie,
  ClockIcon as Clock,
  CloudIcon as Cloud,
  Cog6ToothIcon as Cog6Tooth,
  CreditCardIcon as CreditCard,
  CursorArrowRippleIcon as CursorArrowRipple,
  CurrencyDollarIcon as CurrencyDollar,
  CpuChipIcon as CpuChip,
  DocumentArrowUpIcon as DocumentArrowUp,
  DocumentCheckIcon as DocumentCheck,
  DocumentIcon as Document,
  EnvelopeIcon as Envelope,
  EnvelopeOpenIcon as EnvelopeOpen,
  ExclamationCircleIcon as ExclamationCircle,
  ExclamationTriangleIcon as ExclamationTriangle,
  KeyIcon as Key,
  ListBulletIcon as ListBullet,
  NoSymbolIcon as Ban,
  PaperClipIcon as PaperClip,
  PencilSquareIcon as PencilSquare,
  PlayIcon as Play,
  PlusIcon as Plus,
  PowerIcon as Power,
  PrinterIcon as Printer,
  ReceiptPercentIcon as ReceiptPercent,
  RectangleStackIcon as RectangleStack,
  SignalIcon as Signal,
  TicketIcon as Ticket,
  TrashIcon as Trash,
  TruckIcon as Truck,
  UserGroupIcon as UserGroup,
  UserMinusIcon as UserMinus,
  UserPlusIcon as UserPlus,
  VideoCameraIcon as VideoCamera,
  WalletIcon as Wallet,
  WrenchIcon as Wrench,
  XMarkIcon as XMark,
} from "@heroicons/react/24/outline";

// these MAPS are necessary for the icons to be used after pulling the icon name out of the database - since the icons themselves can't be stored

const ICON_MAP = {
  // Inventory
  RectangleStack, // cars in inventory
  ArrowPathLoop, // vehicles in prep
  VideoCamera, // in staging
  ArrowLeftRectangle, // pending check in
  ArrowRightRectangle, // pending Check Out
  Ticket, // open vehicle issues
  Truck, // in transit
  Play, // live inventory
  Key, // front line ready
  Signal, // active cars
  Wrench, // in prep

  // Finance
  ExclamationTriangle, // late invoices
  BarsArrowUp, // invoices owed
  BarsArrowDown, // invoices due
  Envelope, // paid invoices
  EnvelopeOpen, // unpaid invoices
  Banknotes, // total owed
  DocumentArrowUp, // pay reports owed

  // Tasks
  UserPlus, // tasks assigned
  Clock, // tasks due
  ExclamationCircle, // late tasks
  UserGroup, // tasks unassigned
  Ban, // blocked tasks
  Briefcase, // upcoming jobs

  Bolt, // Misc
  ArrowTrendingUp, // Line Chart
  ChartBar, // Bar Chart
  ChartPie, // Pie Chart

  // Extra icons for custom widget icon options,
  ArchiveBoxArrowDown,
  ArchiveBoxXMark,
  ArchiveBox,
  AdjustmentsHorizontal,
  Beaker,
  BellAlert,
  Bookmark,
  BookmarkSlash,
  BuildingOffice,
  BuildingOffice2,
  BugAnt,
  Calculator,
  Calendar,
  CalendarDays,
  CheckBadge,
  CheckMark,
  Cloud,
  Cog6Tooth,
  CpuChip,
  CreditCard,
  CurrencyDollar,
  CursorArrowRipple,
  Document,
  DocumentCheck,
  ListBullet,
  PaperClip,
  PencilSquare,
  Plus,
  Power,
  Printer,
  ReceiptPercent,
  Trash,
  UserMinus,
  Wallet,
  XMark,
};

// These iconOptions are for the "add cutom widget" icon selection field
const iconOptions = Object.keys(ICON_MAP).map((iconName) => {
  const IconComponent = ICON_MAP[iconName];
  return {
    value: iconName,
    label: (
      <div className="flex items-center gap-2 px-3">
        <IconComponent className="inline w-6 h-6 mr-2 text-gray-500" />
        {/* format the icon name */}
        {iconName
          .replace(/Icon$/, "")
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/^./, function (str) {
            return str.toUpperCase();
          })}
      </div>
    ),
  };
});
export { ICON_MAP, iconOptions };

// 'outlined' is preffered icon style

// if we want to use any of these, would have to make them 'outlined' instead of 'solid'
/* import {
  FaCar as Car,
  FaMoneyBill as MoneyBill,
  FaClipboardList as ClipboardList,
  FaTasks as Tasks,
  FaExclamation as Exclamation,
} from "react-icons/fa";
import {
  IoMdSpeedometer as Speedometer,
  IoMdAlert as Alert,
} from "react-icons/io"; */
