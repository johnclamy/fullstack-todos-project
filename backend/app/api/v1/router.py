from fastapi import APIRouter
from app.api.v1.endpoints import authors, todos


api_router = APIRouter()
api_router.include_router(todos.router, prefix="/todos", tags=["todos"])
api_router.include_router(authors.router, prefix="/authors", tags=["authors"])