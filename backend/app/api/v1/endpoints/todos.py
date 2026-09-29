from fastapi import APIRouter, HTTPException, status
from app.model.todos_schema import TodoCreate, TodoResponse, TodoUpdate
import app.service.todos as service


router = APIRouter()


# CRUD ops on Todos

@router.get("/", response_model=list[TodoResponse], status_code=status.HTTP_200_OK)
async def get_all() -> list[TodoResponse]:
    return service.get_all()


@router.get(
    "/{todo_id}",
    response_model=TodoResponse,
    status_code=status.HTTP_200_OK,
)
async def get_by_id(todo_id: int) -> TodoResponse:
    todo = service.get_by_id(todo_id)
    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo {todo_id} does not exist",
        )
    return todo


@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create(todo: TodoCreate) -> TodoResponse:
    try:
        return service.create(todo)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.patch(
    "/",
    response_model=TodoResponse,
    status_code=status.HTTP_200_OK,
)
async def update(todo_id: int, editedTodo: TodoUpdate) -> TodoResponse:
    try:
        todo = service.update(todo_id, editedTodo)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo {todo_id} does not exist",
        )
    return todo


@router.delete(
    "/{todo_id}",
    response_model=TodoResponse,
    status_code=status.HTTP_200_OK,
)
async def delete(todo_id: int) -> TodoResponse:
    todo = service.delete(todo_id)
    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo {todo_id} does not exist",
        )
    return todo