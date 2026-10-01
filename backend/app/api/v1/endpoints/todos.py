from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from app.model.todos_schema import TodoCreate, TodoResponse, TodoUpdate
from app.model.response import ApiResponse
from app.data.db import get_db
import app.service.todo_service as service


router = APIRouter()


@router.get("/", status_code=status.HTTP_200_OK)
async def get_all(db: AsyncSession = Depends(get_db)) -> ApiResponse[list[TodoResponse]]:
    try:
        todos = await service.get_all(db)
        todo_responses = [TodoResponse.model_validate(todo) for todo in todos]

        return ApiResponse(
            status=status.HTTP_200_OK,
            message="Todos retrieved successfully",
            data=todo_responses,
        )
    
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve todos",
        ) from exc


@router.get("/{todo_id}", status_code=status.HTTP_200_OK)
async def get_by_id(
    todo_id: int,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[TodoResponse]:
    try:
        todo = await service.get_by_id(db, todo_id)
        todo_response = TodoResponse.model_validate(todo)

        return ApiResponse(
            status=status.HTTP_200_OK,
            message="Todo retrieved successfully",
            data=todo_response,
        )
    
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve todo",
        ) from exc


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_in: TodoCreate,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[TodoResponse]:
    try:
        todo = await service.create(db, todo_in)
        todo_response = TodoResponse.model_validate(todo)

        return ApiResponse(
            status=status.HTTP_201_CREATED,
            message="Todo created successfully",
            data=todo_response,
        )
    
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create todo",
        ) from exc


@router.patch("/{todo_id}", status_code=status.HTTP_200_OK)
async def update(    
    todo_id: int,
    todo: TodoUpdate,
    db: AsyncSession = Depends(get_db),   
) -> ApiResponse[TodoResponse]:
    try:
        if todo is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Todo {todo_id} does not exist",
            )
        
        updated_todo = await service.update(db, todo_id, todo)
        todo_response = TodoResponse.model_validate(updated_todo)
        
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update todo",
        ) from exc     

    return ApiResponse(
        status=status.HTTP_200_OK,
        message="Todo updated successfully",
        data=todo_response,
    )


@router.delete("/{todo_id}", status_code=status.HTTP_200_OK)
async def delete(
    todo_id: int, 
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[None]:
    await service.delete(db, todo_id)
    
    return ApiResponse(
        status=status.HTTP_200_OK,
        message="Todo deleted successfully",
    )    
