from fastapi import APIRouter
from model.author_schema import AuthorCreate, AuthorResponse, AuthorUpdate
import service.authors as service


router = APIRouter(prefix="/authors", tags=["autors"])


# CRUD ops on Authors

@router.get("/")
async def get_all() -> list[AuthorResponse]:
    return service.get_all()


@router.get("/{author_id}")
async def get_by_id(author_id: int) -> AuthorResponse | None:
    return service.get_by_id(author_id)


@router.post("/")
async def create(author: AuthorCreate) -> AuthorResponse:
    return service.create(author)


@router.patch("/")
async def update(author_id: int, editedAuthor: AuthorUpdate) -> AuthorResponse | None:
    return service.update(author_id, editedAuthor)


@router.delete("/{author_id}")
async def delete(author_id: int) -> AuthorResponse | None:
    return service.delete(author_id)
