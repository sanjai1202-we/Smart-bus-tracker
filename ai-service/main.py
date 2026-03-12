from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
from typing import Optional

app = FastAPI(title="Bus Tracking AI Service")

class ETARequest(BaseModel):
    current_lat: float
    current_lng: float
    dest_lat: float
    dest_lng: float
    speed_kmh: float

class OverspeedRequest(BaseModel):
    driver_id: str
    speed_kmh: float
    speed_limit_kmh: float

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/predict-eta")
def predict_eta(req: ETARequest):
    # Dummy ML prediction logic (placeholder for actual scikit random forest model)
    # Using simple Haversine + a random traffic modifier
    from geopy.distance import geodesic
    
    dist_km = geodesic((req.current_lat, req.current_lng), (req.dest_lat, req.dest_lng)).km
    
    speed = req.speed_kmh if req.speed_kmh > 0 else 30.0
    base_time_hours = dist_km / speed
    
    # Random traffic factor between 1.0 (no traffic) and 1.5 (heavy traffic)
    traffic_factor = random.uniform(1.0, 1.5)
    
    eta_minutes = base_time_hours * 60 * traffic_factor
    
    return {
        "estimated_minutes": round(eta_minutes, 1),
        "distance_km": round(dist_km, 2),
        "traffic_factor_applied": round(traffic_factor, 2)
    }

@app.post("/detect-overspeed")
def detect_overspeed(req: OverspeedRequest):
    if req.speed_kmh > req.speed_limit_kmh + 10:
        return {
            "alert": True,
            "message": f"Driver overspeeding at {req.speed_kmh} km/h (Limit: {req.speed_limit_kmh})"
        }
    return {"alert": False}
