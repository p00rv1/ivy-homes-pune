import React, { useState } from 'react';
import type { Rental, Project } from '../services/api';
import { Building2, Home, MapPin } from 'lucide-react';

interface RentalsProjectsViewProps {
  rentals: Rental[];
  projects: Project[];
}

export const RentalsProjectsView: React.FC<RentalsProjectsViewProps> = ({ rentals, projects }) => {
  const [activeTab, setActiveTab] = useState<'rentals' | 'projects'>('rentals');
  const [localityFilter, setLocalityFilter] = useState('all');

  const rentalLocalities = Array.from(new Set(rentals.map(r => r.locality).filter(Boolean))).sort();
  const projectLocalities = Array.from(new Set(projects.map(p => p.locality).filter(Boolean))).sort();

  const filteredRentals = rentals.filter(r => localityFilter === 'all' || r.locality === localityFilter);
  const filteredProjects = projects.filter(p => localityFilter === 'all' || p.locality === localityFilter);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Tab Switcher & Locality Filter Header */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={`btn-secondary ${activeTab === 'rentals' ? 'glow-box' : ''}`}
            onClick={() => { setActiveTab('rentals'); setLocalityFilter('all'); }}
            style={{ background: activeTab === 'rentals' ? 'rgba(99,102,241,0.25)' : undefined, borderColor: activeTab === 'rentals' ? '#6366f1' : undefined }}
          >
            <Home size={18} /> Rentals Hub ({rentals.length})
          </button>

          <button 
            className={`btn-secondary ${activeTab === 'projects' ? 'glow-box' : ''}`}
            onClick={() => { setActiveTab('projects'); setLocalityFilter('all'); }}
            style={{ background: activeTab === 'projects' ? 'rgba(99,102,241,0.25)' : undefined, borderColor: activeTab === 'projects' ? '#6366f1' : undefined }}
          >
            <Building2 size={18} /> Builder Projects ({projects.length})
          </button>
        </div>

        <div style={{ minWidth: '200px' }}>
          <select 
            className="input-field"
            value={localityFilter}
            onChange={(e) => setLocalityFilter(e.target.value)}
          >
            <option value="all">Filter by Locality (All)</option>
            {(activeTab === 'rentals' ? rentalLocalities : projectLocalities).map(loc => (
              <option key={loc} value={loc}>{loc.toUpperCase()}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Rentals Grid */}
      {activeTab === 'rentals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredRentals.slice(0, 48).map(rental => {
            const titleLocalityMismatch = rental.title && rental.locality && !rental.title.toLowerCase().includes(rental.locality.toLowerCase());

            return (
              <div key={rental.listing_id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-verified">{rental.property_type}</span>
                  <span className="badge badge-live">For Rent</span>
                  {titleLocalityMismatch && (
                    <span className="badge badge-fake" title="Title locality disagrees with locality field!">
                      Title Locality Discrepancy
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#9ca3af' }}>{rental.listing_id}</span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>
                  {rental.title || `${rental.bedroom} BHK in ${rental.locality}`}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '16px' }}>
                  <MapPin size={14} color="#6366f1" />
                  <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>Field Locality: {rental.locality}</span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Monthly Rent:</span>
                    <strong style={{ color: '#34d399', fontSize: '1.1rem' }}>₹{rental.price.toLocaleString()} / mo</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Deposit:</span>
                    <span style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>₹{rental.deposit?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', gap: '12px', marginTop: 'auto' }}>
                  <div>{rental.bedroom} BHK / {rental.bathroom} Bath</div>
                  <div>{rental.carpet_area} sqft</div>
                  <div>Furnished: {rental.furnishing}</div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Projects Grid */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredProjects.slice(0, 48).map(project => (
            <div key={project.project_id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-verified">{project.project_status}</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {project.project_id}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                {project.apartment_name}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, marginBottom: '12px' }}>
                Developer: {project.developer_name}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '16px' }}>
                <MapPin size={14} color="#6366f1" />
                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{project.locality}</span>
              </div>

              <div style={{ background: 'rgba(99,102,241,0.08)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Project Price Range (Unit Discrepancy: Values in Lakhs)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
                  ₹{project.price_min} Lakhs - ₹{project.price_max} Lakhs
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                  (₹{(project.price_min * 100000).toLocaleString()} - ₹{(project.price_max * 100000).toLocaleString()})
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '16px' }}>
                <div>Total Units: <strong>{project.total_units}</strong></div>
                <div>Towers: <strong>{project.total_towers}</strong></div>
                <div>Floors: <strong>{project.total_floors}</strong></div>
                <div>Reported Listings: <strong>{project.total_listings}</strong></div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 'auto' }}>
                RERA: {project.rera_number || 'N/A'}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
