import pandas as pd
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

dataset = pd.read_csv('dataset/Teen_Mental_Health_Dataset.csv')
# ==========================================
# STEP 1: MANUAL DATA PREPROCESSING
# ==========================================
print("Starting Data Preprocessing...")
df = dataset.copy()

# 1a. Encode Ordinal Data (Preserving mathematical hierarchy)
interaction_map = {'low': 0, 'medium': 1, 'high': 2}
df['social_interaction_level'] = df['social_interaction_level'].map(interaction_map)

# 1b. One-Hot Encode Nominal Data (Preventing false hierarchy)
df = pd.get_dummies(df, columns=['gender', 'platform_usage'])

# Separate Features (X) and Target (y)
X = df.drop('depression_label', axis=1).astype(np.float32)
y = df['depression_label'].astype(np.float32)

# 1c. Manual Train/Test Split (80/20) to prevent data leakage
np.random.seed(42)
shuffled_indices = np.random.permutation(len(X))
split_index = int(len(X) * 0.8)

train_indices, test_indices = shuffled_indices[:split_index], shuffled_indices[split_index:]
X_train, X_test = X.iloc[train_indices], X.iloc[test_indices]
y_train, y_test = y.iloc[train_indices], y.iloc[test_indices]

# 1d. Manual Feature Scaling (Z-Score Normalization)
# Calculated strictly on training data to mimic real-world unseen data
train_mean = X_train.mean(axis=0)
train_std = X_train.std(axis=0)
train_std = np.where(train_std == 0, 1e-7, train_std) # Prevent divide by zero

X_train_scaled = (X_train - train_mean) / train_std
X_test_scaled = (X_test - train_mean) / train_std

print("Preprocessing Complete!\n")

# ==========================================
# STEP 2: BASELINE MODEL (Logistic Regression)
# ==========================================
print("Training Baseline Logistic Regression Model...")
log_reg = LogisticRegression(random_state=42)
log_reg.fit(X_train_scaled, y_train)

# Predict and calculate baseline accuracy
log_reg_predictions = log_reg.predict(X_test_scaled)
log_reg_accuracy = accuracy_score(y_test, log_reg_predictions)
print(f"Logistic Regression Accuracy: {log_reg_accuracy * 100:.2f}%\n")


# ==========================================
# STEP 3: ADVANCED MODEL (Deep Neural Network)
# ==========================================
print("Training Deep Neural Network...")
nn_model = tf.keras.Sequential([
    tf.keras.layers.Dense(32, activation='relu', input_shape=(X_train_scaled.shape[1],)),
    tf.keras.layers.Dropout(0.2), # Regularization to prevent overfitting
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid') # Sigmoid for probability extraction
])

nn_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model silently (verbose=0)
history = nn_model.fit(X_train_scaled, y_train, epochs=50, batch_size=16, validation_split=0.1, verbose=0)

# Evaluate Neural Network accuracy
nn_loss, nn_accuracy = nn_model.evaluate(X_test_scaled, y_test, verbose=0)
print(f"Neural Network Accuracy: {nn_accuracy * 100:.2f}%\n")


# ==========================================
# STEP 4: COMPARATIVE VISUALIZATION
# ==========================================
print("Generating Comparative Assessment Graph...")
models = ['Logistic Regression', 'Neural Network']
accuracies = [log_reg_accuracy * 100, nn_accuracy * 100]

plt.figure(figsize=(8, 5))
bars = plt.bar(models, accuracies, color=['#4C72B0', '#55A868'])
plt.title('Model Performance Comparison: Depression Risk Prediction', fontsize=14)
plt.ylabel('Accuracy (%)', fontsize=12)
plt.ylim(0, 100)

# Add the text labels on top of the bars
for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, yval + 1, f'{yval:.2f}%', ha='center', va='bottom', fontsize=11)

plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.show()

# ------------------------------------------
# OPTIONAL: Save the Neural Network for Web Deployment
# ------------------------------------------
nn_model.save("depression_model.keras")
# !tensorflowjs_converter --input_format=keras_keras --output_format=tfjs_layers_model depression_model.keras tfjs_model