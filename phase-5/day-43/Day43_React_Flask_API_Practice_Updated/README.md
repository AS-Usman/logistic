# INNOLIFT VENTURES | DAY 43
## API Response & Frontend-Backend Practice

This is the Day 42 project upgraded specifically for Day 43.

### What was added for Day 43

1. GET `/api/students` on page load.
2. `try...catch` around API calls.
3. `response.ok` checks for GET and POST.
4. Error UI: `Unable to load students.`
5. `finally` to stop loading after the request completes.
6. Loading spinner/message.
7. Empty-state UI: `No students found.`
8. Retry GET button after an API failure.
9. API response summary displayed in the UI.
10. New student added from the returned POST response without refresh.

### Run backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Flask:
`http://127.0.0.1:5000`

### Run frontend

Open a second VS Code terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL, normally:
`http://localhost:5173`

### Day 43 practical tests

#### Test 1 — Empty state
Start both servers while `students = []`.

Expected:
`No students found.`

#### Test 2 — Failure case
Stop Flask with `Ctrl + C`, then refresh React.

Expected:
`Unable to load students.`

#### Test 3 — Full flow
1. Start Flask and React.
2. React sends GET `/api/students`.
3. Fill the form.
4. Submit.
5. React sends POST `/api/students`.
6. Flask validates the fields.
7. Flask returns the created student as JSON.
8. React shows the success message.
9. React adds the returned student to the list.
10. No page refresh is required.

### Viva explanation

When Submit is clicked:
`onSubmit → preventDefault → loading true → fetch POST → Flask validation → JSON response → response.ok → setStudents → React re-renders → loading false`.

### Postman
POST:
`http://127.0.0.1:5000/api/students`

Body → raw → JSON:

```json
{
  "name": "Usman",
  "email": "usman@gmail.com",
  "course": "React JS"
}
```
