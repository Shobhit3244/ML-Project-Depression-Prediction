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
train_mean = np.array([15.958333015441895, 4.543541431427002, 6.4574995040893555, 1.7423957586288452, 2.9948747158050537, 1.0020833015441895, 0.9645833373069763, 5.415625095367432, 5.555208206176758, 5.573958396911621, 0.4906249940395355, 0.5093749761581421, 0.3343749940395355, 0.3385416567325592, 0.3270833194255829])
train_std = np.array([2.041366, 2.031873, 1.4468133, 0.71886784, 0.5778394, 0.5810128, 0.8071598, 2.9314685, 2.85066, 2.8465753, 0.50017077, 0.50017077, 0.47201562, 0.4734602, 0.4693928])

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