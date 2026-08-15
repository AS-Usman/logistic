# INNOLIFT VENTURES - Day 42

React Student Form → Flask POST API

## Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Runs on http://127.0.0.1:5000

## Postman
POST http://127.0.0.1:5000/api/students

Body → raw → JSON:
```json
{
  "name": "Usman",
  "email": "usman@gmail.com",
  "course": "React JS"
}
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal.

## Note
Students are stored in Flask memory, so they reset when the Flask server restarts.
