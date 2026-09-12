import React, { useState, useEffect } from 'react';
import type { AuthState, Listing, Rental, Project } from './services/api';
import { 
  getStoredSession, 
  clearSession, 
  fetchListingsLocal, 
  fetchRentalsLocal, 
  fetchProjectsLocal 
} from './services/api';
import { getFavorites, toggleFavorite } from './services/favorites';
import { Navbar } from './components/Navbar';
import { ListingsView } from './components/ListingsView';
import { ListingDetailModal } from './components/ListingDetailModal';
import { SavedView } from './components/SavedView';
import { RentalsProjectsView } from './components/RentalsProjectsView';
import { InsightsView } from './components/InsightsView';
import { LoginModal } from './components/LoginModal';

export const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState | null>(() => getStoredSession());
  const [activeTab, setActiveTab] = useState<string>('listings');
  const [listings] = useState<Listing[]>(() => fetchListingsLocal());
  const [rentals] = useState<Rental[]>(() => fetchRentalsLocal());
  const [projects] = useState<Project[]>(() => fetchProjectsLocal());
  
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (auth?.user?.email) {
      setFavorites(getFavorites(auth.user.email));
    } else {
      setFavorites([]);
    }
  }, [auth]);

  const handleLoginSuccess = (newAuth: AuthState) => {
    setAuth(newAuth);
    setActiveTab('listings');
  };

  const handleLogout = () => {
    clearSession();
    setAuth(null);
  };

  const handleToggleFav = (id: string) => {
    if (!auth?.user?.email) {
      setActiveTab('login');
      return;
    }
    const updated = toggleFavorite(auth.user.email, id);
    setFavorites(updated);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <Navbar 
        auth={auth} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        savedCount={favorites.length}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'listings' && (
          <ListingsView 
            listings={listings} 
            onSelectListing={setSelectedListing} 
            favorites={favorites} 
            onToggleFav={handleToggleFav} 
          />
        )}

        {activeTab === 'rentals-projects' && (
          <RentalsProjectsView rentals={rentals} projects={projects} />
        )}

        {activeTab === 'saved' && (
          <SavedView 
            favorites={favorites} 
            allListings={listings} 
            onSelectListing={setSelectedListing} 
            onToggleFav={handleToggleFav} 
          />
        )}

        {activeTab === 'insights' && (
          <InsightsView />
        )}

        {activeTab === 'login' && (
          <LoginModal onSuccess={handleLoginSuccess} />
        )}
      </main>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <ListingDetailModal 
          listing={selectedListing} 
          onClose={() => setSelectedListing(null)} 
          isFav={favorites.includes(selectedListing.listing_id)} 
          onToggleFav={handleToggleFav} 
          allListings={listings} 
          onSelectListing={setSelectedListing} 
        />
      )}

      {/* Footer */}
      <footer className="glass-panel" style={{ borderRadius: 0, borderBottom: 0, borderLeft: 0, borderRight: 0, marginTop: 'auto', padding: '24px', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
        Ivy Homes Software Engineering Internship Assignment — City: Pune | Key: IVY26-965B599A653B
      </footer>

    </div>
  );
};

export default App;
