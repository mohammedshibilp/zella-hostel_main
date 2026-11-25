import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { DashboardMetrics } from '../../types';
import { Card } from '../../components/Card';
import { LoadingState } from '../../components/LoadingState';
import {
  Users,
  DoorOpen,
  CalendarCheck,
  UserPlus,
  Receipt,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading hostel dashboard..." />;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto w-full">
      {/* 3 CORE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* 1. TOTAL BED SPACES */}
        <Card
          padding="sm"
          className="relative overflow-hidden border border-slate-100 hover:shadow-md transition-all duration-200 group p-5 bg-white rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase block mb-1.5">
                TOTAL BED SPACES
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {metrics?.total_beds || 101}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* 2. AVAILABLE BED SPACES */}
        <Card
          padding="sm"
          className="relative overflow-hidden border border-slate-100 hover:shadow-md transition-all duration-200 group p-5 bg-white rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase block mb-1.5">
                AVAILABLE BED SPACES
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {metrics?.vacancies ?? 68}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DoorOpen className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* 3. CURRENT BOOKING */}
        <Card
          padding="sm"
          className="relative overflow-hidden border border-slate-100 hover:shadow-md transition-all duration-200 group p-5 bg-white rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase block mb-1.5">
                CURRENT BOOKING
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {metrics?.active_bookings ?? 11}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* QUICK OPERATIONAL HUB */}
      <div className="mt-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>Quick Actions</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <Link
            to="/admissions"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2 group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-navy-900 group-hover:text-primary transition-colors">
              New Admission
            </span>
          </Link>

          <Link
            to="/rooms"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-secondary hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2 group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary-50 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors flex items-center justify-center shrink-0">
              <DoorOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-navy-900 group-hover:text-secondary transition-colors">
              Room Management
            </span>
          </Link>

          <Link
            to="/fee-receipts"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2 group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-navy-900 group-hover:text-emerald-700 transition-colors">
              Fee Receipts
            </span>
          </Link>

          <Link
            to="/attendance"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2 group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-navy-900 group-hover:text-primary transition-colors">
              Daily Attendance
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
