from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.model.todos import Todo
from app.model.todos_schema import TodoCreate, TodoUpdate


async def get_all(db: AsyncSession) -> list[Todo]:
    result = await db.execute(select(Todo).order_by(Todo.created_at.desc()))
    return list(result.scalars().all())


async def get_by_id(db: AsyncSession, todo_id: int) -> Todo:
    result = await db.execute(select(Todo).where(Todo.id == todo_id))
    todo = result.scalar_one_or_none()

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found",
        )

    return todo


async def create(db: AsyncSession, todo: TodoCreate) -> Todo:
    new_todo = Todo(**todo.model_dump())
    db.add(new_todo)
    await db.commit()
    await db.refresh(new_todo)
    return new_todo


async def update(db: AsyncSession, todo_id: int, todo: TodoUpdate) -> Todo:
    update_data = todo.model_dump(exclude_unset=True)
    null_fields = [key for key, value in update_data.items() if value is None]
    if null_fields:
        raise ValueError(f"Todo fields cannot be null: {', '.join(null_fields)}")

    current_todo = await get_by_id(db, todo_id=todo_id)

    for key, value in update_data.items():
        setattr(current_todo, key, value)
    await db.commit()
    await db.refresh(current_todo)

    return current_todo


async def delete(db: AsyncSession, todo_id: int) -> None:
    todo = await get_by_id(db, todo_id)
    await db.delete(todo)
    await db.commit()
