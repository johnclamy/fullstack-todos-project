# Full Stack TODOs Project

Tagline: Keep your tasks organized, visible, and always moving forward.

## Overview

This project is a full-stack task management application built with a modern API-first backend and a responsive frontend. It allows users to create, view, update, and delete todo items while also supporting author-related records and structured data persistence.

The application is designed as a practical example of a real-world web stack combining FastAPI, SQLAlchemy, PostgreSQL, and Next.js. It demonstrates how a client-side interface can interact with a REST API to manage data in a clean, maintainable architecture.

## Key Features

- Create, read, update, and delete todo tasks
- Track task completion status and metadata
- Manage associated author records
- REST API built with FastAPI and async SQLAlchemy
- PostgreSQL-backed persistence using Alembic migrations
- Next.js frontend with a modern App Router setup
- Responsive UI for browsing and editing tasks

## Tech Stack

### Backend

- Python 3.12
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL + asyncpg
- Alembic for database migrations
- Pydantic for validation and schemas

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- ESLint for linting

## Architecture

The project is split into two main parts:

- Backend: FastAPI app that exposes API routes under /api/v1
- Frontend: Next.js app that consumes the backend and renders the user interface

The backend uses SQLAlchemy async sessions and a database engine configured via environment variables. The frontend communicates with the API through service modules and fetch helpers, making it easy to keep the UI and data layer decoupled.

## Project Structure

```text
fullstack-todos-project/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── data/
│   │   ├── model/
│   │   └── service/
│   ├── migrations/
│   ├── main.py
│   ├── pyproject.toml
│   └── .env
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── package.json
│   └── README.md
├── README.md
└── .gitignore
```

## API Overview

The backend exposes endpoints grouped by resource:

- /api/v1/todos
- /api/v1/authors

These routes support the main CRUD operations for todo items and their related author information.

## Getting Started

### 1. Configure the backend

The backend reads its database connection from a .env file in the backend folder. The current project configuration uses PostgreSQL:

```env
DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/todo_db
```

Make sure PostgreSQL is running locally and that the database exists before starting the app.

### 2. Install backend dependencies

From the backend directory:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
```

### 3. Run the backend

```bash
cd backend
uvicorn main:app --reload
```

The API will be available at:

- <http://localhost:8000>

### 4. Install frontend dependencies

From the frontend directory:

```bash
npm install
```

### 5. Run the frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at:

- <http://localhost:3000>

## Database Notes

The project includes SQLAlchemy models and Alembic migration support for managing schema changes over time. This makes it suitable for extending the application with additional fields, relationships, or business logic without reworking the data layer from scratch.

## Use Case

This app is ideal for learning full-stack development patterns, experimenting with FastAPI + Next.js integration, and building a simple but realistic task tracker with proper API and UI separation.

## License

This project is intended for learning and demonstration purposes unless otherwise specified by the repository owner.
