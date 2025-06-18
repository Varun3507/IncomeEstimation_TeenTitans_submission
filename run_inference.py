import pandas as pd
import numpy as np
import joblib
import time
import os
from catboost import CatBoostRegressor

# === Config ===
TEST_DATA_PATH = "./data/test.csv"
COLUMN_MAP_PATH = "./data/participant_col_mapping.csv"
OUTPUT_PREDICTIONS_PATH = "./output/TeenTitans_submissions.csv"

# === Load Test Data ===
test_df = pd.read_csv(TEST_DATA_PATH)

# === Load Artifacts ===
print("🔄 Loading artifacts...")
col_map = pd.read_csv(COLUMN_MAP_PATH)
rename_dict = dict(pd.Series(dict(zip(col_map['column_name'], col_map['description']))).drop_duplicates(keep='first'))

num_imputer = joblib.load("num_imputer.pkl")
cat_features = joblib.load("cat_features_list.pkl")
high_null_cols = joblib.load("dropped_columns.pkl")
proxy_model = joblib.load("emi_to_income_proxy_model.pkl")
main_model = joblib.load("catboost_model.pkl")
print("✅ All artifacts loaded.")

# === Column Renaming ===
test_df.rename(columns=rename_dict, inplace=True)
test_df = test_df.loc[:, ~test_df.columns.duplicated()]
print(f"✅ Column renaming done. First few columns: {test_df.columns[:5].tolist()}")

# === Drop High Null Columns and unwanted ones ===
test_df.drop(columns=high_null_cols, errors='ignore', inplace=True)
if 'var_60' in test_df.columns:
    test_df.drop(columns=['var_60'], inplace=True)

# === Process 'pin code' ===
if 'pin code' in test_df.columns:
    test_df['pin code'] = test_df['pin code'].astype(str)
    test_df['pin_region'] = test_df['pin code'].str[:2]

# === Add Financial Feature ===
test_df['debt_to_credit'] = test_df['balance_1'] / test_df['credit_limit_1'].replace(0, np.nan).fillna(1)

# === Prepare features for proxy_model ===
emi_features = test_df.drop(columns=['target'], errors='ignore').copy()

# Clean only actual object-type categorical features
valid_cat_features = [col for col in cat_features if col in emi_features.columns and emi_features[col].dtype == 'object']
for col in valid_cat_features:
    emi_features[col] = emi_features[col].astype(str).fillna("missing")

# === Predict emi_to_income using proxy model ===
test_df['emi_to_income'] = proxy_model.predict(emi_features)
print("✅ emi_to_income predicted using proxy model.")

# === Now Numeric Imputation (AFTER emi_to_income added) ===
num_cols = test_df.select_dtypes(include=[np.number]).columns.tolist()
test_df[num_cols] = num_imputer.transform(test_df[num_cols])

# Convert all cat_features to string and fill missing
valid_cat_features = [col for col in cat_features if col in emi_features.columns]
for col in valid_cat_features:
    emi_features[col] = emi_features[col].astype(str).replace("nan", "missing").fillna("missing")

# === Final Prediction ===
from catboost import Pool  # <--- add this at the top or here

start_time = time.time()

# Create CatBoost Pool with categorical features specified
test_pool = Pool(data=test_df, cat_features=valid_cat_features)

# Perform prediction
final_predictions = main_model.predict(test_pool)

latency = time.time() - start_time
latency_per_sample = latency / len(test_df) * 1000

# === Output ===
test_df['predicted_income'] = final_predictions
os.makedirs("outputs", exist_ok=True)
test_df[['unique_id', 'predicted_income']].to_csv(OUTPUT_PREDICTIONS_PATH, index=False)
print(f"✅ Final predictions saved to: {OUTPUT_PREDICTIONS_PATH}")
print(f"⚡ Total prediction time: {latency:.4f} sec | Per sample: {latency_per_sample:.2f} ms")