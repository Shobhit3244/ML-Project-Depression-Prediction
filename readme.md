# 🧠 Mental Health & Social Media: Depression Risk Predictor

[![Test the Live Website!](https://img.shields.io/badge/Test_the_Live_Website!-FF4B4B?style=for-the-badge&logo=googlechrome&logoColor=white)](https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/)

**A College Machine Learning Project** investigating the correlation between digital habits, lifestyle factors, and depression. This project features an end-to-end pipeline: from manual data preprocessing from scratch to training a Deep Neural Network, culminating in a serverless, browser-based deployment using TensorFlow.js.

---

## 📖 Project Overview

The goal of this project is to predict the **probability** of an individual experiencing depression based on behavioral, demographic, and academic data. Rather than simply classifying a user as "Depressed" or "Not Depressed" (a binary output), the model is designed to output a continuous risk score (0.0 to 1.0). This spectrum approach is crucial in healthcare and psychology, as it allows for threshold tuning and early-intervention risk assessments.

---

## 📊 Dataset Features

The model ingests a complex dataset containing both numerical and categorical variables:
* **Demographics:** Age, Gender
* **Digital Habits:** Daily Social Media Hours, Platform Usage (Instagram, TikTok, Both), Screen Time Before Sleep
* **Lifestyle:** Sleep Hours, Physical Activity, Social Interaction Level
* **Psychological/Academic:** Academic Performance, Stress Level, Anxiety Level, Addiction Level
* **Target Variable:** `depression_label` (0 = No, 1 = Yes)

---

## ⚙️ Methodology & Mathematical Reasoning

To demonstrate a deep understanding of data science fundamentals, all preprocessing steps (encoding, scaling, splitting) were implemented manually using **Pandas** and **NumPy**, strictly avoiding automated wrapper functions from `scikit-learn`.

### 1. Categorical Encoding
Machine learning models require numerical inputs. Categorical data was handled based on its underlying mathematical nature:
* **Ordinal Encoding:** Features with a natural hierarchy (e.g., `social_interaction_level` as 'low', 'medium', 'high') were mapped linearly to integers (0, 1, 2). This preserves the intrinsic weight of the categories.
* **One-Hot Encoding:** Nominal data without a natural rank (e.g., `platform_usage` and `gender`) were transformed using binary dummy variables. This prevents the neural network from incorrectly assuming that "Instagram" is mathematically greater than "TikTok".

### 2. Manual Train/Test Split & Data Leakage Prevention
The dataset was randomly shuffled and sliced into an 80% training set and a 20% testing set. 
**Reasoning:** The testing set must act as strictly unseen data. By manually enforcing this split *before* scaling, we ensure zero "data leakage" occurs (where the model accidentally learns the statistical distribution of the test set).

### 3. Feature Scaling (Z-Score Standardization)
Neural networks are highly sensitive to unscaled data due to the nature of gradient descent optimization. A feature like `age` (e.g., 20) would statistically overpower `screen_time` (e.g., 1.5), distorting the weights.

We scaled features using Standard/Z-Score Normalization. The mean ($\mu$) and standard deviation ($\sigma$) were calculated **strictly on the training data**, and the formula was applied to both the train and test sets:

$$Z = \frac{X - \mu}{\sigma}$$

---

## 🧠 Model Architecture

The core of the project is a Feed-Forward Neural Network (Multilayer Perceptron) built with **TensorFlow/Keras**. 

* **Input Layer:** Dynamically sizes to the number of processed features.
* **Hidden Layers:** * `Dense (32 neurons)` + `ReLU` activation function. 
  * `Dropout (0.2)`: Randomly deactivates 20% of neurons during training. **Reasoning:** This acts as regularization, preventing the model from overfitting or relying too heavily on dominant features like `stress_level`.
  * `Dense (16 neurons)` + `ReLU` activation.
* **Output Layer:** `Dense (1 neuron)` + `Sigmoid` activation. 
  **Reasoning:** The Sigmoid function mathematically forces the final output into a probability distribution curve between 0 and 1:
  $$S(x) = \frac{1}{1 + e^{-x}}$$
* **Compilation:** Optimized using the `Adam` optimizer and evaluated using `binary_crossentropy` loss, which heavily penalizes the model for being confidently incorrect.

---

## 🌐 Web Deployment (TensorFlow.js)

The project leverages a serverless architecture, drastically reducing hosting costs and latency.
1. The trained Keras 3 model (`.keras`) was converted to a web-friendly JSON and binary weight format (`tfjs_layers_model`) using the `tensorflowjs_converter`.
2. The web interface relies on standard HTML/JS. 
3. **In-Browser Inference:** When a user inputs their data, the standardizations are applied in JavaScript, and the prediction happens entirely client-side. No user data is ever sent to a backend server, ensuring complete data privacy.
4. Hosted statically and freely via **GitHub Pages**.

---

## 💻 How to Run Locally

If you wish to explore the code or run the Python notebook locally:

1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git)