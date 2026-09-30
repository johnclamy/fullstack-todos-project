from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.model.author_schema import AuthorCreate, AuthorUpdate
from app.model.authors import Author
from app.model.todos import Todo


async def get_all(db: AsyncSession) -> list[Author]:
    result = await db.execute(select(Author).order_by(Author.id))
    return list(result.scalars().all())


async def get_by_id(db: AsyncSession, author_id: int) -> Author:
    result = await db.execute(select(Author).where(Author.id == author_id))
    author = result.scalar_one_or_none()

    if author is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Author not found",
        )

    return author


async def create(db: AsyncSession, author: AuthorCreate) -> Author:
    new_author = Author(**author.model_dump())
    db.add(new_author)
    await db.commit()
    await db.refresh(new_author)
    return new_author


async def update(
    db: AsyncSession,
    author_id: int,
    author: AuthorUpdate,
) -> Author:
    update_data = author.model_dump(exclude_unset=True)
    null_fields = [key for key, value in update_data.items() if value is None]
    if null_fields:
        raise ValueError(f"Author fields cannot be null: {', '.join(null_fields)}")

    current_author = await get_by_id(db, author_id=author_id)

    for key, value in update_data.items():
        setattr(current_author, key, value)
    await db.commit()
    await db.refresh(current_author)

    return current_author


async def delete(db: AsyncSession, author_id: int) -> None:
    author = await get_by_id(db, author_id=author_id)
    result = await db.execute(
        select(Todo.id).where(Todo.author_id == author_id).limit(1)
    )
    if result.scalar_one_or_none() is not None:
        raise ValueError(f"Author {author_id} still owns todos")

    await db.delete(author)
    await db.commit()