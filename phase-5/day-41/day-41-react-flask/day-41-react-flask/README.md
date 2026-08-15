# Day 41 — React + Flask Integration

This project completes the Day 41 internship tasks.

## Tasks Completed

- Flask GET API: `/api/students`
- Minimum 5 student records
- JSON API response
- React `useEffect()`
- Native `fetch()`
- `response.json()`
- React `useState()`
- Student data displayed in a responsive table
- API flow documentation

## How to Run

### 1. Start Flask Backend

Open a terminal in the `backend` folder:

```powershell
pip install -r requirements.txt
python app.py
```

Backend:

`http://127.0.0.1:5000`

Test API:

`http://127.0.0.1:5000/api/students`

### 2. Start React Frontend

Open another terminal in the `frontend` folder:

```powershell
npm install
npm run dev
```

Open the URL shown by Vite, normally:

`http://localhost:5173`

## Important

Run both servers at the same time.

The React frontend gets all student data from Flask. No student records are hardcoded in the React component.
