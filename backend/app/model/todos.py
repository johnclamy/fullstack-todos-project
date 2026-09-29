from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.model.base import Base

if TYPE_CHECKING:
    from app.model.authors import Author


class Todo(Base):
    __tablename__ = "todos"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), default="")
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
    author_id: Mapped[int] = mapped_column(Integer, ForeignKey("authors.id"), nullable=False)
    author: Mapped["Author"] = relationship(back_populates="todos")
