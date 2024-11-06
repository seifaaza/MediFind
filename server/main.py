from fastapi import FastAPI
import logging
import os

# Set up logging for the FastAPI application
logging.basicConfig(level=logging.INFO)

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    logging.info("FastAPI server is starting...")
    logging.info(f"Server is running on http://localhost:8000")

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}


