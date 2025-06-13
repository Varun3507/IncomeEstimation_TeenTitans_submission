# main.py
import pandas as pd
import os

# === Step 1: Load Datasets ===

# Paths
DATA_DIR = "./data"
TRAIN_FILE = os.path.join(DATA_DIR, "Hackathon_bureau_data_50000.csv")
TEST_FILE = os.path.join(DATA_DIR, "Hackathon_bureau_data_400.csv")
COL_MAP_FILE = os.path.join(DATA_DIR, "participant_col_mapping.csv")

# Load datasets
df_train = pd.read_csv(TRAIN_FILE)
df_test = pd.read_csv(TEST_FILE)
df_map = pd.read_csv(COL_MAP_FILE)

print("✅ Data Loaded Successfully.")
print(f"Training data shape: {df_train.shape}")
print(f"Test data shape: {df_test.shape}")
print("\n📌 Sample Training Data:")
print(df_train.head())

print("\n🧠 Target Column:", "target_income" if "target_income" in df_train.columns else "NOT FOUND")
print("\n🗂️ Column Mapping:")
print(df_map.head())

# === Step 2: Preprocessing ===

from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
import numpy as np
import joblib

# Drop ID column
df_train = df_train.drop(columns=['id'])
df_test = df_test.drop(columns=['id'])

# Separate target
target_column = "target_income"
y_train = df_train[target_column]
df_train = df_train.drop(columns=[target_column])

# Combine train and test for consistent preprocessing
df_all = pd.concat([df_train, df_test], axis=0)

# 1. Identify categorical and numerical columns
cat_cols = df_all.select_dtypes(include=['object']).columns.tolist()
num_cols = df_all.select_dtypes(include=['float64', 'int64']).columns.tolist()

print(f"📊 Categorical columns: {len(cat_cols)}")
print(f"📈 Numerical columns: {len(num_cols)}")

# 2. Fill missing values
num_imputer = SimpleImputer(strategy="mean")
df_all[num_cols] = num_imputer.fit_transform(df_all[num_cols])

cat_imputer = SimpleImputer(strategy="most_frequent")
df_all[cat_cols] = cat_imputer.fit_transform(df_all[cat_cols])

# 3. Label encode categorical columns
encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df_all[col] = le.fit_transform(df_all[col].astype(str))
    encoders[col] = le

# 4. Scale numerical columns
scaler = StandardScaler()
df_all[num_cols] = scaler.fit_transform(df_all[num_cols])

# Save encoders and scalers
joblib.dump(scaler, ".\outputs\scaler.pkl")
joblib.dump(encoders, ".\outputs\encoders.pkl")

# 5. Split back to train/test
X_train = df_all[:len(y_train)]
X_test = df_all[len(y_train):]

print("✅ Preprocessing done.")
print(f"Processed train shape: {X_train.shape}")
print(f"Processed test shape: {X_test.shape}")

# === TEMPORARY: Missing Value Audit ===
missing_percent = df_all.isnull().mean() * 100
high_null = missing_percent[missing_percent > 70].sort_values(ascending=False)

print("\n🔍 Columns with >70% missing values:")
print(high_null)

print("\n📉 All columns missing percentage:")
print(missing_percent.sort_values(ascending=False))

X_train.to_csv(".\outputs\X_train_processed.csv", index=False)
X_test.to_csv(".\outputs\X_test_processed.csv", index=False)