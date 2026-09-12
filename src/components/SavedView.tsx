import React from 'react';
import type { Listing } from '../services/api';
import { Bookmark, MapPin, Eye, Trash2 } from 'lucide-react';

interface SavedViewProps {
  favorites: string[];
  allListings: Listing[];
  onSelectListing: (l: Listing) => void;
  onToggleFav: (id: string) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  favorites,
  allListings,
  onSelectListing,
  onToggleFav,
}) => {
  const savedListings = allListings.filter(l => favorites.includes(l.listing_id));

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bookmark color="#ec4899" fill="#ec4899" size={28} />
          Saved Listings ({savedListings.length})
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Your bookmarked properties, persistently saved per demo user session.
        </p>
      </div>

      {savedListings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <Bookmark size={48} color="#6b7280" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Saved Listings Yet</h3>
          <p style={{ color: '#9ca3af' }}>Click the bookmark icon on any property listing to save it here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {savedListings.map(listing => (
            <div key={listing.listing_id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  {listing.apartment_name || `${listing.bedroom} BHK ${listing.property_type}`}
                </h3>
                <button 
                  onClick={() => onToggleFav(listing.listing_id)}
                  style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
                  title="Remove from saved"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '16px' }}>
                <MapPin size={14} color="#6366f1" />
                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{listing.locality}</span>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px' }}>
                <div>{listing.bedroom} BHK</div>
                <div>{listing.carpet_area} sqft</div>
                <div>₹{listing.price.toLocaleString()}</div>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%' }}
                onClick={() => onSelectListing(listing)}
              >
                <Eye size={16} /> View Property Details
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
