import pandas as pd
import numpy as np
import joblib
import time

from catboost import CatBoostRegressor

# === Load Test Dataset ===
test_path = "./data/bureau_data_10000_without_target.csv"
df = pd.read_csv(test_path)

# === Step 1: Load Required Artifacts ===
model = joblib.load("catboost_model.pkl")
num_imputer = joblib.load("num_imputer.pkl")
cat_cols = joblib.load("cat_features_list.pkl")
high_null_cols = joblib.load("dropped_columns.pkl")
proxy_model = joblib.load("emi_to_income_proxy_model.pkl")

# === Step 2: Preprocess Test Data ===
# Drop high-null columns
for col in high_null_cols:
    if col in df.columns:
        df.drop(columns=col, inplace=True)

# Convert pin code to string and extract region
if 'pin code' in df.columns:
    df['pin code'] = df['pin code'].astype(str)
    df['pin_region'] = df['pin code'].str[:2]

# Impute missing numerics
num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
df[num_cols] = num_imputer.transform(df[num_cols])

# === Step 3: Predict emi_to_income using proxy model ===
if 'total_emi_1' not in df.columns:
    raise ValueError("Missing column: total_emi_1 required to calculate emi_to_income")

proxy_features = df.copy()
proxy_features.drop(columns=['id'], errors='ignore', inplace=True)  # remove id if present
emi_to_income_pred = proxy_model.predict(proxy_features)

df['emi_to_income'] = emi_to_income_pred

# Add debt_to_credit ratio
if 'balance_1' in df.columns and 'credit_limit_1' in df.columns:
    df['debt_to_credit'] = df['balance_1'] / df['credit_limit_1'].replace(0, np.nan).fillna(1)

# Fill missing categorical values with 'unknown'
for col in cat_cols:
    if col in df.columns:
        df[col] = df[col].fillna("unknown").astype(str)

# === Step 4: Predict Final Income ===
start_time = time.time()
final_preds = model.predict(df)
latency = time.time() - start_time

# === Step 5: Format Submission File ===
submission_df = pd.DataFrame({
    "id": df["id"] if "id" in df.columns else np.arange(len(df)),
    "predicted_income": np.round(final_preds)
})

submission_filename = "teamname_submissions.csv"
submission_df.to_csv(submission_filename, index=False)

# === Final Output ===
print(f"\n✅ Inference complete. Predictions saved to: {submission_filename}")
print(f"⏱️ Total Prediction Time: {latency:.4f} seconds for {len(df)} samples")
