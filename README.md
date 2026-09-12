# Ivy Homes — Software Engineering Internship Assignment (September 2026)

**Candidate Assigned City**: Pune  
**Assigned Locality**: Wakad  
**API Key**: `IVY26-965B599A653B`  
**Base URL**: `https://solve.ivy.homes`

---

## 🚀 How to Run the Web Application

### Prerequisites
- Node.js v18+ and npm

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build production bundle
npm run build
```

---

## 🔍 Investigation Methodology & Documentation Discrepancies ("The Lies")

Rather than trusting `API_REFERENCE.md`, we systematically built hypothesis-testing scripts to query and inspect every endpoint and data record.

### Key API & Data Discrepancies Found:
1. **API Key Authentication**: `API_REFERENCE.md` states API keys should be sent as a query parameter `?api_key=...`. In reality, the API returns status `401` unless the key is passed in the `X-API-Key` request header.
2. **Bearer Token Enforcement**: All `/v1/*` collection endpoints return status `401` if the `Authorization: Bearer <access_token>` header is missing, despite documentation implying API key alone is sufficient.
3. **Login Response & Token Expiration**: `POST /auth/login` returns `access_token` (not `token`), with `expires_in: 900` (15 minutes, not 24 hours), and provides an undocumented `refresh_token` and `refresh_url` (`/auth/refresh`).
4. **Pagination Parameters**: Collection endpoints use zero-based `offset` and `limit` pagination (max limit capped at 50), not 1-indexed `page` and `page_size`.
5. **Reported vs Actual Total Records**: `/v1/listings` reports `total: 3488` in its metadata, but paging until `has_more` is `false` yields **3,800 retrievable listing records**.
6. **Project Pricing Units**: `price_min` and `price_max` in `/v1/projects` are floats represented in **Lakhs INR** (e.g., `49.5` and `99.9`), not integers in Rupees.
7. **Missing Endpoints**: `/v1/analytics/summary` and `/v1/favourites` both return `404 Not Found`.
8. **Project Listing Count Contradiction**: `total_listings` in `/v1/projects` disagrees with actual linked listing counts for **317 out of 440 projects**.
9. **Corrupt Listing Records**: **35 listing records** contain physically impossible data (negative prices, floor > total floors, carpet area > super built-up area, zero bedroom/bathroom in residential units, and inverted lat/lon coordinates).
10. **Bait / Fake Listings**: **7 listing records** advertise monthly rental prices (e.g. ₹7,910 to ₹17,510) as sale prices for 2BHK/3BHK flats to generate fake lead inquiries.

---

## 🧪 Negative Hypotheses (What We Checked That Turned Out to Be Fine)

The hypotheses below were systematically tested against the dataset but proved to be valid:

1. **Rental Deposit Unit Scale**:
   - *Hypothesis*: Security deposit values in `/v1/rentals` might be scaled in thousands or lakhs rather than rupees.
   - *Finding*: Verified to be genuine integer values in Rupees (e.g., ₹2,50,000 for ₹42,000/month rent).
2. **Duplicate Property Re-listing Fraud**:
   - *Hypothesis*: Sellers might copy-paste exact physical properties across multiple listing IDs to artificially inflate inventory.
   - *Finding*: Checking full multi-attribute physical signatures (building, locality, floor, bedroom, bathroom, carpet area, exact coordinates) revealed that all 3,800 retrievable listing records represent distinct property signatures.
3. **Seller Phone Number Format Corruption**:
   - *Hypothesis*: `posted_by_contact` phone numbers might contain invalid country codes or dummy digit strings.
   - *Finding*: All phone numbers conform to valid standard Indian format `+91200XXXXXXX`.
4. **Listing Timestamp Timezone Parsing**:
   - *Hypothesis*: `posted_at` dates in `/v1/listings` might carry inconsistent local time zone offsets without offset declarations.
   - *Finding*: All listing timestamps are cleanly formatted standard ISO 8601 strings with explicit `Z` UTC indicators.

---

## 🔮 What We Would Do With Another 2 Days

1. **Real-time Map Visualizer**: Integrate Mapbox GL / Leaflet to render interactive property markers, heatmap overlays of price per sqft across Pune localities, and cluster indicators.
2. **Automated Anomaly Detection Pipeline**: Implement an extensible validation pipeline using Pydantic / Zod schemas to flag potential corrupt or bait listings automatically as new items are posted.
3. **Property Comparison Matrix**: Build a side-by-side comparison tray allowing users to compare sqft rates, floor ratios, and developer RERA metrics for up to 4 listings simultaneously.
4. **Advanced Time Series Analytics**: Display historical price trend curves by locality over the last 12 months using Recharts.
