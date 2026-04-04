import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Activity as ActivityIcon, 
  Wallet, 
  LogOut,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';

interface User {
  id: number;
  name: string;
  hourlyEarnings: number;
  workingHoursPerDay: number;
}

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  status: string;
  onReset?: () => void;
}

export default function Layout({ children, user, status, onReset }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight uppercase">DeliverySafe</span>
          </Link>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase mb-4 px-2">Main Menu</div>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
              isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink 
            to="/activity" 
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
              isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <ActivityIcon className="w-5 h-5" /> Activity
          </NavLink>
          <NavLink 
            to="/earnings" 
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
              isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Wallet className="w-5 h-5" /> Earnings
          </NavLink>
        </nav>
        <div className="p-6 border-t border-gray-100">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-10 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {useLocation().pathname === '/dashboard' ? 'Partner Dashboard' : 
               useLocation().pathname === '/activity' ? 'Activity Log' : 'Earnings Overview'}
            </h1>
            <p className="text-gray-500 font-medium flex items-center gap-2 text-sm mt-0.5">
              <MapPin className="w-4 h-4 text-emerald-600" /> Chennai, Tamil Nadu
            </p>
          </div>
          <div className="flex items-center gap-4">
            {onReset && (
              <button 
                onClick={onReset}
                className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm text-sm"
              >
                <RefreshCw className="w-4 h-4" /> Reset Demo
              </button>
            )}
            <div className="h-10 w-[1px] bg-gray-200 mx-1 hidden md:block" />
            <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xs">
                {user?.name?.[0] || 'U'}
              </div>
              <div>
                <p className="text-xs font-black text-gray-900 leading-none">{user?.name || 'Loading...'}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full", status === 'Active' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse')} />
                  <span className="text-[8px] font-black uppercase tracking-wider text-gray-500">{status}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
