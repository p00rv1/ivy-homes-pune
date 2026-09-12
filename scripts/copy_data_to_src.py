import json
import os

DATA_RAW = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
SRC_DATA = os.path.join(os.path.dirname(__file__), "..", "src", "data")
os.makedirs(SRC_DATA, exist_ok=True)

for name in ["listings", "rentals", "projects"]:
    raw_path = os.path.join(DATA_RAW, f"{name}_full.json")
    with open(raw_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    out_path = os.path.join(SRC_DATA, f"{name}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"Copied {len(data)} items to {out_path}")
