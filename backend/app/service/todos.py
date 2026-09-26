from datetime import datetime
from app.data import mock_db as data
from app.model.todos_schema import TodoCreate, TodoResponse, TodoUpdate


def get_all() -> list[TodoResponse]:
    """Retrieve all todos from the mock database."""
    return [TodoResponse(**todo) for todo in data.db["todos"].values()]


def get_by_id(todo_id: int) -> TodoResponse | None:
    """Retrieve one todo by ID."""
    todo = data.db["todos"].get(todo_id)
    return TodoResponse(**todo) if todo is not None else None


def create(todo: TodoCreate) -> TodoResponse:
    """Create a todo for an existing author."""
    if todo.author_id not in data.db["authors"]:
        raise ValueError(f"Author {todo.author_id} does not exist")

    data.todo_id_counter += 1
    now = datetime.now()
    new_todo = {
        **todo.model_dump(),
        "id": data.todo_id_counter,
        "is_completed": False,
        "created_at": now,
        "updated_at": now,
    }
    data.db["todos"][data.todo_id_counter] = new_todo
    return TodoResponse(**new_todo)


def update(todo_id: int, changes: TodoUpdate) -> TodoResponse | None:
    """Apply provided fields to a todo and update its timestamp."""
    todo = data.db["todos"].get(todo_id)
    if todo is None:
        return None

    updates = changes.model_dump(exclude_unset=True, exclude_none=True)
    author_id = updates.get("author_id", todo["author_id"])
    if author_id not in data.db["authors"]:
        raise ValueError(f"Author {author_id} does not exist")

    todo.update(updates)
    if updates:
        todo["updated_at"] = datetime.now()
    return TodoResponse(**todo)


def delete(todo_id: int) -> TodoResponse | None:
    """Delete a todo and return the removed record, if it existed."""
    todo = data.db["todos"].pop(todo_id, None)
    return TodoResponse(**todo) if todo is not None else None
