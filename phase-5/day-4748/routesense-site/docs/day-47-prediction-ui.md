# Day 47 — React Prediction UI

## Objective

Connect the React prediction form to the Flask prediction API and display the returned ML result.

## Implementation

The frontend now uses `frontend/src/lib/api.js` as the single API configuration point.

The prediction workflow is:

```text
Prediction Form
    ↓
POST /api/predict
    ↓
Flask + trained scikit-learn model
    ↓
Risk score / level / delay estimate
    ↓
React prediction result
```

The form sends:

- distance
- transport mode
- cargo category
- weather condition
- carrier rating
- traffic congestion
- cargo weight

The UI shows the server-generated risk level and score after a successful prediction.

## Error Handling

The UI now:

- shows a loading state while the model is running
- prevents duplicate submission while predicting
- displays backend/network errors as user-facing toast messages
- does not silently create a fake local shipment when the API is unavailable

## API Configuration

Local:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Production:

```env
VITE_API_BASE_URL=https://<your-deployed-flask-api>
```

## Verification

The frontend source is prepared for the Day 49 production API. Run `npm run build` from `frontend/` before deployment and verify the generated `dist/` directory.
