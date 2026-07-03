import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiLogOut, FiEdit2, FiShield, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../utils/api';
import ReportSettingsCard from '../components/ReportSettingsCard';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const { watchlist } = useWatchlist();
  const { showToast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleUpdateProfile = async () => {
    if (!name.trim()) return showToast('Name cannot be empty', 'error');
    setIsUpdatingName(true);
    try {
      await apiFetch('/api/auth/me', {
        method: 'PUT',
        body: { name }
      });
      await updateUser();
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return showToast('Please fill all password fields', 'error');
    }
    if (newPassword !== confirmPassword) {
      return showToast('New passwords do not match', 'error');
    }
    setIsUpdatingPassword(true);
    try {
      await apiFetch('/api/auth/password', {
        method: 'PUT',
        body: { current_password: currentPassword, new_password: newPassword }
      });
      showToast('Password updated successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to update password', 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
          <FiUser className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Profile Settings</h1>
          <p className="text-sm text-txt-muted">Manage your account and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Account Details */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface-1 border border-line rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-txt-primary">Account Details</h3>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-gain flex items-center justify-center text-xl font-bold text-white shadow-glow">
                {initials}
              </div>
              <div>
                <button className="text-sm font-medium text-accent hover:text-accent-hover transition-colors flex items-center gap-1.5 disabled:opacity-50" disabled>
                  <FiEdit2 className="w-3.5 h-3.5" /> Change Avatar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-txt-muted mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-2 border border-line rounded-xl text-sm text-txt-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-txt-muted mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-2 border border-line rounded-xl text-sm text-txt-primary opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>
              <button 
                onClick={handleUpdateProfile}
                disabled={isUpdatingName || name === user?.name}
                className="py-2 px-4 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl mt-2 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isUpdatingName ? 'Updating...' : <><FiCheckCircle className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-surface-1 border border-line rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-txt-primary flex items-center gap-2">
                <FiShield className="w-4 h-4 text-accent" /> Security
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-txt-muted mb-1.5 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password" 
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-2 border border-line rounded-xl text-sm text-txt-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-txt-muted mb-1.5 uppercase tracking-wider">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password" 
                    className="w-full px-4 py-2.5 bg-surface-2 border border-line rounded-xl text-sm text-txt-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-txt-muted mb-1.5 uppercase tracking-wider">Confirm Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new" 
                    className="w-full px-4 py-2.5 bg-surface-2 border border-line rounded-xl text-sm text-txt-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" 
                  />
                </div>
              </div>
              <button 
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="py-2 px-4 bg-surface-3 hover:bg-surface-3/80 border border-line text-txt-primary text-sm font-medium rounded-xl mt-2 transition-colors disabled:opacity-50"
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </motion.div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Report Settings */}
          <ReportSettingsCard />

          {/* Watchlist Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-surface-1 border border-line rounded-2xl p-6"
          >
            <h3 className="text-base font-semibold text-txt-primary mb-1">Watchlist</h3>
            <p className="text-sm text-txt-muted mb-4">You are tracking {watchlist.length} assets.</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {watchlist.slice(0, 8).map(item => (
                <span key={item.asset_symbol} className="px-2.5 py-1 text-xs font-medium bg-surface-2 border border-line rounded-lg text-txt-secondary">
                  {item.asset_symbol.replace('.NS', '').replace('=X', '')}
                </span>
              ))}
              {watchlist.length > 8 && (
                <span className="px-2.5 py-1 text-xs font-medium bg-surface-2 border border-line rounded-lg text-txt-muted">
                  +{watchlist.length - 8} more
                </span>
              )}
            </div>
            
            <a href="/watchlist" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
              Manage Watchlist &rarr;
            </a>
          </motion.div>

          {/* Danger Zone */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-surface-1 border border-line rounded-2xl p-6"
          >
            <h3 className="text-base font-semibold text-loss mb-4">Danger Zone</h3>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-loss/10 hover:bg-loss/20 border border-loss/20 text-loss text-sm font-medium rounded-xl transition-colors"
            >
              <FiLogOut className="w-4 h-4" /> Sign Out
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
