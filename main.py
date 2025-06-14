import pandas as pd
from catboost import CatBoostRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error
import numpy as np

# === Load Preprocessed Data ===
df = pd.read_csv("D:\Python\Credit_UnderWriting_Model\data\preprocessed_Hackathon_bureau_data_50k.csv")

# === Step 1: Ensure 'pin' is treated as categorical ===
if 'pin code' in df.columns:
    df['pin code'] = df['pin code'].astype(str)
    print("✅ 'pin code' set as categorical (string type)")
else:
    print("❌ 'pin code' column not found")


# === Step 2: Define Features and Target ===
X = df.drop(columns=['target'])
y = df['target']

# === Step 3: Identify Categorical Columns ===
cat_cols = X.select_dtypes(include=['object']).columns.tolist()
print(f"📊 Categorical columns: {cat_cols}")

# Add financial ratios
X['debt_to_credit'] = X['balance_1'] / X['credit_limit_1'].replace(0, np.nan).fillna(1)
X['emi_to_income'] = X['total_emi_1'] / y.replace(0, np.nan).fillna(1)

# Extract pin region (first 2 digits)
if 'pin code' in X.columns:
    X['pin_region'] = X['pin code'].str[:2]
    cat_cols.append('pin_region')
    print("✅ Added 'pin_region' to categoricals")

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

# Evaluate
y_pred = model.predict(X_val)
rmse = np.sqrt(mean_squared_error(y_val, y_pred))
mae = mean_absolute_error(y_val, y_pred)
within_5000 = 100 * ((abs(y_val - y_pred) <= 5000).mean())
print(f"RMSE: {rmse:.2f}, MAE: {mae:.2f}, % within ₹5,000: {within_5000:.2f}%")

# RMSE
rmse = np.sqrt(mean_squared_error(y_val, y_pred))
print(f"📉 RMSE: {rmse:.2f}")

# MAE
mae = mean_absolute_error(y_val, y_pred)
print(f"📉 MAE: {mae:.2f}")

# % Predictions within ₹5000
within_5k = np.mean(np.abs(y_pred - y_val) <= 5000) * 100
print(f"✅ % Predictions within ₹5,000: {within_5k:.2f}%")

# === Borderline Acceptable Metric Expectations (Assuming Competition Guidelines) ===
print("\n📌 Target Benchmark (as per competition or industry standards):")
print("✔ RMSE ≤ 20,000")
print("✔ MAE ≤ 15,000")
print("✔ At least 70% predictions within ₹5,000 range (ideal > 75%)")
