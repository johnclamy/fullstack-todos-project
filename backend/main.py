import uvicorn
from fastapi import FastAPI
from app.web.todos import router as todos_router


app = FastAPI()
app.include_router(todos_router)


@app.get("/")
async def read_root():
    return {"endpoint": "Root"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="localhost",
        port=8000,
        reload=True
    )
