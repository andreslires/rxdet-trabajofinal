from fastapi import FastAPI
from routers import geometrias
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost", 
    "http://localhost:8000",
    "http://localhost:8000/geoms/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#Routers
app.include_router(geometrias.router)

#Main get
@app.get("/")
async def root():
    return {"message": "Hello cows! Or, as you would say, mu muuu!"} #If any browser shows you this message in the url http://localhost:8000/, the server is working.
