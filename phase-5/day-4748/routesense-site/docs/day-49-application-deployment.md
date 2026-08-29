# Day 49 — Complete Application Deployment

## Deployment Goal

```text
User
 ↓
Live React Application
 ↓
Live Flask Backend
 ↓
MySQL + ML Model
 ↓
Response
 ↓
React UI
```

## Current Repository Preparation

The project has been prepared for production deployment:

- React API calls no longer depend on hard-coded `localhost` addresses.
- `VITE_API_BASE_URL` controls the frontend API destination.
- Flask exposes `/api/health`, `/api/shipments`, and `/api/predict`.
- The ML endpoint loads `model.pkl`, a trained scikit-learn RandomForestRegressor.
- MySQL persistence is retained for shipments, users, and prediction history.
- Production Flask sessions use secure HTTP-only cookies.
- CORS is configurable through `CORS_ORIGINS`.
- Vercel and Render deployment configuration files are included.
- `.env` is ignored and no secret values are included in this repository package.

## Hosting Configuration

### Frontend

**Target platform:** Vercel

**Build command:**

```text
npm --prefix frontend install && npm --prefix frontend run build
```

**Output directory:**

```text
frontend/dist
```

**Required environment variable:**

```text
VITE_API_BASE_URL=https://<deployed-flask-backend>
```

### Backend

**Target platform:** Render

**Root directory:**

```text
backend/python-flask
```

**Build command:**

```text
pip install -r requirements.txt
```

**Start command:**

```text
gunicorn app:app
```

**Health check:**

```text
/api/health
```

## Live URLs

These must be filled with the actual URLs after deployment:

```text
Frontend: https://<your-vercel-app>.vercel.app
Backend:  https://<your-render-service>.onrender.com
```

No fabricated live URL is included.

## Environment Variables Used

Backend:

- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DB`
- `SECRET_KEY`
- `FLASK_ENV`
- `FLASK_DEBUG`
- `CORS_ORIGINS`
- optional `MYSQL_SSL_CA`
- optional `MYSQL_SSL_VERIFY`

Frontend:

- `VITE_API_BASE_URL`

## Features to Test After Deployment

### Student-management equivalent: shipment management

This project is a logistics/shipment application, so the assignment's generic student-management test maps to:

1. Open the live application.
2. Load existing shipments.
3. Create a new shipment.
4. Confirm it appears in the UI.
5. Confirm it is stored in MySQL.
6. Refresh the page.
7. Confirm the shipment remains.

### ML Prediction

1. Open the Predictor page.
2. Enter shipment parameters.
3. Submit the form.
4. Confirm `POST /api/predict` succeeds.
5. Confirm the trained model returns a risk score.
6. Confirm the risk result appears in React.
7. Test a second set of inputs.

### Negative Tests

Test:

- missing prediction fields
- invalid distance
- traffic outside 0–100
- cargo weight outside the allowed range
- invalid enum values
- unavailable backend/network

Expected behavior: a useful error response or UI message without a frontend crash.

## Security Review

- [x] `.env` ignored by Git
- [x] Secret values removed from documentation/examples
- [x] Production `SECRET_KEY` supplied through environment variables
- [x] MySQL password supplied through environment variables
- [x] CORS restricted to configured origins
- [x] HTTP-only production session cookie
- [x] Password hashing retained

## Screenshots

Add these real screenshots after deployment:

```text
docs/screenshots/
├── deployed-application.png
├── shipment-management.png
├── successful-ml-prediction.png
└── deployment-status.png
```

Recommended captures:

1. Public frontend homepage/predictor.
2. Shipment list with a newly saved shipment.
3. Successful ML prediction result.
4. Vercel deployment success and/or Render deployment success.

The package cannot truthfully contain live-deployment screenshots before the external deployments have been performed.

## Problems Identified and Fixes

### Hard-coded localhost API URLs

**Problem:** React used `http://localhost:5000` directly.

**Fix:** Added `VITE_API_BASE_URL` and centralized requests in `frontend/src/lib/api.js`.

### Prediction was local-only

**Problem:** The original predictor calculated the risk entirely in React.

**Fix:** Added `POST /api/predict` to Flask and connected the prediction form to the server-side trained model.

### Frontend silently simulated backend failures

**Problem:** Some failures fell back to local storage/simulated login, which could hide deployment problems.

**Fix:** API failures now surface as error messages; shipment writes are not falsely reported as successful when the backend is unavailable.

### Cross-origin production sessions

**Problem:** Separate frontend/backend origins require compatible CORS and cookie settings.

**Fix:** Production Flask sessions use `SameSite=None` and `Secure`, while `CORS_ORIGINS` controls allowed frontend origins.

### Deployment configuration missing

**Fix:** Added `vercel.json` and `render.yaml`.

## Final Deployment Status

**Code preparation:** Complete.

**Actual public deployment:** Pending external Vercel/Render account deployment and MySQL configuration.

**Live URLs:** Pending.

**Deployment screenshots:** Pending actual deployment.
