import React, { useState, useMemo } from 'react';
import type { Listing } from '../services/api';
import { Search, MapPin, Bed, Bath, Layers, AlertTriangle, Bookmark, Eye } from 'lucide-react';

interface ListingsViewProps {
  listings: Listing[];
  onSelectListing: (l: Listing) => void;
  favorites: string[];
  onToggleFav: (id: string) => void;
}

export const ListingsView: React.FC<ListingsViewProps> = ({
  listings,
  onSelectListing,
  favorites,
  onToggleFav,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('all');
  const [selectedBhk, setSelectedBhk] = useState('all');
  const [selectedFurnishing, setSelectedFurnishing] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [filterCorrupt, setFilterCorrupt] = useState(false);
  const [filterFake, setFilterFake] = useState(false);
  
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const localities = useMemo(() => {
    const setLoc = new Set(listings.map(l => l.locality).filter(Boolean));
    return Array.from(setLoc).sort();
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = l.apartment_name?.toLowerCase().includes(term);
        const matchesLoc = l.locality?.toLowerCase().includes(term);
        const matchesId = l.listing_id?.toLowerCase().includes(term);
        if (!matchesName && !matchesLoc && !matchesId) return false;
      }
      // Locality
      if (selectedLocality !== 'all' && l.locality !== selectedLocality) return false;
      // BHK
      if (selectedBhk !== 'all' && l.bedroom !== parseInt(selectedBhk)) return false;
      // Furnishing
      if (selectedFurnishing !== 'all' && l.furnishing !== selectedFurnishing) return false;
      // Property type
      if (selectedType !== 'all' && l.property_type !== selectedType) return false;

      // Corrupt
      const isCorrupt = 
        l.price <= 0 || 
        l.carpet_area <= 0 || 
        (l.super_built_up_area && l.carpet_area > l.super_built_up_area) ||
        (['apartment', 'villa', 'builder floor', 'independent house'].includes(l.property_type) && (l.bedroom === 0 || l.bathroom === 0)) ||
        (l.floor > l.total_floors && l.total_floors > 0) ||
        l.latitude > 50 || l.longitude < 30;

      if (filterCorrupt && !isCorrupt) return false;

      // Fake
      const isFake = l.price > 0 && l.price < 100000 && l.property_type !== 'plot';
      if (filterFake && !isFake) return false;

      return true;
    });
  }, [listings, searchTerm, selectedLocality, selectedBhk, selectedFurnishing, selectedType, filterCorrupt, filterFake]);

  const displayedListings = filteredListings.slice(0, page * pageSize);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Top Search & Filter Control Header */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search apartment name, locality, or listing ID..." 
              style={{ paddingLeft: '44px' }}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>

          {/* Locality Select */}
          <div style={{ minWidth: '160px' }}>
            <select 
              className="input-field" 
              value={selectedLocality}
              onChange={(e) => { setSelectedLocality(e.target.value); setPage(1); }}
            >
              <option value="all">All Localities</option>
              {localities.map(loc => (
                <option key={loc} value={loc}>{loc.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* BHK Filter */}
          <div style={{ minWidth: '120px' }}>
            <select 
              className="input-field"
              value={selectedBhk}
              onChange={(e) => { setSelectedBhk(e.target.value); setPage(1); }}
            >
              <option value="all">All BHKs</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
            </select>
          </div>

          {/* Furnishing */}
          <div style={{ minWidth: '160px' }}>
            <select 
              className="input-field"
              value={selectedFurnishing}
              onChange={(e) => { setSelectedFurnishing(e.target.value); setPage(1); }}
            >
              <option value="all">All Furnishings</option>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="fully-furnished">Fully-Furnished</option>
            </select>
          </div>

          {/* Property Type */}
          <div style={{ minWidth: '160px' }}>
            <select 
              className="input-field"
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="builder floor">Builder Floor</option>
              <option value="independent house">Independent House</option>
              <option value="plot">Plot</option>
            </select>
          </div>

        </div>

        {/* Anomaly Quick Filter Toggles */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>Audit Filters:</span>
          
          <button 
            className={`btn-secondary ${filterCorrupt ? 'glow-box' : ''}`}
            onClick={() => { setFilterCorrupt(!filterCorrupt); setFilterFake(false); setPage(1); }}
            style={{ padding: '6px 12px', fontSize: '0.8rem', background: filterCorrupt ? 'rgba(239,68,68,0.2)' : undefined, borderColor: filterCorrupt ? '#ef4444' : undefined, color: filterCorrupt ? '#f87171' : undefined }}
          >
            <AlertTriangle size={14} />
            Show Only Corrupt Records (35)
          </button>

          <button 
            className={`btn-secondary ${filterFake ? 'glow-box' : ''}`}
            onClick={() => { setFilterFake(!filterFake); setFilterCorrupt(false); setPage(1); }}
            style={{ padding: '6px 12px', fontSize: '0.8rem', background: filterFake ? 'rgba(245,158,11,0.2)' : undefined, borderColor: filterFake ? '#f59e0b' : undefined, color: filterFake ? '#fbbf24' : undefined }}
          >
            <AlertTriangle size={14} />
            Show Only Bait / Fake Listings (7)
          </button>

          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#9ca3af' }}>
            Showing <strong>{filteredListings.length}</strong> listings
          </span>
        </div>
      </div>

      {/* Grid of Listings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {displayedListings.map(listing => {
          const isCorrupt = 
            listing.price <= 0 || 
            listing.carpet_area <= 0 || 
            (listing.super_built_up_area && listing.carpet_area > listing.super_built_up_area) ||
            (['apartment', 'villa', 'builder floor', 'independent house'].includes(listing.property_type) && (listing.bedroom === 0 || listing.bathroom === 0)) ||
            (listing.floor > listing.total_floors && listing.total_floors > 0) ||
            listing.latitude > 50 || listing.longitude < 30;

          const isFake = listing.price > 0 && listing.price < 100000 && listing.property_type !== 'plot';
          const isFav = favorites.includes(listing.listing_id);

          return (
            <div 
              key={listing.listing_id} 
              className="glass-panel"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
            >
              {/* Badges Bar */}
              <div style={{ padding: '16px 20px 0 20px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>{listing.property_type}</span>
                {listing.is_live && <span className="badge badge-live" style={{ fontSize: '0.7rem' }}>Live</span>}
                {isCorrupt && <span className="badge badge-corrupt" style={{ fontSize: '0.7rem' }}>Corrupt</span>}
                {isFake && <span className="badge badge-fake" style={{ fontSize: '0.7rem' }}>Bait Listing</span>}

                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFav(listing.listing_id); }}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: isFav ? '#ec4899' : '#6b7280', cursor: 'pointer', padding: '4px' }}
                >
                  <Bookmark size={18} fill={isFav ? '#ec4899' : 'none'} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '16px 20px', flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', color: 'white' }}>
                  {listing.apartment_name || `${listing.bedroom} BHK ${listing.property_type}`}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '16px' }}>
                  <MapPin size={14} color="#6366f1" />
                  <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{listing.locality}</span>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Bed size={14} color="#9ca3af" />
                    <span>{listing.bedroom} BHK</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Bath size={14} color="#9ca3af" />
                    <span>{listing.bathroom} Bath</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={14} color="#9ca3af" />
                    <span>{listing.carpet_area} sqft</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Listed Price</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: isCorrupt ? '#ef4444' : isFake ? '#f59e0b' : '#34d399' }}>
                      {listing.price <= 0 ? `₹${listing.price.toLocaleString()}` : `₹${listing.price.toLocaleString()}`}
                    </div>
                  </div>

                  <button 
                    className="btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => onSelectListing(listing)}
                  >
                    <Eye size={14} />
                    Inspect
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination / Load More Button */}
      {displayedListings.length < filteredListings.length && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            className="btn-primary" 
            onClick={() => setPage(page + 1)}
            style={{ padding: '14px 36px', fontSize: '1rem' }}
          >
            Load More Listings ({filteredListings.length - displayedListings.length} remaining)
          </button>
        </div>
      )}

    </div>
  );
};
