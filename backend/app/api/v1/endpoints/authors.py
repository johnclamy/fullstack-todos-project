from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from app.data.db import get_db
from app.model.author_schema import AuthorCreate, AuthorResponse, AuthorUpdate
from app.model.response import ApiResponse
import app.service.author_service as service


router = APIRouter()


# Routes for Authors

@router.get("/", status_code=status.HTTP_200_OK)
async def get_all(
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[AuthorResponse]]:
    try:
        authors = await service.get_all(db)
        author_responses = [AuthorResponse.model_validate(author) for author in authors]
        return ApiResponse(
            status=status.HTTP_200_OK,
            message="Authors retrieved successfully",
            data=author_responses,
        )
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve authors",
        ) from exc


@router.get("/{author_id}", status_code=status.HTTP_200_OK)
async def get_by_id(
    author_id: int,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[AuthorResponse]:
    try:
        author = await service.get_by_id(db, author_id)
        author_response = AuthorResponse.model_validate(author)
        return ApiResponse(
            status=status.HTTP_200_OK,
            message="Author retrieved successfully",
            data=author_response,
        )
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve author",
        ) from exc


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create(
    author_in: AuthorCreate,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[AuthorResponse]:
    try:
        author = await service.create(db, author_in)
        author_response = AuthorResponse.model_validate(author)
        return ApiResponse(
            status=status.HTTP_201_CREATED,
            message="Author created successfully",
            data=author_response,
        )
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An author with this email already exists",
        ) from exc
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create author",
        ) from exc


@router.patch("/{author_id}", status_code=status.HTTP_200_OK)
async def update(
    author_id: int,
    author_changes: AuthorUpdate,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[AuthorResponse]:
    try:
        author = await service.update(db, author_id, author_changes)
        author_response = AuthorResponse.model_validate(author)
        return ApiResponse(
            status=status.HTTP_200_OK,
            message="Author updated successfully",
            data=author_response,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An author with this email already exists",
        ) from exc
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update author",
        ) from exc


@router.delete("/{author_id}", status_code=status.HTTP_200_OK)
async def delete(
    author_id: int,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[None]:
    try:
        await service.delete(db, author_id)
        return ApiResponse(
            status=status.HTTP_200_OK,
            message="Author deleted successfully",
            data=None,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete author",
        ) from exc