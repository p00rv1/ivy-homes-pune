import React, { useState } from 'react';
import type { AuthState } from '../services/api';
import { loginApi } from '../services/api';
import { KeyRound, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  onSuccess: (auth: AuthState) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('demo1@ivy.homes');
  const [password, setPassword] = useState('846e743015');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const session = await loginApi(email, password);
      onSuccess(session);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('846e743015');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '32px' }} className="glass-panel glow-box">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: '56px', height: '56px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#6366f1' }}>
          <KeyRound size={28} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Ivy Homes Auth</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
          Real credential session authentication against solve.ivy.homes
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            User Email
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#6b7280' }} />
            <input 
              type="email" 
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#6b7280' }} />
            <input 
              type="password" 
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '8px', padding: '14px' }}>
          {loading ? 'Authenticating API...' : 'Log In to Ivy Portal'}
        </button>
      </form>

      <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10b981" />
          Quick Demo Credentials
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['demo1@ivy.homes', 'demo2@ivy.homes', 'demo3@ivy.homes'].map((demo) => (
            <button
              key={demo}
              type="button"
              className="btn-secondary"
              style={{ flex: 1, padding: '6px 4px', fontSize: '0.75rem' }}
              onClick={() => handleQuickFill(demo)}
            >
              {demo.split('@')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
