import React, { useState, useEffect } from 'react';
import { conversationMemory } from '../services/conversationMemory';
import { systemInfo } from '../services/systemInfo';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState(conversationMemory.getUserName() || '');
  const [personality, setPersonality] = useState(conversationMemory.getPersonality());
  const [voiceSettings, setVoiceSettings] = useState(conversationMemory.getVoiceSettings());
  const [stats, setStats] = useState(conversationMemory.getStats());
  const [systemStatus, setSystemStatus] = useState('');
  useEffect(() => {
    if (isOpen) {
      setStats(conversationMemory.getStats());
      setSystemStatus(systemInfo.getSystemStatus());
    }
  }, [isOpen]);

  const handleSaveUserName = () => {
    if (userName.trim()) {
      conversationMemory.setUserName(userName.trim());
      alert('Nama berhasil disimpan!');
    }
  };

  const handlePersonalityChange = (newPersonality: 'formal' | 'casual' | 'friendly' | 'professional') => {
    setPersonality(newPersonality);
    conversationMemory.setPersonality(newPersonality);
  };

  const handleVoiceSettingChange = (setting: string, value: number) => {
    const newSettings = { ...voiceSettings, [setting]: value };
    setVoiceSettings(newSettings);
    conversationMemory.updateVoiceSettings({ [setting]: value });
  };

  const handleClearHistory = () => {
    if (confirm('Yakin ingin menghapus semua riwayat percakapan?')) {
      conversationMemory.clearHistory();
      setStats(conversationMemory.getStats());
      alert('Riwayat percakapan berhasil dihapus!');
    }
  };

  const handleExportConversations = () => {
    const exportData = conversationMemory.exportConversations();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarvis-conversations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRequestLocation = async () => {
    const granted = await systemInfo.requestLocation();
    if (granted) {
      alert('Lokasi berhasil diaktifkan!');
      setSystemStatus(systemInfo.getSystemStatus());
    } else {
      alert('Gagal mengaktifkan lokasi. Pastikan Anda memberikan izin.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[var(--stroke-1)] bg-[rgba(16,19,24,0.72)]"
        style={{ borderRadius: 'var(--r-2)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--stroke-1)]">
          <div>
            <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">SETTINGS</div>
            <h2 className="mt-1 text-lg font-semibold tracking-[-0.01em]">JARVIS Console</h2>
          </div>
          <button
            onClick={onClose}
            className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] bg-transparent text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)]"
            style={{ borderRadius: 'var(--r-1)' }}
          >
            Close
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section className="border border-[var(--stroke-1)] bg-[var(--bg-2)] p-5" style={{ borderRadius: 'var(--r-2)' }}>
            <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">IDENTITY</div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-9">
                <label className="block text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">USER NAME</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-2 w-full h-11 px-4 text-sm border border-[var(--stroke-1)] bg-[var(--bg-1)] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none"
                  style={{ borderRadius: 'var(--r-1)' }}
                />
              </div>
              <div className="md:col-span-3">
                <button
                  onClick={handleSaveUserName}
                  className="w-full h-11 px-4 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)]"
                  style={{ borderRadius: 'var(--r-1)' }}
                >
                  Save
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">PERSONALITY</div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'friendly', label: 'Friendly', desc: 'Boss/Kak' },
                  { value: 'formal', label: 'Formal', desc: 'Tuan/Nyonya' },
                  { value: 'professional', label: 'Professional', desc: 'Sir/Madam' },
                  { value: 'casual', label: 'Casual', desc: 'Bro/Sis' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePersonalityChange(option.value as any)}
                    className="p-3 text-left border"
                    style={{
                      borderRadius: 'var(--r-1)',
                      borderColor: personality === option.value ? 'var(--accent)' : 'var(--stroke-1)',
                      background: personality === option.value ? 'rgba(104,167,255,0.06)' : 'transparent'
                    }}
                  >
                    <div className="text-sm font-medium text-[var(--text-1)]">{option.label}</div>
                    <div className="mt-0.5 text-xs text-[var(--text-3)]">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="border border-[var(--stroke-1)] bg-[var(--bg-2)] p-5" style={{ borderRadius: 'var(--r-2)' }}>
            <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">VOICE</div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">SPEED</label>
                <div className="mt-2 text-xs font-mono text-[var(--text-2)]">{voiceSettings.speed.toFixed(2)}x</div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.speed}
                  onChange={(e) => handleVoiceSettingChange('speed', parseFloat(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">PITCH</label>
                <div className="mt-2 text-xs font-mono text-[var(--text-2)]">{voiceSettings.pitch.toFixed(2)}</div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.pitch}
                  onChange={(e) => handleVoiceSettingChange('pitch', parseFloat(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">VOLUME</label>
                <div className="mt-2 text-xs font-mono text-[var(--text-2)]">{Math.round(voiceSettings.volume * 100)}%</div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.volume}
                  onChange={(e) => handleVoiceSettingChange('volume', parseFloat(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>
            </div>
          </section>

          <section className="border border-[var(--stroke-1)] bg-[var(--bg-2)] p-5" style={{ borderRadius: 'var(--r-2)' }}>
            <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">SYSTEM</div>
            <div className="mt-4 grid md:grid-cols-2 gap-5">
              <div>
                <div className="text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">STATUS</div>
                <pre className="mt-2 text-xs border border-[var(--stroke-1)] bg-[var(--bg-1)] p-3 whitespace-pre-wrap font-mono text-[var(--text-2)]" style={{ borderRadius: 'var(--r-1)' }}>
                  {systemStatus}
                </pre>
                <button
                  onClick={handleRequestLocation}
                  className="mt-3 h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)]"
                  style={{ borderRadius: 'var(--r-1)' }}
                >
                  Request Location
                </button>
              </div>

              <div>
                <div className="text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">STATS</div>
                <div className="mt-3 space-y-2 text-sm text-[var(--text-2)]">
                  <div className="flex justify-between gap-4">
                    <span className="text-[var(--text-3)]">Total interactions</span>
                    <span className="font-mono">{stats.totalInteractions}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[var(--text-3)]">Saved conversations</span>
                    <span className="font-mono">{stats.conversationCount}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[var(--text-3)]">Last active</span>
                    <span className="font-mono text-xs">{stats.lastActiveTime.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border border-[var(--stroke-1)] bg-[var(--bg-2)] p-5" style={{ borderRadius: 'var(--r-2)' }}>
            <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">DATA</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleExportConversations}
                className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)]"
                style={{ borderRadius: 'var(--r-1)' }}
              >
                Export
              </button>

              <button
                onClick={handleClearHistory}
                className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)]"
                style={{ borderRadius: 'var(--r-1)' }}
              >
                Clear History
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
