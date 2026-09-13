import json
import os

SUB_PATH = os.path.join(os.path.dirname(__file__), "..", "submission.json")

with open(SUB_PATH, "r", encoding="utf-8") as f:
    sub = json.load(f)

print("=== VERIFYING SUBMISSION.JSON SCHEMA & INTEGRITY ===")

# 1. Root Keys Check
required_root_keys = ["api_key", "candidate", "answers", "findings"]
for rk in required_root_keys:
    assert rk in sub, f"Missing root key: {rk}"
print("[OK] Root keys present:", required_root_keys)

# 2. Candidate Info Check
cand = sub["candidate"]
for ck in ["name", "email", "repo_url", "demo_url"]:
    assert ck in cand, f"Missing candidate field: {ck}"
assert cand["email"].endswith("@mnnit.ac.in"), f"Invalid email domain: {cand['email']}"
print(f"[OK] Candidate email verified: {cand['email']}")

# 3. Answers Keys & Types Check
ans = sub["answers"]
required_answer_keys = [
    "total_listing_records", "unique_properties", "active_listings",
    "corrupt_listing_ids", "total_monthly_rent", "avg_price_per_sqft_2bhk",
    "costliest_project", "listings_last_7_days", "fake_listing_ids",
    "projects_with_wrong_listing_count"
]
for ak in required_answer_keys:
    assert ak in ans, f"Missing answer key: {ak}"

# Verify corrupt_listing_ids sorting
corrupt_ids = ans["corrupt_listing_ids"]
assert corrupt_ids == sorted(corrupt_ids), "corrupt_listing_ids must be sorted!"
print(f"[OK] corrupt_listing_ids sorted ({len(corrupt_ids)} items)")

# Verify fake_listing_ids sorting
fake_ids = ans["fake_listing_ids"]
assert fake_ids == sorted(fake_ids), "fake_listing_ids must be sorted!"
print(f"[OK] fake_listing_ids sorted ({len(fake_ids)} items)")

# Verify costliest_project dict format
cp = ans["costliest_project"]
assert isinstance(cp, dict) and "project_id" in cp and "price_max_inr" in cp, "costliest_project format invalid!"
print(f"[OK] costliest_project verified: {cp}")

# 4. Findings Categories & Schema Check
ALLOWED_CATEGORIES = {
    "auth", "pagination", "units", "filters", "sorting", "timestamps",
    "duplicates", "completeness", "data_quality", "fraud", "consistency",
    "missing_endpoint", "undocumented_endpoint"
}

findings = sub["findings"]
print(f"\nVerifying {len(findings)} findings...")
for idx, f in enumerate(findings):
    for field in ["endpoint", "category", "documented", "actual", "how_found", "impact", "evidence"]:
        assert field in f, f"Finding {idx} missing field: {field}"
    
    cat = f["category"]
    assert cat in ALLOWED_CATEGORIES, f"Finding {idx} has invalid category '{cat}'! Allowed: {ALLOWED_CATEGORIES}"
    
    ev = f["evidence"]
    assert isinstance(ev, list), f"Finding {idx} evidence must be a list!"
    assert len(ev) <= 20, f"Finding {idx} evidence length ({len(ev)}) exceeds 20 item limit!"

print("[OK] All findings meet category & evidence constraints!")
print("\n=== VERIFICATION COMPLETE: ALL CHECKS PASSED 100% CLEAN! ===")
