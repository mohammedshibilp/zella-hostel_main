import React, { useEffect, useState } from 'react';
import { packageService } from '../../services/packageService';
import { authService } from '../../services/authService';
import { Package, User } from '../../types';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Tag,
  Shield,
  Trash2,
  X,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [isPackageModalOpen, setIsPackageModalOpen] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);

  // Forms
  const [pkgForm, setPkgForm] = useState({
    name: '',
    monthly_fee: '',
    security_deposit: '',
    amenities: '',
    description: '',
  });

  const [userForm, setUserForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'STAFF',
  });

  const { success, error: toastError } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [pkgs, usrList] = await Promise.all([
        packageService.getPackages(false),
        authService.listUsers(),
      ]);
      setPackages(pkgs);
      setUsers(usrList);
    } catch (err) {
      toastError('Failed to load system settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeletePackage = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the package "${name}"?`)) {
      return;
    }
    try {
      await packageService.deletePackage(id);
      success(`Package "${name}" deleted successfully`);
      loadData();
    } catch (err: any) {
      toastError(err.response?.data?.detail || 'Failed to delete package');
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await packageService.createPackage({
        name: pkgForm.name,
        monthly_fee: parseFloat(pkgForm.monthly_fee) || 0,
        security_deposit: parseFloat(pkgForm.security_deposit) || 0,
        amenities: pkgForm.amenities || undefined,
        description: pkgForm.description || undefined,
      });
      success(`Package "${pkgForm.name}" created successfully!`);
      setIsPackageModalOpen(false);
      loadData();
    } catch (err: any) {
      toastError(err.response?.data?.detail || 'Failed to create package');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.createUser({
        full_name: userForm.full_name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        is_active: true,
      });
      success(`User ${userForm.full_name} created successfully!`);
      setIsUserModalOpen(false);
      loadData();
    } catch (err: any) {
      toastError(err.response?.data?.detail || 'Failed to create user');
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in font-inter">
      {/* 1. HOSTEL PACKAGES & PRICING */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Hostel Packages & Pricing
            </h2>
          </div>
          <button
            onClick={() => {
              setPkgForm({
                name: '',
                monthly_fee: '',
                security_deposit: '',
                amenities: '',
                description: '',
              });
              setIsPackageModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#F7941D] hover:bg-[#E08212] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Package</span>
          </button>
        </div>

        {/* Packages Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">PACKAGE NAME</th>
                  <th className="py-3 px-6">MONTHLY FEE</th>
                  <th className="py-3 px-6">DEPOSIT</th>
                  <th className="py-3 px-6">AMENITIES</th>
                  <th className="py-3 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                      {pkg.name}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#3F2576] text-sm">
                      ₹{pkg.monthly_fee}/mo
                    </td>
                    <td className="py-4 px-6 text-slate-700 text-xs font-medium">
                      ₹{pkg.security_deposit}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs max-w-md">
                      {pkg.amenities || 'High-Speed WiFi, Hot Water, 3 Meals, Daily Housekeeping'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center gap-1"
                        title={`Delete ${pkg.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. STAFF & OPERATOR ACCOUNTS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#3F2576]" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Staff & Operator Accounts
            </h2>
          </div>
          <button
            onClick={() => {
              setUserForm({
                full_name: '',
                email: '',
                password: '',
                role: 'STAFF',
              });
              setIsUserModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#3F2576] hover:bg-[#321E5C] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Staff Account</span>
          </button>
        </div>

        {/* Staff Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">USER NAME</th>
                  <th className="py-3 px-6">EMAIL</th>
                  <th className="py-3 px-6">ROLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                      {usr.full_name}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {usr.email}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          usr.role === 'ADMIN'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                        }`}
                      >
                        {usr.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE PACKAGE MODAL */}
      <Modal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        title="Add Hostel Package"
        maxWidth="md"
      >
        <form onSubmit={handleCreatePackage} className="flex flex-col gap-4 text-xs">
          <Input
            label="Package Name"
            placeholder="e.g. Deluxe Single AC"
            value={pkgForm.name}
            onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monthly Rent (₹)"
              type="number"
              placeholder="e.g. 7500"
              value={pkgForm.monthly_fee}
              onChange={(e) => setPkgForm({ ...pkgForm, monthly_fee: e.target.value })}
              required
            />
            <Input
              label="Security Deposit (₹)"
              type="number"
              placeholder="e.g. 5000"
              value={pkgForm.security_deposit}
              onChange={(e) => setPkgForm({ ...pkgForm, security_deposit: e.target.value })}
              required
            />
          </div>

          <Input
            label="Amenities (Comma Separated)"
            placeholder="WiFi, Hot Water, 3 Meals, Housekeeping"
            value={pkgForm.amenities}
            onChange={(e) => setPkgForm({ ...pkgForm, amenities: e.target.value })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Description</label>
            <textarea
              rows={2}
              placeholder="Details about room specs..."
              value={pkgForm.description}
              onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3F2576]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsPackageModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Package
            </Button>
          </div>
        </form>
      </Modal>

      {/* CREATE STAFF ACCOUNT MODAL */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Create Staff Account"
        maxWidth="md"
      >
        <form onSubmit={handleCreateUser} className="flex flex-col gap-4 text-xs">
          <Input
            label="Full Name"
            placeholder="e.g. Anjali Nair"
            value={userForm.full_name}
            onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="staff@zellahostel.com"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            required
          />

          <Input
            label="Temporary Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Account Role</label>
            <select
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3F2576]"
            >
              <option value="STAFF">Staff (Daily Operations)</option>
              <option value="ADMIN">Administrator (Full Access)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
