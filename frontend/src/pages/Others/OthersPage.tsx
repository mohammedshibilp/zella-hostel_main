import React, { useState, useEffect } from 'react';
import {
  Coffee,
  Milk,
  Flame,
  Search,
  Plus,
  TrendingUp,
  Sparkles,
  DollarSign,
  Calendar,
  Trash2,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Card } from '../../components/Card';
import { useToast } from '../../context/ToastContext';

interface MilkLog {
  id: string;
  date: string;
  quantity: number;
  rate: number;
  totalCost: number;
  status: 'Paid' | 'Pending';
}

interface GasLog {
  id: string;
  date: string;
  type: string;
  quantity: number;
  rate: number;
  totalCost: number;
  status: 'Paid' | 'Pending';
}

const DEFAULT_MILK_LOGS: MilkLog[] = [
  { id: '1', date: '2026-07-25', quantity: 8.5, rate: 50, totalCost: 425, status: 'Paid' },
  { id: '2', date: '2026-07-24', quantity: 9, rate: 50, totalCost: 450, status: 'Paid' },
  { id: '3', date: '2026-07-23', quantity: 8, rate: 50, totalCost: 400, status: 'Paid' },
  { id: '4', date: '2026-07-22', quantity: 8.5, rate: 50, totalCost: 425, status: 'Paid' },
  { id: '5', date: '2026-07-21', quantity: 8.5, rate: 50, totalCost: 425, status: 'Paid' },
  { id: '6', date: '2026-07-20', quantity: 8, rate: 50, totalCost: 400, status: 'Paid' },
];

const DEFAULT_GAS_LOGS: GasLog[] = [
  { id: 'g1', date: '2026-07-20', type: 'Commercial 19kg', quantity: 2, rate: 1050, totalCost: 2100, status: 'Paid' },
  { id: 'g2', date: '2026-07-08', type: 'Commercial 19kg', quantity: 2, rate: 1050, totalCost: 2100, status: 'Paid' },
];

export const OthersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'milk' | 'gas'>('milk');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [milkLogs, setMilkLogs] = useState<MilkLog[]>(() => {
    const saved = localStorage.getItem('zella_milk_logs');
    return saved ? JSON.parse(saved) : DEFAULT_MILK_LOGS;
  });

  const [gasLogs, setGasLogs] = useState<GasLog[]>(() => {
    const saved = localStorage.getItem('zella_gas_logs');
    return saved ? JSON.parse(saved) : DEFAULT_GAS_LOGS;
  });

  const [isMilkModalOpen, setIsMilkModalOpen] = useState<boolean>(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState<boolean>(false);

  // Form states
  const [newMilk, setNewMilk] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: '8.5',
    rate: '50',
    status: 'Paid' as 'Paid' | 'Pending',
  });

  const [newGas, setNewGas] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Commercial 19kg',
    quantity: '2',
    rate: '1050',
    status: 'Paid' as 'Paid' | 'Pending',
  });

  const { success } = useToast();

  useEffect(() => {
    localStorage.setItem('zella_milk_logs', JSON.stringify(milkLogs));
  }, [milkLogs]);

  useEffect(() => {
    localStorage.setItem('zella_gas_logs', JSON.stringify(gasLogs));
  }, [gasLogs]);

  // Derived Milk Calculations
  const filteredMilkLogs = milkLogs.filter((log) =>
    log.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayMilkSupply = milkLogs.length > 0 ? milkLogs[0].quantity : 0;
  const totalMilkLitrage = milkLogs.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalMilkExpense = milkLogs.reduce((acc, curr) => acc + curr.totalCost, 0);
  const averageMilkRate = milkLogs.length > 0 ? Math.round(totalMilkExpense / totalMilkLitrage) : 50;

  // Derived Gas Calculations
  const filteredGasLogs = gasLogs.filter((log) =>
    log.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGasExpense = gasLogs.reduce((acc, curr) => acc + curr.totalCost, 0);
  const totalGasCount = gasLogs.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleAddMilkLog = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(newMilk.quantity) || 0;
    const rate = parseFloat(newMilk.rate) || 0;
    const log: MilkLog = {
      id: Date.now().toString(),
      date: newMilk.date,
      quantity: qty,
      rate: rate,
      totalCost: qty * rate,
      status: newMilk.status,
    };
    setMilkLogs([log, ...milkLogs]);
    setIsMilkModalOpen(false);
    success('Milk log added successfully');
  };

  const handleDeleteMilkLog = (id: string) => {
    setMilkLogs(milkLogs.filter((item) => item.id !== id));
    success('Milk log removed');
  };

  const handleAddGasLog = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(newGas.quantity) || 0;
    const rate = parseFloat(newGas.rate) || 0;
    const log: GasLog = {
      id: Date.now().toString(),
      date: newGas.date,
      type: newGas.type,
      quantity: qty,
      rate: rate,
      totalCost: qty * rate,
      status: newGas.status,
    };
    setGasLogs([log, ...gasLogs]);
    setIsGasModalOpen(false);
    success('Gas cylinder log added successfully');
  };

  const handleDeleteGasLog = (id: string) => {
    setGasLogs(gasLogs.filter((item) => item.id !== id));
    success('Gas log removed');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-inter">
      {/* 1. TOP HERO BANNER - MESS & UTILITY USAGE ANALYTICS */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B0D36] via-[#2A1352] to-[#39196B] p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Coffee className="w-5 h-5 text-amber-400 shrink-0" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Mess & Utility Usage Analytics
            </h2>
          </div>
          <p className="text-xs text-purple-200/80 mt-1.5 max-w-2xl font-normal leading-relaxed">
            Track daily milk supply, commercial gas cylinder refills, and calculate exact per-guest utility costs.
          </p>
        </div>

        <button
          onClick={() => (activeTab === 'milk' ? setIsMilkModalOpen(true) : setIsGasModalOpen(true))}
          className="px-4 py-2.5 rounded-xl bg-[#4D2799] hover:bg-[#5D32B8] text-white text-xs font-semibold flex items-center gap-1.5 border border-purple-400/30 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'milk' ? '+ Add Milk Log' : '+ Add Cylinder'}</span>
        </button>
      </div>

      {/* 2. TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Tab 1: Daily Milk Supply */}
          <button
            onClick={() => setActiveTab('milk')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'milk'
                ? 'bg-sky-50 border border-sky-200 text-sky-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <Milk className="w-4 h-4 text-sky-600" />
            <span>Daily Milk Supply</span>
            <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
              {milkLogs.length}
            </span>
          </button>

          {/* Tab 2: Gas Cylinders */}
          <button
            onClick={() => setActiveTab('gas')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'gas'
                ? 'bg-amber-50 border border-amber-200 text-amber-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Gas Cylinders</span>
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
              {gasLogs.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 rounded-full border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-purple-500 w-full sm:w-56 transition-all"
          />
        </div>
      </div>

      {/* 3. FOUR METRIC CARDS */}
      {activeTab === 'milk' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Today's Milk Supply */}
          <Card padding="none" className="p-5 border border-slate-100 bg-white rounded-2xl hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  Today's Milk Supply
                </span>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {todayMilkSupply} L
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
                <Milk className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Card 2: Monthly Litrage */}
          <Card padding="none" className="p-5 border border-slate-100 bg-white rounded-2xl hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  Monthly Litrage
                </span>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {totalMilkLitrage} L
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Card 3: Total Milk Expense */}
          <Card padding="none" className="p-5 border border-slate-100 bg-white rounded-2xl hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  Total Milk Expense
                </span>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  ₹{totalMilkExpense.toLocaleString()}
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Card 4: Average Rate / Liter */}
          <Card padding="none" className="p-5 border border-slate-100 bg-white rounded-2xl hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  Average Rate / Liter
                </span>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  ₹{averageMilkRate} / L
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="none" className="p-5 border border-slate-100 bg-white rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">Cylinders In Stock</span>
                <div className="text-2xl font-black text-slate-900">2 Units</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card padding="none" className="p-5 border border-slate-100 bg-white rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">Active Connected</span>
                <div className="text-2xl font-black text-slate-900">2 Units</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card padding="none" className="p-5 border border-slate-100 bg-white rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">Monthly Refilled</span>
                <div className="text-2xl font-black text-slate-900">{totalGasCount} Cylinders</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card padding="none" className="p-5 border border-slate-100 bg-white rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">Total Gas Expense</span>
                <div className="text-2xl font-black text-slate-900">₹{totalGasExpense.toLocaleString()}</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 4. REGISTER TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        {/* Table Header Bar */}
        <div className="p-4 sm:px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            {activeTab === 'milk' ? (
              <>
                <Milk className="w-4 h-4 text-sky-600" />
                <span>Daily Milk Supply Register</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Commercial Gas Cylinder Register</span>
              </>
            )}
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Showing {activeTab === 'milk' ? filteredMilkLogs.length : filteredGasLogs.length} logs
          </span>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          {activeTab === 'milk' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/60 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Quantity</th>
                  <th className="py-3 px-6">Rate/L</th>
                  <th className="py-3 px-6">Total Cost</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMilkLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-slate-800 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.date}</span>
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-sky-600">
                      {log.quantity} Liters
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 font-medium">
                      ₹{log.rate}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      ₹{log.totalCost}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{log.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleDeleteMilkLog(log.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/60 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Cylinder Type</th>
                  <th className="py-3 px-6">Quantity</th>
                  <th className="py-3 px-6">Unit Price</th>
                  <th className="py-3 px-6">Total Cost</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredGasLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-slate-800 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.date}</span>
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-amber-600">
                      {log.type}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-700">
                      {log.quantity} Cylinders
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 font-medium">
                      ₹{log.rate}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      ₹{log.totalCost}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{log.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleDeleteGasLog(log.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL: ADD MILK LOG */}
      {isMilkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Milk className="w-4 h-4 text-sky-600" />
                <span>Add Daily Milk Supply Log</span>
              </div>
              <button
                onClick={() => setIsMilkModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMilkLog} className="mt-4 flex flex-col gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={newMilk.date}
                  onChange={(e) => setNewMilk({ ...newMilk, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantity (Liters)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newMilk.quantity}
                    onChange={(e) => setNewMilk({ ...newMilk, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rate per Liter (₹)</label>
                  <input
                    type="number"
                    required
                    value={newMilk.rate}
                    onChange={(e) => setNewMilk({ ...newMilk, rate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Status</label>
                <select
                  value={newMilk.status}
                  onChange={(e) => setNewMilk({ ...newMilk, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMilkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#4D2799] hover:bg-[#5D32B8] text-white font-semibold cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GAS LOG */}
      {isGasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Add Gas Cylinder Refill Log</span>
              </div>
              <button
                onClick={() => setIsGasModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGasLog} className="mt-4 flex flex-col gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={newGas.date}
                  onChange={(e) => setNewGas({ ...newGas, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cylinder Type</label>
                <select
                  value={newGas.type}
                  onChange={(e) => setNewGas({ ...newGas, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="Commercial 19kg">Commercial 19kg</option>
                  <option value="Commercial 47.5kg">Commercial 47.5kg</option>
                  <option value="Domestic 14.2kg">Domestic 14.2kg</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantity (Cylinders)</label>
                  <input
                    type="number"
                    required
                    value={newGas.quantity}
                    onChange={(e) => setNewGas({ ...newGas, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newGas.rate}
                    onChange={(e) => setNewGas({ ...newGas, rate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Status</label>
                <select
                  value={newGas.status}
                  onChange={(e) => setNewGas({ ...newGas, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGasModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#4D2799] hover:bg-[#5D32B8] text-white font-semibold cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
