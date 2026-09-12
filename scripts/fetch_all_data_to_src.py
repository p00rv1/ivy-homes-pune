import urllib.request
import urllib.parse
import json
import os

BASE_URL = "https://solve.ivy.homes"
API_KEY = "IVY26-965B599A653B"
DEMO_EMAIL = "demo1@ivy.homes"
DEMO_PASS = "846e743015"

SRC_DATA = os.path.join(os.path.dirname(__file__), "..", "src", "data")
os.makedirs(SRC_DATA, exist_ok=True)

def api_request(method, endpoint, params=None, body=None, headers=None):
    if headers is None:
        headers = {}
    headers['X-API-Key'] = API_KEY
    url = BASE_URL + endpoint
    if params:
        url += "?" + urllib.parse.urlencode(params)
        
    data_bytes = None
    if body is not None:
        data_bytes = json.dumps(body).encode('utf-8')
        headers['Content-Type'] = 'application/json'

    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read().decode('utf-8')
            return resp.status, resp.headers, json.loads(data)
    except urllib.error.HTTPError as e:
        body_text = e.read().decode('utf-8')
        try:
            return e.code, e.headers, json.loads(body_text)
        except Exception:
            return e.code, e.headers, body_text
    except Exception as e:
        return 0, {}, str(e)

def get_auth_token():
    status, headers, auth_data = api_request("POST", "/auth/login", body={"email": DEMO_EMAIL, "password": DEMO_PASS})
    if status == 200 and isinstance(auth_data, dict) and "access_token" in auth_data:
        return auth_data["access_token"]
    raise RuntimeError(f"Failed to authenticate: {auth_data}")

def fetch_collection(endpoint, name):
    print(f"\n--- Fetching full collection: {name} ({endpoint}) ---")
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    all_records = []
    offset = 0
    limit = 50
    page_count = 0
    total_expected = None

    while True:
        status, resp_headers, res = api_request("GET", endpoint, params={"offset": offset, "limit": limit}, headers=headers)
        if status == 401:
            print("Token expired, refreshing auth token...")
            token = get_auth_token()
            headers = {"Authorization": f"Bearer {token}"}
            continue
        if status != 200:
            print(f"Error at offset {offset}: status {status}, response: {res}")
            break
        
        page_count += 1
        results = res.get("results", [])
        total_expected = res.get("total", total_expected)
        has_more = res.get("has_more", False)
        count = res.get("count", len(results))

        all_records.extend(results)
        print(f"[{name}] Page {page_count}: offset={offset}, fetched {len(results)} items. Cumulative: {len(all_records)}/{total_expected}")

        if not has_more or len(results) == 0:
            print(f"Completed {name}. Total fetched: {len(all_records)}")
            break
        
        offset += count

    out_file = os.path.join(SRC_DATA, f"{name}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(all_records, f, ensure_ascii=False)
    print(f"Saved {len(all_records)} records to {out_file}")
    return all_records

if __name__ == "__main__":
    fetch_collection("/v1/listings", "listings")
    fetch_collection("/v1/rentals", "rentals")
    fetch_collection("/v1/projects", "projects")
