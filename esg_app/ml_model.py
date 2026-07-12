import os
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LinearRegression
from django.conf import settings

# Global Model & Preprocessors
_model = None
_scaler = None
_label_encoder = None
_mean_values = {}
_mode_bucket = None

def init_model():
    global _model, _scaler, _label_encoder, _mean_values, _mode_bucket
    
    csv_path = os.path.join(settings.BASE_DIR, 'city_day.csv')
    if not os.path.exists(csv_path):
        print(f"Error: Dataset {csv_path} not found.")
        return False
        
    try:
        # Load dataset
        data = pd.read_csv(csv_path)
        
        # Keep track of mean values for imputation on predict
        cols = ['PM2.5', 'PM10', 'NO', 'NO2', 'NOx', 'NH3', 'CO', 'SO2', 'O3', 'Benzene', 'Toluene', 'Xylene']
        for col in cols:
            _mean_values[col] = float(data[col].mean())
            data[col].fillna(_mean_values[col], inplace=True)
            
        _mean_values['AQI'] = float(data['AQI'].mean())
        data['AQI'].fillna(_mean_values['AQI'], inplace=True)
        
        # Mode of AQI Bucket
        _mode_bucket = data['AQI_Bucket'].mode()[0]
        data['AQI_Bucket'].fillna(_mode_bucket, inplace=True)
        
        # Label Encoder
        _label_encoder = LabelEncoder()
        data['AQI_Bucket'] = _label_encoder.fit_transform(data['AQI_Bucket'])
        
        # Scale features
        _scaler = StandardScaler()
        data[cols] = _scaler.fit_transform(data[cols])
        
        # Train Linear Regression model to predict AQI
        X = data.drop(['AQI', 'Date', 'City'], axis=1, errors='ignore')
        y = data['AQI']
        
        _model = LinearRegression(fit_intercept=True, copy_X=True, positive=False, tol=1e-06)
        _model.fit(X, y)
        print("EcoSphere ML Model trained successfully!")
        return True
    except Exception as e:
        print(f"Failed to train ML Model: {e}")
        return False

def calculate_esg_scores(total_carbon_value, csr_count, pending_violations):
    """
    Calculates E, S, G scores.
    Environmental score uses predicted AQI based on latest carbon footprint logs.
    """
    global _model, _scaler, _label_encoder, _mean_values, _mode_bucket
    
    if _model is None:
        # Try initializing if not done
        init_model()
        
    # Standard environmental score fallback
    env_score = 80
    
    if _model is not None:
        try:
            # Map carbon value into a pollutant scaling index (0.5 to 3.0 times the baseline mean values)
            # Baseline mean represents typical Odoo corporate daily footprint (around 14,000 kg CO2e)
            scale = 0.5 + (min(50000, total_carbon_value) / 25000.0)
            
            # Form simulated pollutant values
            simulated = {}
            for col, mean_val in _mean_values.items():
                if col in ['AQI', 'AQI_Bucket']:
                    continue
                # Carbon footprint scales PM2.5, PM10, NOx, CO, and SO2 emissions
                if col in ['PM2.5', 'PM10', 'NOx', 'CO', 'SO2']:
                    simulated[col] = mean_val * scale
                else:
                    simulated[col] = mean_val
                    
            # Scale the simulated values
            features = pd.DataFrame([simulated])
            cols_order = ['PM2.5', 'PM10', 'NO', 'NO2', 'NOx', 'NH3', 'CO', 'SO2', 'O3', 'Benzene', 'Toluene', 'Xylene']
            scaled_features = _scaler.transform(features[cols_order])
            
            # Predict AQI Bucket (0 to 5)
            # Based on standard AQI levels, high carbon scale maps to Moderate/Poor buckets (bucket value 1 or 2)
            bucket_val = 1 if scale > 1.5 else 0
            
            # Form final X input row for prediction
            input_row = list(scaled_features[0]) + [bucket_val]
            predicted_aqi = float(_model.predict([input_row])[0])
            
            # Map AQI to Environmental compliance score (Clean AQI of 50 -> 95%, High AQI of 350 -> 30%)
            env_score = max(20, min(100, int(100 - (predicted_aqi / 350.0) * 70)))
        except Exception as e:
            print(f"Error executing AQI prediction: {e}")
            env_score = max(20, min(100, int(82 - (total_carbon_value / 2000.0))))
            
    # Calculate Social score (influenced by active completed CSR participations)
    soc_score = min(100, int(70 + (csr_count * 6)))
    
    # Calculate Governance score (decreases with active violations)
    gov_score = max(20, min(100, int(95 - (pending_violations * 12))))
    
    return {
        'environmental': env_score,
        'social': soc_score,
        'governance': gov_score
    }
