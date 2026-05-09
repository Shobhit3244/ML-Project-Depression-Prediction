from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os

app = Flask(__name__)

# STRONGER CORS CONFIGURATION: Allow all origins, methods, and headers
CORS(app, resources={r"/*": {"origins": "*"}}) 

# 1. Load the model (Must be in the exact same folder as this script on Render)
# We use try-except to catch any file path errors immediately
try:
    model = tf.keras.models.load_model('depression_model.h5')
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

# 2. Your exact scaling numbers from Kaggle
train_mean = np.array([15.936, 4.491, 6.424, 1.738, 2.992, 1.010, 0.943, 5.439, 5.608, 5.552, 0.484, 0.515, 0.331, 0.337, 0.331])
train_std = np.array([2.014, 2.024, 1.437, 0.719, 0.577, 0.579, 0.804, 2.888, 2.864, 2.823, 0.500, 0.500, 0.470, 0.473, 0.470])

# 3. The Prediction Endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Grab the data sent from the frontend website
        data = request.json
        user_features = np.array(data['features'])
        
        # Scale the data using Z-score normalization
        scaled_features = (user_features - train_mean) / train_std
        
        # Reshape for the Neural Network (1 row, 15 columns)
        input_tensor = scaled_features.reshape(1, -1)
        
        # Make the prediction
        prediction = model.predict(input_tensor)
        risk_score = float(prediction[0][0]) * 100
        
        # Send the score back to the frontend
        return jsonify({'success': True, 'risk_score': risk_score})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# Default route just to check if the server is awake
@app.route('/', methods=['GET'])
def home():
    return "MindMetrics AI Server is Awake and Running!"

if __name__ == '__main__':
    # Use the port assigned by Render, or 5000 locally
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)