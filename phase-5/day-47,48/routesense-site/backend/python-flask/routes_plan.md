# SupplyIQ — API Routes Specification Plan (Day 39)

## 📌 Project Overview
**SupplyIQ** is an AI-driven logistics intelligence system that predicts delivery delay exposures and route risk factors based on shipment characteristics, distance, weather conditions, and carrier telemetry.

Day 39 establishes the API route architecture, database schema expansion, health-check endpoint, and scaffolding TODOs for the final backend completion on Day 40.

---

## 🗺️ API Route Design Matrix

| Method | Endpoint Route | Purpose | Auth Required (`login_required`) | Uses ML Model? | Stage |
|---|---|---|---|---|---|
| `GET` | `/` | Backend Server Health Check | ❌ Public | ❌ No | Day 39 |
| `POST` | `/register` | User Registration with Werkzeug Hashing | ❌ Public | ❌ No | Day 37 |
| `POST` | `/login` | User Login & Session Establishment | ❌ Public | ❌ No | Day 38 |
| `POST` | `/logout` | User Logout & Session Invalidation | ❌ Public | ❌ No | Day 38 |
| `GET` | `/profile` | User Profile & Active Session Metadata | ✅ `@login_required` | ❌ No | Day 38 |
| `POST` | `/api/shipments` | Create & Store New Shipment Record | ✅ `@login_required` | ❌ No | Day 40 TODO |
| `GET` | `/api/shipments` | Retrieve History of Tracked Shipments | ✅ `@login_required` | ❌ No | Day 40 TODO |
| `GET` | `/api/shipments/<id>` | Retrieve Single Shipment Details | ✅ `@login_required` | ❌ No | Day 40 TODO |
| `PUT` | `/api/shipments/<id>` | Update Shipment Status / Delay Days | ✅ `@login_required` | ❌ No | Day 40 TODO |
| `DELETE` | `/api/shipments/<id>` | Delete Shipment Record | ✅ `@login_required` | ❌ No | Day 40 TODO |
| `POST` | `/api/predict` | Predict Delivery Delay & Route Risk | ✅ `@login_required` | ✅ **Yes (Day 40)** | Day 40 TODO |

---

## 🔐 Authentication & Protection Architecture

- **Public Endpoints**: `/`, `/register`, `/login`, `/logout`. These allow unauthenticated clients to register, log in, or check server status.
- **Protected Endpoints**: All `/api/*` endpoints and `/profile` require an active Flask session cookie established via `/login`.
- **Decorator Enforcement**: Custom `@login_required` decorator checks `session.get('user_id')`. Unauthenticated requests to protected endpoints return `401 Unauthorized`:
  ```json
  { "error": "Login required" }
  ```

---

## 🤖 ML Prediction Route Architecture (`POST /api/predict`)

The ML prediction route is planned for integration on **Day 40**.

### Target Endpoint Specifications
- **Route:** `POST /api/predict`
- **Protection:** `@login_required`
- **Planned Input Features (JSON):**
  ```json
  {
    "shipment_id": "SHP001",
    "origin": "Chennai",
    "destination": "Bangalore",
    "distance": 350.0,
    "weather": "Rainy",
    "transport_mode": "Truck",
    "cargo_weight": 4500
  }
  ```
- **Planned Output Format (JSON):**
  ```json
  {
    "shipment_id": "SHP001",
    "predicted_risk": "High Risk",
    "estimated_delay_days": 2.5,
    "confidence_score": 0.88,
    "recommendation": "Reroute via NH44 to avoid severe rain backlog"
  }
  ```
- **Status:** Scaffolding placeheld in `app.py` with `# TODO Day 40`.

---

## 📝 Day 40 Backend Implementation Roadmap

1. **Task 1**: Refactor `/shipments` endpoints to `/api/shipments` with `@login_required` protection.
2. **Task 2**: Connect trained SupplyIQ ML model (`.pkl` / inference script) inside `POST /api/predict`.
3. **Task 3**: Record prediction results into the `predictions` table in MySQL (`id`, `shipment_id`, `predicted_risk`, `prediction_confidence`).
4. **Task 4**: Perform end-to-end integration testing and production readiness checks.
