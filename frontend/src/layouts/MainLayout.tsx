import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutGrid,
  User,
  Calendar,
  UserPlus,
  DoorClosed,
  CheckCircle2,
  Banknote,
  IndianRupee,
  CreditCard,
  Layers,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import zellaLogo from '../assets/zella_logo.png';
import zellaIcon from '../assets/zella_icon.png';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
  { name: 'Enquiries', path: '/enquiries', icon: User },
  { name: 'Booking', path: '/bookings', icon: Calendar },
  { name: 'Admission', path: '/admissions', icon: UserPlus },
  { name: 'Rooms', path: '/rooms', icon: DoorClosed },
  { name: 'Attendance', path: '/attendance', icon: CheckCircle2 },
  { name: 'Rent List', path: '/guests', icon: Banknote },
  { name: 'Receipt', path: '/fee-receipts', icon: IndianRupee },
  { name: 'Accounts', path: '/accounts', icon: CreditCard },
  { name: 'Others', path: '/others', icon: Layers },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/enquiries')) return 'Enquiries';
  if (pathname.startsWith('/bookings')) return 'Booking';
  if (pathname.startsWith('/admissions')) return 'Admission';
  if (pathname.startsWith('/rooms')) return 'Rooms';
  if (pathname.startsWith('/attendance')) return 'Attendance';
  if (pathname.startsWith('/guests') || pathname.startsWith('/rent-list')) return 'Rent List';
  if (pathname.startsWith('/fee-receipts') || pathname.startsWith('/receipt')) return 'Receipt';
  if (pathname.startsWith('/accounts')) return 'Accounts';
  if (pathname.startsWith('/others')) return 'Others';
  if (pathname.startsWith('/reports')) return 'Reports';
  if (pathname.startsWith('/settings')) return 'Settings';
  return 'Dashboard';
};

export const MainLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
      };
    }
  }, [isMobileOpen]);

  // Close mobile drawer on route transitions
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavList = (isMobile: boolean = false) => (
    <div className="flex flex-col gap-1 py-1 font-inter">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          location.pathname === item.path ||
          location.pathname.startsWith(`${item.path}/`) ||
          (item.path === '/guests' && location.pathname.startsWith('/rent-list')) ||
          (item.path === '/fee-receipts' && location.pathname.startsWith('/receipt'));

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => isMobile && setIsMobileOpen(false)}
            title={isCollapsed && !isMobile ? item.name : undefined}
            className={`group flex items-center gap-3 px-3.5 rounded-xl text-[13.5px] transition-all duration-150 ${
              isMobile ? 'py-3 min-h-[42px]' : 'py-2.5'
            } ${
              isActive
                ? 'bg-[#371E68] text-white font-medium shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 font-normal'
            } ${isCollapsed && !isMobile ? 'justify-center px-2' : ''}`}
          >
            <Icon
              className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />
            {(!isCollapsed || isMobile) && <span className="truncate">{item.name}</span>}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F8F9FA] text-slate-800 font-inter antialiased">
      {/* DESKTOP SIDEBAR - EXACT MODEL SPECIFICATION */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-100 bg-white transition-[width] duration-300 fixed top-0 left-0 bottom-0 h-screen z-30 select-none ${
          isCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div
          className={`shrink-0 pt-7 pb-6 ${
            isCollapsed ? 'flex justify-center px-2' : 'px-6 flex items-center'
          }`}
        >
          {isCollapsed ? (
            <img
              src={zellaIcon}
              alt="Zella Emblem"
              className="w-9 h-9 object-contain shrink-0 cursor-pointer"
              onClick={() => setIsCollapsed(false)}
            />
          ) : (
            <div className="flex items-center overflow-hidden min-w-0">
              <img
                src={zellaLogo}
                alt="Zella Ladies Hostel"
                className="h-9 w-auto max-w-[175px] object-contain object-left"
              />
            </div>
          )}
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-1 scrollbar-none">
          {renderNavList(false)}
        </div>

        {/* Bottom Divider & Logout Button */}
        <div className="border-t border-slate-100 p-4 shrink-0">
          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : undefined}
            className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-inter text-[13.5px] font-medium text-[#FF3B5C] hover:bg-rose-50/60 transition-colors cursor-pointer w-full text-left ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0 text-[#FF3B5C]" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER BACKDROP */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs animate-fade-in h-screen h-[100dvh]"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] h-screen h-[100dvh] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pt-6 pb-5 px-6 flex items-center justify-between border-b border-slate-100 shrink-0">
          <img
            src={zellaLogo}
            alt="Zella Ladies Hostel"
            className="h-9 w-auto max-w-[170px] object-contain object-left"
          />
          <button
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close navigation drawer"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {renderNavList(true)}
        </div>

        <div className="p-4 border-t border-slate-100 pb-safe shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-inter text-[13.5px] font-medium text-[#FF3B5C] hover:bg-rose-50/60 transition-colors cursor-pointer w-full text-left"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0 text-[#FF3B5C]" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-[padding] duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-60'
        }`}
      >
        {/* Top Navbar Header */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileOpen(!isMobileOpen);
                } else {
                  setIsCollapsed(!isCollapsed);
                }
              }}
              aria-label="Toggle navigation menu"
              className="p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-inter">
              {getPageTitle(location.pathname)}
            </h1>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in pb-safe">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
