# Day 48 — Backend Deployment

## Backend

The canonical backend for the deployment path is:

```text
backend/python-flask/app.py
```

It exposes a production health endpoint:

```text
GET /api/health
```

and the ML endpoint:

```text
POST /api/predict
```

## Production Server

Render is configured in the repository with:

```text
Build: pip install -r requirements.txt
Start: gunicorn app:app
Health check: /api/health
Root directory: backend/python-flask
```

## Required Environment Variables

Configure these in the backend hosting service:

```text
MYSQL_HOST
MYSQL_PORT
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DB
SECRET_KEY
FLASK_ENV=production
FLASK_DEBUG=0
CORS_ORIGINS=<public frontend origin>
```

Do not commit these values to GitHub.

## Database

The Flask startup process initializes the tables from `schema.sql`. The database must be reachable from the deployed backend.

## Deployment Verification

After deployment, open:

```text
https://<your-backend-domain>/api/health
```

A successful response reports `"status": "running"` and `"ml_model_loaded": true`.

The actual backend URL is intentionally left as a placeholder until the deployment is performed in the user's hosting account.
