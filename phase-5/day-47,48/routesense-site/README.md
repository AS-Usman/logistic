# SupplyIQ — Delivery Delay & Route Risk Predictor

SupplyIQ is a full-stack logistics intelligence application that combines a React frontend, Flask REST API, MySQL persistence, and a trained scikit-learn model to estimate shipment delay risk.

## Architecture

```text
User
  ↓
React + Vite frontend
  ↓ HTTPS / JSON
Flask REST API
  ├── MySQL (shipments, users, prediction history)
  └── scikit-learn ML model (route/weather/cargo risk)
  ↓
JSON response
  ↓
React UI
```

The repository also contains a Node/Express implementation under `backend/` for earlier RouteSense practice work. The Day 49 production path is the **Flask + MySQL + ML** application under `backend/python-flask/`.

## Main Features

- Shipment management: list, create, view, and delete shipments
- Flask user registration and session-based login
- MySQL persistence
- Live shipment risk prediction through `POST /api/predict`
- Bundled RandomForestRegressor model
- Prediction history stored in the `predictions` table when a matching shipment exists
- Frontend loading/error states for API failures
- Environment-based frontend API URL
- CORS and secure production session-cookie configuration
- Vite production build
- Vercel and Render deployment configuration

## Technologies

- React 18
- Vite
- Flask 3
- Python
- MySQL
- mysql-connector-python
- scikit-learn
- pandas / NumPy
- Flask-CORS
- Vercel (frontend target)
- Render (backend target)

## Project Structure

```text
routesense-site/
├── backend/
│   ├── python-flask/
│   │   ├── app.py
│   │   ├── db.py
│   │   ├── schema.sql
│   │   ├── model.pkl
│   │   ├── train_model.py
│   │   └── requirements.txt
│   └── ... Node/Express practice implementation
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/api.js
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── docs/
├── render.yaml
├── vercel.json
├── .env.example
└── .gitignore
```

## Environment Variables

### Flask backend

Create `backend/python-flask/.env` locally, or configure these variables in the hosting platform:

```env
MYSQL_HOST=your-mysql-host
MYSQL_PORT=3306
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_DB=supplyiq
FLASK_ENV=production
FLASK_DEBUG=0
SECRET_KEY=replace-with-a-long-random-secret
CORS_ORIGINS=https://your-frontend.vercel.app
```

Optional managed-MySQL TLS variables are documented in `.env.example`.

### React frontend

For local development, create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For Vercel/Netlify, set `VITE_API_BASE_URL` to the public Flask backend URL.

**Never commit `.env`, `.env.local`, database passwords, API keys, or secret keys.**

## Local Setup

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Install Flask dependencies

```bash
cd ../backend/python-flask
python -m pip install -r requirements.txt
```

### 3. Configure MySQL

Create a MySQL database/user and configure the backend environment variables. Then the Flask application initializes the tables from `schema.sql` at startup.

### 4. Start Flask

```bash
cd backend/python-flask
python app.py
```

Health check:

```text
GET http://localhost:5000/api/health
```

### 5. Start React

In another terminal:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown by the terminal (normally `http://localhost:5173`).

## Production Build

```bash
cd frontend
npm run build
```

The production files are written to `frontend/dist/`.

## Deployment

### Frontend — Vercel

The root `vercel.json` is configured for a Vite build.

- Build command: `npm --prefix frontend install && npm --prefix frontend run build`
- Output directory: `frontend/dist`
- Environment variable: `VITE_API_BASE_URL=<public Flask URL>`

### Backend — Render

`render.yaml` defines a Python web service using:

- Root directory: `backend/python-flask`
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`
- Health check: `/api/health`

Configure the MySQL and `CORS_ORIGINS` environment variables in Render before testing.

**Live URLs:** deployment-specific URLs are intentionally not fabricated in this repository. Replace the placeholders in `docs/day-49-application-deployment.md` after the actual Vercel and Render deployments are completed.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Backend health |
| GET | `/api/health` | Deployment health check |
| POST | `/api/register` | Register user |
| POST | `/api/login` | Create Flask session |
| GET | `/api/profile` | Check authenticated session |
| POST | `/api/logout` | End session |
| GET | `/api/shipments` | Fetch shipments |
| POST | `/api/shipments` | Create shipment |
| GET | `/api/shipments/<id>` | Fetch one shipment |
| DELETE | `/api/shipments/<id>` | Delete shipment |
| POST | `/api/predict` | Run the trained ML risk model |

The older non-`/api` shipment/auth paths are retained as compatibility aliases.

### Prediction request example

```json
{
  "distance": 1280,
  "transportMode": "truck",
  "cargoCategory": "perishable",
  "weatherCondition": "rain",
  "carrierRating": "A",
  "trafficCongestion": 45,
  "cargoWeight": 4500
}
```

The response includes the predicted risk level/score, model name, confidence indicator, estimated delay, and recommendations.

## Security Checklist

- `.env` is ignored by Git
- Production secrets are configured as hosting-platform environment variables
- Flask production sessions use secure, HTTP-only cookies
- CORS is restricted to configured frontend origins
- Passwords are hashed with Werkzeug
- API errors avoid exposing database exception details to clients

## Internship Day 49 Status

The repository has been prepared for the complete-application deployment workflow:

- [x] React frontend configured for a non-localhost API URL
- [x] Flask `/api/predict` endpoint connected to a trained scikit-learn model
- [x] MySQL shipment and prediction persistence retained
- [x] Production build/deployment configuration added
- [x] Error handling improved for frontend API failures
- [x] Deployment documentation created
- [ ] Actual public frontend/backend URLs — require deployment through the user's hosting accounts
- [ ] Real deployment screenshots — must be captured after deployment

See `docs/day-49-application-deployment.md` for the final deployment checklist.
