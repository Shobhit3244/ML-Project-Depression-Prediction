# MindMetrics: AI-Powered Teenage Mental Health Predictor

![Live Demo](https://img.shields.io/badge/Live_Demo-Active-success)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15-orange)
![Flask](https://img.shields.io/badge/Flask-Backend-green)

**Live Demo:** [https://shobhit3244.github.io/ML-Project-Depression-Prediction/](https://shobhit3244.github.io/ML-Project-Depression-Prediction/)

## 📌 Project Overview
MindMetrics is a full-stack machine learning web application designed to assess the estimated risk of depression in teenagers based on lifestyle and psychological factors. The project utilizes a deep learning Neural Network trained on a comprehensive dataset of teenage mental health indicators.

## 🚀 Architecture
This application utilizes a decoupled frontend-backend architecture to bypass typical cloud memory constraints:
* **Frontend:** A responsive, interactive Single Page Application (SPA) built with HTML, CSS (Glassmorphism), and Vanilla JS, hosted on GitHub Pages.
* **Backend:** A Python Flask API hosted on a 16GB Hugging Face Docker Space to handle the heavy computational load of TensorFlow.
* **Model:** A custom Sequential Neural Network trained using Keras/TensorFlow.

## 📊 The Dataset & Methodology
The model analyzes 15 key features, including:
* Daily Social Media Hours & Primary Platform
* Screen Time Before Sleep
* Academic Performance & Physical Activity
* Self-reported Stress, Anxiety, and Addiction levels

**Data Preprocessing:**
* Categorical variables (e.g., Platform, Gender) were One-Hot Encoded.
* Ordinal variables (e.g., Social Interaction) were mapped numerically.
* Continuous variables were normalized using Z-score scaling to ensure stable neural network gradients.

**Model Performance:**
* **Architecture:** 3 Dense layers with ReLU activation, incorporating a Dropout layer (0.2) to prevent overfitting, and a final Sigmoid activation for probability output.
* **Validation Accuracy:** ~97.4%
* **Loss Function:** Binary Crossentropy

## 💻 Running the Project Locally

### Backend Setup
1. Navigate to the backend directory.
2. Install dependencies: `pip install -r requirements.txt`
3. Run the Flask server: `python app.py`
4. The API will be available at `http://127.0.0.1:7860`

### Frontend Setup
1. Open the frontend repository.
2. You can use any live server (e.g., VS Code Live Server) to open `index.html`.
3. *Note: Ensure the `fetch` URL in `script.js` points to your local backend if testing locally, or the Hugging Face Space URL for production.*

## 📝 License
This project was created for educational purposes.