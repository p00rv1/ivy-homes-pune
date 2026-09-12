import React, { useState } from 'react';
import submissionData from '../../submission.json';
import { BarChart3, AlertOctagon, CheckCircle2, FileCode, Layers, ShieldAlert, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export const InsightsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const answers = submissionData.answers;
  const findings = submissionData.findings;

  const categories = Array.from(new Set(findings.map(f => f.category))).sort();

  const filteredFindings = selectedCategory === 'all' 
    ? findings 
    : findings.filter(f => f.category === selectedCategory);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', padding: '10px', borderRadius: '12px', color: 'white' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>API Audit & Intelligence Insights</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Where API data anomalies, dataset calculations, and documentation discrepancies become visible to humans.
            </p>
          </div>
        </div>
      </div>

      {/* Solved 10 Questions Metrics Dashboard */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 color="#10b981" size={22} />
          Part 2 — Verified Dataset Answers (City: Pune, Locality: Wakad)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase' }}>1. Total Retrievable Listings</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#60a5fa', marginTop: '4px' }}>{answers.total_listing_records.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Paged until has_more = false</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase' }}>2. Unique Properties</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>{answers.unique_properties.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Distinct property signatures</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase' }}>3. Active Listings (is_live)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#a78bfa', marginTop: '4px' }}>{answers.active_listings.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Active sale records</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ fontSize: '0.8rem', color: '#f87171', textTransform: 'uppercase' }}>4. Corrupt Listing IDs</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f87171', marginTop: '4px' }}>{answers.corrupt_listing_ids.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Physically impossible records</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase' }}>5. Total Monthly Rent (Wakad)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>₹{answers.total_monthly_rent.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Assigned Locality Wakad</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase' }}>6. Avg Price/sqft (Active 2BHK)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>₹{answers.avg_price_per_sqft_2bhk.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Excluding corrupt & fake IDs</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase' }}>7. Costliest Project</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ec4899', marginTop: '4px' }}>{answers.costliest_project.project_id} (Brigade Park)</div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Max Price: ₹{answers.costliest_project.price_max_inr} Lakhs</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase' }}>8. Listings Posted Last 7 Days</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#818cf8', marginTop: '4px' }}>{answers.listings_last_7_days}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Window [2026-09-03, 2026-09-10)</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(245,158,11,0.3)' }}>
            <div style={{ fontSize: '0.8rem', color: '#fbbf24', textTransform: 'uppercase' }}>9. Fake / Bait Listing IDs</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>{answers.fake_listing_ids.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Bait lead-gen listings</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase' }}>10. Projects Wrong Count</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f43f5e', marginTop: '4px' }}>{answers.projects_with_wrong_listing_count} / 440</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Projects with count mismatch</div>
          </div>

        </div>
      </div>

      {/* Part 3 — Discrepancy Findings Matrix */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert color="#ec4899" size={22} />
              Part 3 — Documentation Discrepancy Audit ("List the Lies")
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '2px' }}>
              Every place the documentation disagrees with actual server behavior ({findings.length} findings compiled)
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className={`btn-secondary ${selectedCategory === 'all' ? 'glow-box' : ''}`}
              onClick={() => setSelectedCategory('all')}
              style={{ padding: '4px 12px', fontSize: '0.8rem', background: selectedCategory === 'all' ? 'rgba(99,102,241,0.25)' : undefined }}
            >
              All ({findings.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`btn-secondary ${selectedCategory === cat ? 'glow-box' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ padding: '4px 12px', fontSize: '0.8rem', textTransform: 'capitalize', background: selectedCategory === cat ? 'rgba(99,102,241,0.25)' : undefined }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Findings List Accordion / Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredFindings.map((finding, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div 
                key={idx} 
                className="glass-panel" 
                style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => setExpandedIndex(isExpanded ? null : idx)}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-verified" style={{ textTransform: 'uppercase' }}>{finding.category}</span>
                      <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '4px', color: '#38bdf8', fontSize: '0.85rem' }}>
                        {finding.endpoint}
                      </code>
                      {finding.evidence.length > 0 && (
                        <span className="badge badge-fake" style={{ fontSize: '0.7rem' }}>
                          {finding.evidence.length} Evidence Records
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'white', marginBottom: '6px' }}>
                      Documented: <span style={{ color: '#9ca3af', fontWeight: 400 }}>"{finding.documented}"</span>
                    </div>

                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#34d399' }}>
                      Actual Behavior: <span style={{ color: '#e5e7eb', fontWeight: 500 }}>"{finding.actual}"</span>
                    </div>
                  </div>

                  <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '0.85rem' }}>
                    <div>
                      <strong style={{ color: '#818cf8', display: 'block', marginBottom: '4px' }}>How Discovered:</strong>
                      <p style={{ color: '#d1d5db' }}>{finding.how_found}</p>
                    </div>

                    <div>
                      <strong style={{ color: '#f472b6', display: 'block', marginBottom: '4px' }}>System Impact:</strong>
                      <p style={{ color: '#d1d5db' }}>{finding.impact}</p>
                    </div>

                    {finding.evidence.length > 0 && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '6px' }}>
                          Evidence IDs ({finding.evidence.length}):
                        </strong>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {finding.evidence.map(evId => (
                            <code key={evId} style={{ background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px', color: '#fcd34d', fontSize: '0.75rem' }}>
                              {evId}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
