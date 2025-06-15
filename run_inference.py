import pandas as pd
import numpy as np
import joblib
from catboost import Pool
from sklearn.metrics import mean_squared_error, mean_absolute_error

# === Load preprocessed validation data ===
val_df = pd.read_csv("./data/preprocessed_Hackathon_bureau_data_400.csv")

# === Ensure 'pin code' is categorical ===
if 'pin code' in val_df.columns:
    val_df['pin code'] = val_df['pin code'].astype(str)
else:
    print("❌ 'pin code' column not found")

# === Add engineered features (must match training logic) ===
val_df['debt_to_credit'] = val_df['balance_1'] / val_df['credit_limit_1'].replace(0, np.nan).fillna(1)
val_df['emi_to_income'] = val_df['total_emi_1'] / val_df['target'].replace(0, np.nan).fillna(1)
val_df['pin_region'] = val_df['pin code'].str[:2]

# === Separate features and target ===
X_val = val_df.drop(columns=['target'])
y_val = val_df['target']

# === Load preprocessing artifacts ===
num_imputer = joblib.load('num_imputer.pkl')
dropped_columns = joblib.load('dropped_columns.pkl')
cat_cols = joblib.load('cat_features_list.pkl')  # use same list as training
model = joblib.load('catboost_model.pkl')

# === Drop same columns as training ===
X_val.drop(columns=[col for col in dropped_columns if col in X_val.columns], inplace=True)

# === Apply numeric imputation ===
num_cols = X_val.select_dtypes(include=[np.number]).columns.tolist()
X_val[num_cols] = num_imputer.transform(X_val[num_cols])

# === Predict with CatBoost ===
val_pool = Pool(data=X_val, cat_features=cat_cols)
val_pred = model.predict(val_pool)

# === Evaluate ===
rmse = np.sqrt(mean_squared_error(y_val, val_pred))
mae = mean_absolute_error(y_val, val_pred)
within_5000 = 100 * ((abs(y_val - val_pred) <= 5000).mean())

print(f"\n✅ Validation Metrics:")
print(f"📉 RMSE: {rmse:.2f}")
print(f"📉 MAE: {mae:.2f}")
print(f"✅ % within ₹5,000: {within_5000:.2f}%")
