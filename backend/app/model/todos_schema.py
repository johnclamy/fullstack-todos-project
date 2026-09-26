from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.model.author_schema import AuthorResponse, AuthorWithTodosResponse


# ==========================================
# BASE SCHEMAS & CONFIGURATION
# ==========================================

class TodoBase(BaseModel):
    """Core fields shared across most schemas."""
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
        validate_assignment=True
    )

    title: str = Field(..., min_length=1, max_length=100, description="The title of the todo item.")
    description: str = Field("", max_length=1000, description="Detailed explanation of the task.")


# ==========================================
# INPUT SCHEMAS (Client -> Server)
# ==========================================

class TodoCreate(TodoBase):
    """When creating a todo, the client must provide the author's ID."""
    author_id: int = Field(..., description="The ID of the author who owns this todo.")

   
class TodoUpdate(BaseModel):
    """Used for partial updates (PATCH requests).
    All fields are optional, allowing the client to update just one field."""
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    
    title: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, max_length=1000)
    is_completed: bool | None = Field(None)
    author_id: int | None = Field(None, description="Reassign this todo to a different author.")


# ==========================================
# OUTPUT SCHEMAS (Server -> Client)
# ==========================================

class TodoResponse(TodoBase):
    """Standard todo response containing the scalar author ID."""
    id: int
    is_completed: bool
    author_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class TodoWithAuthorResponse(TodoResponse):
    """Advanced response that embeds the full Author details.
    Perfect for a front-end view requiring author information instantly.
    """
    author: AuthorResponse


AuthorWithTodosResponse.model_rebuild(_types_namespace={"TodoResponse": TodoResponse})
