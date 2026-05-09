from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np

app = Flask(__name__)
# CORS is required so your GitHub Pages site is allowed to talk to this server
CORS(app) 

# 1. Load the model (you can use your .keras or .h5 file here)
model = tf.keras.models.load_model('depression_model.h5')

# 2. Add your scaling numbers
train_mean = np.array([15.936, 4.491, 6.424, 1.738, 2.992, 1.010, 0.943, 5.439, 5.608, 5.552, 0.484, 0.515, 0.331, 0.337, 0.331])
train_std = np.array([2.014, 2.024, 1.437, 0.719, 0.577, 0.579, 0.804, 2.888, 2.864, 2.823, 0.500, 0.500, 0.470, 0.473, 0.470])

# 3. Create the API endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the data sent from the website
        data = request.json
        user_features = np.array(data['features'])
        
        # Scale the data and reshape for the model
        scaled_features = (user_features - train_mean) / train_std
        input_tensor = scaled_features.reshape(1, -1)
        
        # Make the prediction
        prediction = model.predict(input_tensor)
        risk_score = float(prediction[0][0]) * 100
        
        # Send the score back to the website
        return jsonify({'success': True, 'risk_score': risk_score})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)