import React from 'react';
import type { Listing } from '../services/api';
import { X, MapPin, Phone, ShieldCheck, AlertTriangle, ExternalLink, Bookmark } from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  allListings: Listing[];
  onSelectListing: (l: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  isFav,
  onToggleFav,
  allListings,
  onSelectListing,
}) => {
  if (!listing) return null;

  const isCorrupt = 
    listing.price <= 0 || 
    listing.carpet_area <= 0 || 
    (listing.super_built_up_area && listing.carpet_area > listing.super_built_up_area) ||
    (['apartment', 'villa', 'builder floor', 'independent house'].includes(listing.property_type) && (listing.bedroom === 0 || listing.bathroom === 0)) ||
    (listing.floor > listing.total_floors && listing.total_floors > 0) ||
    listing.latitude > 50 || listing.longitude < 30;

  const isFake = listing.price > 0 && listing.price < 100000 && listing.property_type !== 'plot';

  const ppsqft = (listing.price > 0 && listing.carpet_area > 0) ? Math.round(listing.price / listing.carpet_area) : 0;

  // Similar listings (same locality & same BHK)
  const similar = allListings.filter(
    l => l.locality === listing.locality && l.bedroom === listing.bedroom && l.listing_id !== listing.listing_id
  ).slice(0, 4);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div 
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative', border: '1px solid rgba(99, 102, 241, 0.3)' }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ paddingRight: '48px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span className="badge badge-verified" style={{ textTransform: 'uppercase' }}>{listing.property_type}</span>
            {listing.is_live && <span className="badge badge-live">Live</span>}
            {listing.is_verified && <span className="badge badge-verified"><ShieldCheck size={12} /> Verified</span>}
            {isCorrupt && <span className="badge badge-corrupt"><AlertTriangle size={12} /> Data Corrupt</span>}
            {isFake && <span className="badge badge-fake"><AlertTriangle size={12} /> Bait / Fake Listing</span>}
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginLeft: 'auto' }}>ID: {listing.listing_id}</span>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>
            {listing.apartment_name || `${listing.bedroom} BHK ${listing.property_type}`}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '0.95rem' }}>
            <MapPin size={18} color="#6366f1" />
            <span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#e5e7eb' }}>{listing.locality}</span>, Pune
          </div>
        </div>

        {/* Warnings */}
        {isCorrupt && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.9rem' }}>
            <strong>⚠️ Anomaly Flag:</strong> This listing contains physically impossible data (e.g. carpet area &gt; super area, negative price, zero BHK, or inverted coordinates).
          </div>
        )}

        {isFake && (
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.9rem' }}>
            <strong>⚠️ Bait Listing Flag:</strong> This listing advertises a rental monthly price (₹{listing.price.toLocaleString()}) as a sale price for a 2/3BHK apartment to generate fake inquiries.
          </div>
        )}

        {/* Pricing & Key Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Price</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: isCorrupt ? '#ef4444' : isFake ? '#f59e0b' : '#34d399' }}>
              {listing.price <= 0 ? `₹${listing.price.toLocaleString()} (Invalid)` : `₹${listing.price.toLocaleString()}`}
            </div>
            {ppsqft > 0 && <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>₹{ppsqft.toLocaleString()} / sqft</div>}
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Carpet Area</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>{listing.carpet_area} sq.ft</div>
            {listing.super_built_up_area && <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Super: {listing.super_built_up_area} sq.ft</div>}
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Bedrooms & Baths</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>{listing.bedroom} BHK / {listing.bathroom} Bath</div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Floor: {listing.floor} of {listing.total_floors}</div>
          </div>
        </div>

        {/* Property Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px' }}>Furnishing & Direction</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div><strong style={{ color: '#e5e7eb' }}>Furnishing:</strong> <span style={{ textTransform: 'capitalize' }}>{listing.furnishing}</span></div>
              <div><strong style={{ color: '#e5e7eb' }}>Facing:</strong> <span style={{ textTransform: 'capitalize' }}>{listing.facing_direction || 'N/A'}</span></div>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px' }}>Seller & Contact</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.2)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <Phone size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{listing.posted_by_name || 'Agent Contact'} ({listing.posted_by})</div>
                <div style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>{listing.posted_by_contact}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>Seller Description</h3>
          <p style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', color: '#d1d5db', lineHeight: 1.6 }}>
            {listing.description || 'No description text provided.'}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <button 
            className="btn-primary" 
            style={{ flex: 1 }}
            onClick={() => onToggleFav(listing.listing_id)}
          >
            <Bookmark size={18} fill={isFav ? 'white' : 'none'} />
            {isFav ? 'Saved in Favourites' : 'Save to Favourites'}
          </button>
          
          <a 
            href={listing.listing_url} 
            target="_blank" 
            rel="noreferrer" 
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            Visit Original Source ({listing.website})
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Similar Listings Strip */}
        {similar.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Similar Listings in {listing.locality}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {similar.map(item => (
                <div 
                  key={item.listing_id}
                  onClick={() => onSelectListing(item)}
                  style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.apartment_name || `${item.bedroom} BHK ${item.locality}`}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 700, marginTop: '4px' }}>
                    ₹{item.price.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{item.carpet_area} sqft</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
