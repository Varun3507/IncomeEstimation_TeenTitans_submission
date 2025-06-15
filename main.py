import pandas as pd
import numpy as np
import joblib
import time
from catboost import CatBoostRegressor
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

from preprocessing import high_null_cols

# === Load Preprocessed Data ===
df = pd.read_csv("./data/preprocessed_Hackathon_bureau_data_50k.csv")

# === Step 1: Ensure 'pin' is treated as categorical ===
if 'pin code' in df.columns:
    df['pin code'] = df['pin code'].astype(str)
else:
    print("❌ 'pin code' column not found")

# === Step 2: Define Features and Target ===
X = df.drop(columns=['target'])
y = df['target']

# === Step 3: Identify Categorical Columns ===
cat_cols = X.select_dtypes(include=['object']).columns.tolist()

# Add financial ratios
X['debt_to_credit'] = X['balance_1'] / X['credit_limit_1'].replace(0, np.nan).fillna(1)
X['emi_to_income'] = X['total_emi_1'] / y.replace(0, np.nan).fillna(1)



# Extract pin region (first 2 digits)
if 'pin code' in X.columns:
    X['pin_region'] = X['pin code'].str[:2]
    cat_cols.append('pin_region')

# === Step 4: Train-Validation Split ===
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# Train tuned CatBoost
model = CatBoostRegressor(
    iterations=2000,
    learning_rate=0.05,
    depth=8,
    cat_features=cat_cols,
    verbose=200,
    random_seed=42,
    early_stopping_rounds=100
)
model.fit(X_train, y_train, eval_set=(X_val, y_val))

# === Evaluate ===
start_time = time.time()
y_pred = model.predict(X_val)
latency = time.time() - start_time

# Core Metrics
r2 = r2_score(y_val, y_pred)
rmse = np.sqrt(mean_squared_error(y_val, y_pred))
mae = mean_absolute_error(y_val, y_pred)
within_5000 = 100 * ((np.abs(y_val - y_pred) <= 5000).mean())

# Population coverage within 25% deviation
deviation = np.abs(y_val - y_pred) / y_val.replace(0, np.nan)  # Avoid division by zero
within_25_percent = 100 * (deviation <= 0.25).mean()

# System Performance & Latency
latency_per_sample = latency / len(X_val) * 1000  # ms per sample

# === Print Existing Metrics ===
print(f"\n✅ Validation Metrics:")
print(f"📉 RMSE: {rmse:.2f}")
print(f"📉 MAE: {mae:.2f}")
print(f"✅ % within ₹5,000: {within_5000:.2f}%")

# === Generate Judging Metrics Report ===
metrics_report = f"""
=== Hackathon Judging Metrics ===
1. Core Metrics:
   - R²: {r2:.4f}
   - RMSE: {rmse:.2f}
   - MAE: {mae:.2f}
2. Population Coverage within 25% Deviation: {within_25_percent:.2f}%
3. Population Coverage within 5,000: {within_5000:.2f}%
4. System Performance & Latency:
   - Total Prediction Time: {latency:.4f} seconds for {len(X_val)} samples
   - Latency per Sample: {latency_per_sample:.4f} ms
"""

# Print and save judging metrics
print(metrics_report)

# === Save emi_to_income for proxy model training ===
emi_to_income_values = X['emi_to_income']
joblib.dump(emi_to_income_values, 'emi_to_income_training_targets.pkl')
print("✅ Saved true emi_to_income values for future proxy model.")


# === Save Artifacts ===
joblib.dump(model, 'catboost_model.pkl')
print("✅ Model saved as catboost_model.pkl")

# Save imputer
num_cols = X.select_dtypes(include=[np.number]).columns.tolist()
num_imputer = SimpleImputer(strategy="median")
num_imputer.fit(X[num_cols])
joblib.dump(num_imputer, 'num_imputer.pkl')
print("✅ Numeric imputer saved as num_imputer.pkl")

# Save dropped columns and categorical features
joblib.dump(high_null_cols, 'dropped_columns.pkl')
joblib.dump(cat_cols, "cat_features_list.pkl")
print("✅ Dropped columns list saved as dropped_columns.pkl")
print("✅ Categorical features list saved as cat_features_list.pkl")