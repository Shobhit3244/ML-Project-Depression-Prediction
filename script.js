let model;

// ⚠️ PASTE YOUR PYTHON MEANS AND STDs HERE ⚠️
const trainMean = [20.5, 5.2, 7.1, 2.5, /* ... rest ... */ 0.0];
const trainStd =  [2.1,  1.5, 1.2, 0.8, /* ... rest ... */  1.0];

// ==========================================
// 1. INITIALIZE MODEL
// ==========================================
async function loadModel() {
    try {
        console.log("Attempting to load model from ./model/tfjs_model/model.json...");

        // Ensure this path matches your GitHub repo exactly
        model = await tf.loadLayersModel('./model/tfjs_model/model.json');

        const btn = document.getElementById('predict-btn');
        btn.innerText = "Calculate Risk Score";
        btn.disabled = false;
        console.log("Model loaded successfully!");

    } catch (error) {
        console.error("CRITICAL ERROR: Failed to load model.", error);
        const btn = document.getElementById('predict-btn');
        btn.innerText = "Model Load Error";

        // Show the exact error on the screen for debugging
        document.getElementById('result-container').style.display = 'block';
        document.getElementById('error-log').innerText = "Error: " + error.message + "\n(Press F12 to check the console for details)";
    }
}

// ==========================================
// 2. PROCESS DATA & PREDICT
// ==========================================
async function runPrediction() {
    const rawAge = parseFloat(document.getElementById('age').value);
    const rawSleep = parseFloat(document.getElementById('sleepHours').value);
    const rawStress = parseFloat(document.getElementById('stressLevel').value);
    const gender = document.getElementById('gender').value;

    let userFeatures = [
        rawAge,
        rawSleep,
        rawStress,
        // Remember to add the rest of your features here in the exact order!
        gender === 'female' ? 1.0 : 0.0,
        gender === 'male' ? 1.0 : 0.0
    ];

    let scaledFeatures = [];
    for (let i = 0; i < userFeatures.length; i++) {
        let zScore = (userFeatures[i] - trainMean[i]) / trainStd[i];
        scaledFeatures.push(zScore);
    }

    const inputTensor = tf.tensor2d([scaledFeatures]);
    const prediction = model.predict(inputTensor);
    const probabilityValue = await prediction.data();

    const percentage = (probabilityValue[0] * 100).toFixed(1);

    document.getElementById('result-container').style.display = 'block';
    document.getElementById('result-text').innerText = `${percentage}%`;
    document.getElementById('error-log').innerText = ""; // Clear any old errors

    inputTensor.dispose();
    prediction.dispose();
}

// Start loading the model
loadModel();