import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from textblob import TextBlob
from collections import defaultdict # NEW import for easier counting

# Create the FastAPI app instance
app = FastAPI(title="Crime Analytics API")

# --- CORS Middleware (no changes) ---
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:5501",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI Severity Scoring Function (no changes) ---
def get_severity_score(text: str) -> float:
    polarity = TextBlob(text).sentiment.polarity
    severity = (1 - polarity) / 2
    return round(severity, 3)

# --- Data Loading (no changes) ---
def load_crime_data() -> List[Dict[str, Any]]:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_file_path = os.path.join(script_dir, "data", "mock_incidents.json")
    try:
        with open(data_file_path, "r") as f:
            print(f"Successfully loaded data from: {data_file_path}")
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find the file at the calculated path: {data_file_path}")
        return []

# Load data and pre-process with severity when the app starts
crime_data = load_crime_data()
for incident in crime_data:
    incident['severity'] = get_severity_score(incident['summary'])


# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the Crime Analytics API"}

@app.get("/api/incidents", response_model=List[Dict[str, Any]])
def get_incidents():
    """Returns a list of all crime incidents with AI-generated severity score."""
    return crime_data

# --- NEW: PREDICTIVE FORECAST ENDPOINT ---
@app.get("/api/forecast")
def get_future_forecast():
    """
    Generates a simple 'Future Hotspot Forecast' based on incident
    frequency and average severity.
    """
    location_stats = defaultdict(lambda: {'count': 0, 'total_severity': 0})
    
    # 1. Aggregate data by location
    for incident in crime_data:
        loc = incident['location']
        location_stats[loc]['count'] += 1
        location_stats[loc]['total_severity'] += incident.get('severity', 0.5)

    # 2. Calculate risk score for each location
    forecasts = []
    for location, data in location_stats.items():
        if data['count'] == 0:
            continue
        
        avg_severity = data['total_severity'] / data['count']
        # Our "secret sauce": risk is boosted by both count and severity
        risk_score = data['count'] * (1 + avg_severity)
        
        forecasts.append({
            "location": location,
            "risk_score": risk_score,
            "incident_count": data['count'],
            "avg_severity": round(avg_severity, 2)
        })

    # 3. Sort by risk and take the top 3
    sorted_forecasts = sorted(forecasts, key=lambda x: x['risk_score'], reverse=True)
    top_forecasts = sorted_forecasts[:3]
    
    # 4. Add a human-readable risk level
    for forecast in top_forecasts:
        if forecast['risk_score'] > 10:
             forecast['risk_level'] = "High"
             forecast['reason'] = f"High incident volume ({forecast['incident_count']}) and high severity."
        elif forecast['risk_score'] > 5:
             forecast['risk_level'] = "Medium"
             forecast['reason'] = f"Moderate incident volume ({forecast['incident_count']})."
        else:
            forecast['risk_level'] = "Low"
            forecast['reason'] = f"Low incident volume ({forecast['incident_count']})."

    return top_forecasts