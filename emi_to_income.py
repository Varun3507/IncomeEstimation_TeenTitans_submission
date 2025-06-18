import pandas as pd
import numpy as np
import joblib
from catboost import CatBoostRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# === Load Preprocessed Data & Targets ===
X = pd.read_csv("./data/preprocessed_Hackathon_bureau_data_50k.csv")
emi_to_income = joblib.load("emi_to_income_training_targets.pkl")

# === Drop unusable columns (anything that uses target/income directly) ===
if 'target' in X.columns:
    X.drop(columns=['target'], inplace=True)

# === Process 'pin code' ===
if 'pin code' in X.columns:
    X['pin code'] = X['pin code'].astype(str)
    X['pin_region'] = X['pin code'].str[:2]

# === Add financial features (ONLY those usable without target) ===
X['debt_to_credit'] = X['balance_1'] / X['credit_limit_1'].replace(0, np.nan).fillna(1)

# === Categorical Columns ===
cat_cols = X.select_dtypes(include='object').columns.tolist()
if 'pin_region' in X.columns:
    cat_cols.append('pin_region')

# === Train-Test Split ===
X_train, X_val, y_train, y_val = train_test_split(X, emi_to_income, test_size=0.2, random_state=42)

# === Train Proxy Model ===
proxy_model = CatBoostRegressor(
    iterations=1000,
    learning_rate=0.05,
    depth=6,
    cat_features=cat_cols,
    verbose=200,
    random_seed=42,
    early_stopping_rounds=100
)
proxy_model.fit(X_train, y_train, eval_set=(X_val, y_val))

# === Evaluate ===
y_pred = proxy_model.predict(X_val)
rmse = np.sqrt(mean_squared_error(y_val, y_pred))
print(f"\n✅ Proxy Model RMSE on emi_to_income: {rmse:.4f}")

# === Save Model ===
joblib.dump(proxy_model, "emi_to_income_proxy_model.pkl")
print("✅ Proxy model saved as emi_to_income_proxy_model.pkl")
