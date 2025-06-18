# 💸 Credit Underwriting Hackathon – Teen Titans Submission

Welcome to our submission for the **Credit Underwriting Innovation Hackathon**. Our system is designed to estimate income and repayment capability of financially underserved individuals using non-banking, privacy-compliant data sources. Built with an emphasis on modularity, explainability, and real-world deployability.

---

## 🚀 Project Overview

### 🎯 Objective

To predict an individual’s creditworthiness in the absence of formal income declarations by leveraging publicly available features and constructing a two-stage machine learning model.

---

## 🧠 Solution Architecture

### 🔹 Stage 1: EMI to Income Proxy Estimator
- **Goal**: Predict `emi_to_income` as a proxy for income using non-sensitive, publicly observable features.
- **Model**: `CatBoostRegressor` trained on synthetic EMI and alternate data.
- **Input Features**: Region, employment patterns, loan counts, balance-to-limit ratios, etc.

### 🔹 Stage 2: Final Income Predictor
- **Goal**: Use predicted `emi_to_income` + engineered financial features to predict `target_income`.
- **Model**: `CatBoostRegressor` fine-tuned on aligned features with robust validation.
- **Safety**: No use of personally identifiable or directly declared income data.

---

## 🔧 Setup Instructions

### 🖥️ Environment Setup

Install dependencies using:

```bash
pip install -r requirements.txt

# 🏦 Credit Underwriting Model

A machine learning pipeline to estimate EMI-to-Income ratio and underwrite credit applicants using bureau data.  
Developed during **[Hackathon Name]** by **Team: Teen Titans**  
**Lead Developer & Model Architect**: Kanishka Kumar Singh

---

## 📁 Directory Structure

Credit_UnderWriting_Model/
├── data/
│ ├── bureau_data_10000_without_target.csv
│ ├── participant_col_mapping.csv
├── outputs/
│ └── final_predictions.csv
├── models/
│ ├── catboost_model.pkl
│ └── emi_to_income_proxy_model.pkl
├── scripts/
│ ├── train_proxy_model.py
│ ├── train_main_model.py
│ └── run_inference.py
├── requirements.txt
└── README.md


---

## 📊 Evaluation Metrics

| Model Stage   | Metric   | Value               |
|---------------|----------|---------------------|
| Proxy Model   | RMSE     | ~0.00003            |
| Final Model   | R² Score | ~0.38–0.42 (varied) |

> ⚠️ **Note**: Accuracy degraded on blind test due to schema drift and noisy categorical encodings.

---

## 🧩 Key Features Engineered

- `debt_to_credit`: Ratio of outstanding debt to credit limit.
- `pin_region`: First two digits of pin code to map regional economics.
- `count_features`: Total active accounts, limits, balances.

---

## 🔍 Explainability

Used SHAP (SHapley Additive exPlanations) for interpreting model predictions.

```python
import shap
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_sample)
shap.summary_plot(shap_values, X_sample)

## 🧪 Run Inference

To generate predictions:

```bash
python scripts/run_inference.py

## **Steps performed:**

- Loads test CSV and applies preprocessing  
- Predicts `emi_to_income` using proxy model  
- Applies imputations and final prediction  
- Saves output to `outputs/final_predictions.csv`

---

## ⚖️ Ethical Compliance

- ✅ No personal income data used  
- ✅ No user-identifiable information  
- ✅ Focused on transparency and fairness

---

## 👨‍💻 Team

- **Kanishka Kumar Singh** – Lead ML Developer & Model Architect  
- **Varun Kant** - Frontend Developer
- **Pranjal Agarwal** - Lead Developer
- **Naman Jaju** - Backend Developer

---

## 🙏 Acknowledgements

- Organized by: **[LenDenClub]**  
- Dataset provided by: **[LenDenCLub]**  
- Special thanks to mentors, professors, and open-source contributors ❤️

---

## 📌 Lessons Learned

- **Data quality > model complexity**  
- **Pipeline alignment & categorical consistency are critical**  
- **SHAP is 🔥 for debugging blind spots**  
- And most importantly… **sleep is underrated 😴**

---

## 📎 Appendix

- All required packages listed in `requirements.txt`  
  (e.g., CatBoost, SHAP, pandas, NumPy, etc.)
- Trained models saved using `joblib` format in the `models/` directory