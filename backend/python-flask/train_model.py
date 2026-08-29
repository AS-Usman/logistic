"""Train the bundled SupplyIQ shipment-risk regression model.

The training set is synthetic and follows the project's documented logistics
risk features. This keeps the demo self-contained while providing a real
scikit-learn model that can be retrained later with production data.
"""
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
import pickle

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "model.pkl"
rng = np.random.default_rng(42)

modes = ["truck", "air", "rail", "maritime"]
cargos = ["standard", "perishable", "electronics", "hazardous", "heavy"]
weathers = ["clear", "rain", "fog", "snow", "storm", "heatwave"]
carriers = ["A+", "A", "B", "C", "D"]
mode_f = {"truck": (65, 1.25, 15), "air": (550, .85, 8), "rail": (45, .95, 12), "maritime": (25, 1.4, 22)}
weather_w = {"clear": 2, "rain": 18, "fog": 28, "snow": 42, "storm": 58, "heatwave": 20}
carrier_m = {"A+": -18, "A": -8, "B": 5, "C": 22, "D": 40}
cargo_mult = {"standard": 1, "perishable": 1.45, "electronics": 1.15, "hazardous": 1.35, "heavy": 1.2}

rows = []
for _ in range(6000):
    distance = float(rng.uniform(50, 15000))
    mode, cargo, weather, carrier = rng.choice(modes), rng.choice(cargos), rng.choice(weathers), rng.choice(carriers)
    traffic = float(rng.uniform(0, 100))
    weight = float(rng.uniform(100, 50000))
    _, vulnerability, base = mode_f[mode]
    score = (
        base
        + weather_w[weather] * vulnerability
        + traffic / 100 * 45
        + carrier_m[carrier]
        + min(30, distance / 1200 * 20)
        + min(15, weight / 20000 * 10)
    ) * cargo_mult[cargo]
    score = min(97, max(6, round(score)))
    rows.append([distance, mode, cargo, weather, carrier, traffic, weight, score + rng.normal(0, 2.5)])

df = pd.DataFrame(rows, columns=["distance", "transportMode", "cargoCategory", "weatherCondition", "carrierRating", "trafficCongestion", "cargoWeight", "risk"])
X, y = df.drop(columns="risk"), df["risk"]

pre = ColumnTransformer(
    [("categorical", OneHotEncoder(handle_unknown="ignore"),
      ["transportMode", "cargoCategory", "weatherCondition", "carrierRating"])],
    remainder="passthrough",
)
model = Pipeline([
    ("preprocessor", pre),
    ("regressor", RandomForestRegressor(
        n_estimators=220, max_depth=12, min_samples_leaf=3, random_state=42, n_jobs=-1
    )),
])
model.fit(X, y)

with OUT.open("wb") as f:
    pickle.dump(model, f)

print(f"Saved trained model to {OUT}")
