from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.model.base import Base

if TYPE_CHECKING:
    from app.model.todos import Todo


class Author(Base):
    __tablename__ = "authors"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    todos: Mapped[list["Todo"]] = relationship(back_populates="author", cascade="all, delete-orphan")

