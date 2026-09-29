import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.data.db import engine
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP ---
    print("Attempting to connect to DB...")
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        print("Successfully connected to DB!")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

    yield

    # --- SHUTDOWN ---
    print("Shutting down application...")
    print("Closing all database connections in the pool...")
    await engine.dispose()
    print("Database connection pool safely cleared.")


app = FastAPI(
    title="Todo App",
    description="A nice todo app",
    version="0.1.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def read_root():
    return {"endpoint": "Root"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="localhost",
        port=8000,
        reload=True
    )
