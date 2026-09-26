from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


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

class TodoCreate(BaseModel):
    """Used strictly for creating a new item. 
    The client cannot pass an ID, status, or timestamps here.
    """
    pass

   
class TodoUpdate(BaseModel):
    """Used for partial updates (PATCH requests).
    All fields are optional, allowing the client to update just one field.
    """
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    
    title: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, max_length=1000)
    is_completed: bool | None = Field(None)


# ==========================================
# OUTPUT SCHEMAS (Server -> Client)
# ==========================================

class TodoResponse(TodoBase):
    """Used for API responses. 
    Includes system-managed fields that the server guarantees will exist.
    """
    # id: int
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    # If you ever use an ORM like SQLAlchemy, this allows Pydantic 
    # to read data directly from database models instead of dictionaries.
    # model_config = ConfigDict(from_attributes=True)
