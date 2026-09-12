import React from 'react';
import type { AuthState } from '../services/api';
import { Home, Bookmark, Building2, BarChart3, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  auth: AuthState | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  auth,
  activeTab,
  setActiveTab,
  onLogout,
  savedCount,
}) => {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('listings')}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Home size={22} />
          </div>
          <div>
            <div className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(90deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              IVY HOMES
            </div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Pune Property Intelligence
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn-secondary ${activeTab === 'listings' ? 'glow-box' : ''}`}
            onClick={() => setActiveTab('listings')}
            style={{ background: activeTab === 'listings' ? 'rgba(99, 102, 241, 0.2)' : undefined, borderColor: activeTab === 'listings' ? '#6366f1' : undefined }}
          >
            <Home size={18} />
            Listings
          </button>

          <button 
            className={`btn-secondary ${activeTab === 'rentals-projects' ? 'glow-box' : ''}`}
            onClick={() => setActiveTab('rentals-projects')}
            style={{ background: activeTab === 'rentals-projects' ? 'rgba(99, 102, 241, 0.2)' : undefined, borderColor: activeTab === 'rentals-projects' ? '#6366f1' : undefined }}
          >
            <Building2 size={18} />
            Rentals & Projects
          </button>

          <button 
            className={`btn-secondary ${activeTab === 'saved' ? 'glow-box' : ''}`}
            onClick={() => setActiveTab('saved')}
            style={{ background: activeTab === 'saved' ? 'rgba(99, 102, 241, 0.2)' : undefined, borderColor: activeTab === 'saved' ? '#6366f1' : undefined }}
          >
            <Bookmark size={18} />
            Saved ({savedCount})
          </button>

          <button 
            className={`btn-secondary ${activeTab === 'insights' ? 'glow-box' : ''}`}
            onClick={() => setActiveTab('insights')}
            style={{ background: activeTab === 'insights' ? 'rgba(236, 72, 153, 0.25)' : undefined, borderColor: activeTab === 'insights' ? '#ec4899' : undefined, color: '#f472b6' }}
          >
            <BarChart3 size={18} />
            Insights & Audit
          </button>
        </nav>

        {/* Auth / Session User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {auth?.user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <UserIcon size={16} color="#6366f1" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e5e7eb' }}>{auth.user.email}</span>
                <span className="badge badge-live" style={{ fontSize: '0.65rem' }}>Active</span>
              </div>
              <button 
                onClick={onLogout} 
                className="btn-secondary" 
                style={{ padding: '8px 12px', color: '#f87171' }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => setActiveTab('login')}>
              Login
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
