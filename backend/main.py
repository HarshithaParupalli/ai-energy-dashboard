from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Energy Dashboard Backend Running"}

@app.get("/dashboard-data")
def get_dashboard_data(plant: str = "Plant A"):
    plant_data = {
        "Plant A": {
            "plant": "Plant A",
            "power": 120,
            "temperature": 45,
            "status": "Running Normally",
            "alerts": [
                "Boiler pressure slightly high",
                "2 active alerts"
            ],
            "ai_insight": "Plant A: Operations are stable. No immediate issue detected.",
            "power_history": [95, 105, 110, 118, 120, 117],
            "temperature_history": [38, 40, 42, 44, 45, 43]
        },
        "Plant B": {
            "plant": "Plant B",
            "power": 98,
            "temperature": 52,
            "status": "Warning",
            "alerts": [
                "Cooling system needs inspection",
                "Temperature above normal range"
            ],
            "ai_insight": "Plant B: Temperature trend is rising. Preventive maintenance is recommended.",
            "power_history": [88, 90, 94, 96, 98, 95],
            "temperature_history": [44, 46, 48, 50, 52, 51]
        },
        "Plant C": {
            "plant": "Plant C",
            "power": 135,
            "temperature": 41,
            "status": "Stable",
            "alerts": [
                "Minor vibration detected in turbine 2"
            ],
            "ai_insight": "Plant C: Performance is efficient. Monitor turbine vibration for the next 24 hours.",
            "power_history": [120, 124, 128, 130, 135, 132],
            "temperature_history": [36, 37, 39, 40, 41, 40]
        }
    }

    return plant_data.get(plant, plant_data["Plant A"])