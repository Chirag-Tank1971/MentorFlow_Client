## Mentorship Platform Frontend

React + Vite single-page app for the Mentorship Platform backend. It provides UI for authentication, parent and mentor dashboards, and an LLM-powered summarizer.

## Tech stack

- Framework: React 18
- Bundler / dev server: Vite
- Routing: react-router-dom v6
- HTTP client: axios

## Project layout (important files)

```
frontend/
  src/
    main.jsx            # App entry (ReactDOM + BrowserRouter)
    App.jsx             # Routes and layout
    styles.css          # Global styling
    shared/
      apiClient.js      # Axios instance (base URL from env)
      ConfirmModal.jsx  # Reusable confirmation modal
    modules/
      auth/
        AuthContext.jsx
        LoginPage.jsx
        SignupPage.jsx
      parent/
        ParentDashboard.jsx
      mentor/
        MentorDashboard.jsx
      llm/
        SummarizePage.jsx
```

## Environment variables

The frontend reads the backend URL from `VITE_API_BASE_URL`. By default the app expects the backend at `http://localhost:4000`.

Create a local env file (copy the example) and adjust if needed:

```bash
cp frontend/.env.example frontend/.env
# or on Windows PowerShell
Copy-Item frontend\.env.example frontend\.env
```

Example value in `.env`:

```
VITE_API_BASE_URL=http://localhost:4000
```

Note: Vite only exposes variables that begin with `VITE_` to the browser.

## Run the frontend (development)

From the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

Vite will start the dev server (default http://localhost:5173). Ensure the backend is running at the URL configured in `VITE_API_BASE_URL`.

## Application flow (summary)

- Auth: Signup (`/auth/signup`) and Login (`/auth/login`) use the backend endpoints. On login the JWT and user info are stored in `localStorage` and the token is added to `apiClient` headers.
- Redirects: after login users are redirected by their role to `/parent` (PARENT) or `/mentor` (MENTOR).
- Protected pages: the app protects routes based on authentication and role via the `AuthContext` and route wrappers.

## Key pages / features

- Home (`/`): marketing-style landing and links to signup or the summarizer.
- Login (`/login`) and Signup (`/signup`) pages.
- Parent dashboard (`/parent`): manage students (`POST /students`), view bookings (`GET /bookings`), create/delete bookings (`POST /bookings`, `DELETE /bookings/:id`).
- Mentor dashboard (`/mentor`): create lessons (`POST /lessons`), view lesson sessions (`GET /lessons/:id/sessions`), create/delete sessions (`POST /sessions`, `DELETE /sessions/:id`).
- Summarizer (`/summarize`): POST text to `/llm/summarize` and display the returned summary and model name.

## Shared components

- `src/shared/apiClient.js`: axios instance. Example:

```js
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
});
```

Auth code sets `apiClient.defaults.headers.common.Authorization = `Bearer ${token}`` on login so requests include the JWT.

- `src/shared/ConfirmModal.jsx`: reusable confirmation modal used for delete actions. Props: `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmLabel`, `confirmDisabled`, `variant`.

## Styling & UX

- Dark, gradient backgrounds, glassmorphism cards, and a simple, reusable set of button classes (`.btn-primary`, `.btn-ghost`, `.btn-danger`, `.btn-icon`).
- Global styles are in `src/styles.css`.

## Notes

- Ensure `VITE_API_BASE_URL` points to your running backend.
- Create at least one Parent or Mentor account via the signup UI before testing role-protected routes.

---
If you'd like, I can also update `frontend/.env.example` or add a short troubleshooting section. 
