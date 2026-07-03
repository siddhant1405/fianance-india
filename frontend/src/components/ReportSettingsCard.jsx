import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiClock, FiDownload, FiSend, FiCheck, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { apiFetch } from '../utils/api';
import { useToast } from '../context/ToastContext';

const TIME_OPTIONS = [];
for (let h = 6; h <= 21; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:00`);
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:30`);
}
TIME_OPTIONS.push('22:00');

const ReportSettingsCard = () => {
  const { addToast } = useToast();
  const [preferences, setPreferences] = useState({ is_enabled: false, delivery_time: '08:00' });
  const [lastSent, setLastSent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const data = await apiFetch('/api/reports/preferences');
        setPreferences({ is_enabled: data.is_enabled, delivery_time: data.delivery_time });
        setLastSent(data.last_sent_at);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await apiFetch('/api/reports/preferences', {
        method: 'PUT',
        body: preferences,
      });
      setLastSent(data.last_sent_at);
      addToast('Report preferences saved', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    setActionLoading('preview');
    try {
      const blob = await apiFetch('/api/reports/preview', { method: 'POST' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FinanceIndia_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast('Report downloaded', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to generate preview', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendNow = async () => {
    setActionLoading('send');
    try {
      const res = await apiFetch('/api/reports/send-now', { method: 'POST' });
      addToast(res.message || 'Report sent!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to send report', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface-1 border border-line rounded-2xl p-6 space-y-4 animate-pulse">
        <div className="w-48 h-5 rounded shimmer" />
        <div className="w-full h-10 rounded shimmer" />
        <div className="w-full h-10 rounded shimmer" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-1 border border-line rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-center gap-2">
        <FiMail className="w-5 h-5 text-accent" />
        <h3 className="text-base font-semibold text-txt-primary">Daily Report</h3>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-txt-primary">Enable daily reports</p>
          <p className="text-xs text-txt-muted mt-0.5">Receive a PDF summary via email</p>
        </div>
        <button
          onClick={() => setPreferences(p => ({ ...p, is_enabled: !p.is_enabled }))}
          className={`text-3xl transition-colors ${preferences.is_enabled ? 'text-accent' : 'text-txt-muted'}`}
        >
          {preferences.is_enabled ? <FiToggleRight /> : <FiToggleLeft />}
        </button>
      </div>

      {/* Time picker */}
      <div className={`transition-opacity ${!preferences.is_enabled ? 'opacity-40 pointer-events-none' : ''}`}>
        <label className="flex items-center gap-2 text-sm font-medium text-txt-secondary mb-2">
          <FiClock className="w-4 h-4" /> Delivery Time (IST)
        </label>
        <select
          value={preferences.delivery_time}
          onChange={e => setPreferences(p => ({ ...p, delivery_time: e.target.value }))}
          className="w-full px-3 py-2.5 bg-surface-2 border border-line rounded-xl text-sm text-txt-primary focus:outline-none focus:border-accent/50 appearance-none cursor-pointer"
        >
          {TIME_OPTIONS.map(t => (
            <option key={t} value={t}>
              {parseInt(t) < 12 ? `${t} AM` : parseInt(t) === 12 ? `${t} PM` : `${String(parseInt(t) - 12).padStart(2, '0')}:${t.split(':')[1]} PM`}
            </option>
          ))}
        </select>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2.5 bg-surface-2 hover:bg-surface-3 border border-line text-txt-primary text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>

      {/* Last sent */}
      {lastSent && (
        <p className="text-xs text-txt-muted flex items-center gap-1.5">
          <FiCheck className="w-3 h-3 text-gain" />
          Last sent: {new Date(lastSent).toLocaleString()}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2 border-t border-line">
        <button
          onClick={handlePreview}
          disabled={actionLoading !== null}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          {actionLoading === 'preview' ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><FiDownload className="w-4 h-4" /> Preview PDF</>
          )}
        </button>
        <button
          onClick={handleSendNow}
          disabled={actionLoading !== null}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-ai-muted hover:bg-ai/20 text-ai border border-ai/20 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          {actionLoading === 'send' ? (
            <div className="w-4 h-4 border-2 border-ai/30 border-t-ai rounded-full animate-spin" />
          ) : (
            <><FiSend className="w-4 h-4" /> Send Now</>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ReportSettingsCard;
