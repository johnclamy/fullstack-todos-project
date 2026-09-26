from pydantic import BaseModel, Field, ConfigDict, EmailStr


# ==========================================
# BASE SCHEMAS & CONFIGURATION
# ==========================================

class AuthorBase(BaseModel):
    """Core fields shared across all Author schemas."""
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
        validate_assignment=True
    )

    # Ensures the name isn't just empty spaces and stays within a reasonable limit
    name: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="The author's full name."
    )
    
    # EmailStr automatically validates proper RFC 5322 syntax (e.g., user@example.com)
    email: EmailStr = Field(
        ...,
        description="The author's unique email address."
    )


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
    # id: int
    model_config = ConfigDict(from_attributes=True)
