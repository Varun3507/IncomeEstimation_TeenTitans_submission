import pandas as pd
import numpy as np

# Load original data and column mapping
df = pd.read_csv("D:\Python\Credit_UnderWriting_Model\data\Hackathon_bureau_data_400.csv")
col_map = pd.read_csv("D:\Python\Credit_UnderWriting_Model\data\participant_col_mapping.csv")

#dropping redundant row
df.drop(columns=['var_60'], inplace=True)

# Step 1: Rename columns using mapping
rename_dict = dict(zip(col_map['column_name'], col_map['description']))
df.rename(columns=rename_dict, inplace=True)
print("✅ Column renaming done. First few columns:", df.columns[:5].tolist())

# Step 2: Drop columns with >65% missing values
missing_pct = df.isnull().mean()
high_null_cols = missing_pct[missing_pct > 0.65].index.tolist()
df.drop(columns=high_null_cols, inplace=True)
print(f"✅ Dropped {len(high_null_cols)} columns with >65% missing values: {high_null_cols}")

# Step 3: Handle missing values in non-numeric columns
# Treat specific columns as categorical
categorical_cols = ['pin', 'gender', 'marital_status', 'city', 'state', 'residence_ownership',
                    'device_model', 'device_category', 'platform', 'device_manufacturer', 'score_comments', 'score_type']

# Numeric replacements
num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
# For numeric columns: Replace nulls with median
from sklearn.impute import SimpleImputer

# For numeric columns: Replace nulls with median - Financial input data  - right end Skewed
num_imputer = SimpleImputer(strategy="median")
df[num_cols] = num_imputer.fit_transform(df[num_cols])
print(f"✅ Filled nulls in numeric columns {num_cols} with their respective medians")


# Replace nulls with 'Unknown' in non-numeric columns
cat_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
for col in cat_cols:
    if df[col].isnull().any():
        df[col] = df[col].fillna('Unknown')
        print(f"✅ Filled nulls in non-numeric column '{col}' with 'Unknown'")

# === Null Count and % ===
nulls = df.isnull().sum()
null_percent = (nulls / len(df)) * 100

null_summary = pd.DataFrame({
    'Missing Count': nulls,
    'Missing %': null_percent
}).sort_values(by='Missing %', ascending=False)

# Save null report to txt
NULL_REPORT_PATH = r"D:\Python\Credit_UnderWriting_Model\outputs\missing_report.txt"
null_summary.to_string(open(NULL_REPORT_PATH, "w"))
print(f"📝 Null report saved to: {NULL_REPORT_PATH}")

# Save the preprocessed DataFrame to a CSV
output_file = "D:\Python\Credit_UnderWriting_Model\data\preprocessed_Hackathon_bureau_data_400.csv"
df.to_csv(output_file, index=False)
print(f"✅ Preprocessed data saved to '{output_file}'")

# Preview the result
print("\n🧼 Preprocessing complete. Final data shape:", df.shape)
print("\nRemaining nulls in non-numeric columns (if any):")
print(df[cat_cols].isnull().sum().sort_values(ascending=False).head())