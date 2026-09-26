from __future__ import annotations
from typing import TYPE_CHECKING
from pydantic import BaseModel, Field, ConfigDict, EmailStr

if TYPE_CHECKING:
    from app.model.todos_schema import TodoResponse


# ==========================================
# BASE SCHEMAS & CONFIGURATION
# ==========================================

class AuthorBase(BaseModel):
    """Core Author fields."""
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
        validate_assignment=True
    )

    name: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="The author's full name."
    )
    
    email: EmailStr
    

# ==========================================
# INPUT SCHEMAS (Client -> Server)
# ==========================================

class AuthorCreate(AuthorBase):
    """Used strictly for creating a new author."""
    pass


class AuthorUpdate(BaseModel):
    """Used for partial updates (PATCH). Both fields are completely optional."""
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    
    name: str | None = Field(None, min_length=1, max_length=50)
    email: EmailStr | None = Field(None)


# ==========================================
# OUTPUT SCHEMAS (Server -> Client)
# ==========================================

class AuthorResponse(AuthorBase):
    """Used for API responses, guaranteeing system fields."""
    id: int
    model_config = ConfigDict(from_attributes=True)


class AuthorWithTodosResponse(AuthorResponse):
    """Advanced response showing an author and all of their items.
    Perfect for a 'User Profile' dashboard."""
    todos: list[TodoResponse] = Field(default_factory=list)
