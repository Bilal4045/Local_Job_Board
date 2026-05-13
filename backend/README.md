## FastAPI backend for Jobboard

This folder contains a FastAPI + PostgreSQL backend that replaces the original MongoDB/Mongoose Next.js API routes. The React/Next.js frontend remains the same visually; only the API base URL changes.

### Running the backend

1. Create and configure a PostgreSQL database (for example, `jobboard`).
2. Set the `DATABASE_URL` environment variable, for example:

   `postgresql+psycopg2://postgres:postgres@localhost:5432/jobboard`

3. Install dependencies:

   ```bash
   pip install -r backend/requirements.txt
   ```

4. Start the FastAPI server:

   ```bash
   uvicorn backend.main:app --reload
   ```

5. In the Next.js frontend, set `NEXT_PUBLIC_API_URL` to the FastAPI base URL (for example `http://localhost:8000`) so that all client-side `fetch` calls hit this backend.

