from fastapi import APIRouter, HTTPException, status
from app.model.author_schema import AuthorCreate, AuthorResponse, AuthorUpdate
import app.service.authors as service


router = APIRouter()


# CRUD ops on Authors

@router.get("/", response_model=list[AuthorResponse], status_code=status.HTTP_200_OK)
async def get_all() -> list[AuthorResponse]:
    return service.get_all()


@router.get("/{author_id}", response_model=AuthorResponse, status_code=status.HTTP_200_OK)
async def get_by_id(author_id: int) -> AuthorResponse:
    author = service.get_by_id(author_id)

    if author is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Author with id {author_id} does not exist",
        )
    return author


@router.post("/", response_model=AuthorResponse, status_code=status.HTTP_201_CREATED)
async def create(author: AuthorCreate) -> AuthorResponse:
    try:
        return service.create(author)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.patch("/", response_model=AuthorResponse, status_code=status.HTTP_200_OK)
async def update(author_id: int, editedAuthor: AuthorUpdate) -> AuthorResponse:
    try:
        author = service.update(author_id, editedAuthor)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    if author is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Author id {author_id} does not exist",
        )
    return author


@router.delete("/{author_id}", response_model=AuthorResponse, status_code=status.HTTP_200_OK)
async def delete(author_id: int) -> AuthorResponse:
    author = service.delete(author_id)

    if author is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo {author_id} does not exist",
        )
    return author