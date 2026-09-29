import uvicorn
from fastapi import FastAPI
from app.api.v1.router import api_router


app = FastAPI()
app.include_router(api_router, prefix="/api/v1")


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
