from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
 
from database import Base, engine
from routers import auth, menu, orders
 
# Create all tables on startup
Base.metadata.create_all(bind=engine)
 
app = FastAPI(
    title="Pizza App API",
    description="Backend API for a pizza restaurant ordering system",
    version="1.0.0",
)
 
# ─── CORS ─────────────────────────────────────────────────────────────────────
# Allow the Vite dev server to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(menu.router)
app.include_router(orders.router)
 
 
@app.get("/")
def root():
    return {"message": "Pizza App API is running 🍕"}