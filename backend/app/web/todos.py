from fastapi import APIRouter
from model.todos_schema import TodoCreate, TodoResponse, TodoUpdate
import service.todos as service


router = APIRouter(prefix="/todos", tags=["todos"])


# CRUD ops on Todos

@router.get("/")
async def get_all() ->  list[TodoResponse]:
    return service.get_all()


@router.get("/{todo_id}")
async def get_by_id(todo_id: int) -> TodoResponse | None:
    return service.get_by_id(todo_id)


@router.post("/")
async def create(todo: TodoCreate) -> TodoResponse:
    return service.create(todo)


@router.patch("/")
async def update(todo_id: int, editedTodo: TodoUpdate) -> TodoResponse | None:
    return service.update(todo_id, editedTodo)


@router.delete("/{todo_id}")
async def delete(todo_id: int) -> TodoResponse | None:
    return service.delete(todo_id)
