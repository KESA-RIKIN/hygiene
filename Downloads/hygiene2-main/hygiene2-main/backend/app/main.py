from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import analyze, live, alerts, images

app = FastAPI(title="Hygiene Compliance API")

# Allow requests from the frontend origin
origins = [
    "https://hygiene-six.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api/v1")
app.include_router(live.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")
app.include_router(images.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Hygiene API is running"}
