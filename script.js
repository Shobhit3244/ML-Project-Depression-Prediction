let model;

const trainMean = [
    15.936458587646484, 4.491145610809326, 6.424062728881836, 1.7385417222976685,
    2.992572784423828, 1.010312557220459, 0.9437500238418579, 5.4395833015441895,
    5.608333110809326, 5.552083492279053, 0.484375, 0.515625, 0.33125001192092896,
    0.3375000059604645, 0.33125001192092896
];

const trainStd = [
    2.0148368, 2.0248342, 1.4376854, 0.719573, 0.5772097, 0.5796402,
    0.80468136, 2.8883464, 2.8644607, 2.823523, 0.5000163, 0.5000163,
    0.47090688, 0.4731033, 0.47090697
];

// ==========================================
// 1. INITIALIZE MODEL
// ==========================================
async function loadModel() {
    try {
        console.log("Attempting to load model from ./model/tfjs_model/model.json...");
        model = await tf.loadLayersModel('./model/tfjs_model/model.json');

        const btn = document.getElementById('predict-btn');
        btn.innerText = "Calculate Risk Score";
        btn.disabled = false;
        console.log("Model loaded successfully!");

    } catch (error) {
        console.error("CRITICAL ERROR: Failed to load model.", error);
        const btn = document.getElementById('predict-btn');
        btn.innerText = "Model Load Error";

        document.getElementById('result-container').style.display = 'block';
        document.getElementById('error-log').innerText = "Error: " + error.message;
    }
}

// ==========================================
// 2. PROCESS DATA & PREDICT
// ==========================================
async function runPrediction() {
    // 1. Gather all raw inputs
    const rawAge = parseFloat(document.getElementById('age').value);
    const rawDailySocial = parseFloat(document.getElementById('dailySocial').value);
    const rawSleep = parseFloat(document.getElementById('sleepHours').value);
    const rawScreenTime = parseFloat(document.getElementById('screenTime').value);
    const rawAcademic = parseFloat(document.getElementById('academic').value);
    const rawPhysical = parseFloat(document.getElementById('physical').value);
    const rawSocialInteraction = parseFloat(document.getElementById('socialInteraction').value); // 0, 1, or 2
    const rawStress = parseFloat(document.getElementById('stressLevel').value);
    const rawAnxiety = parseFloat(document.getElementById('anxietyLevel').value);
    const rawAddiction = parseFloat(document.getElementById('addictionLevel').value);

    const gender = document.getElementById('gender').value;
    const platform = document.getElementById('platform').value;

    // 2. Map exactly to Python DataFrame columns
    let userFeatures = [
        rawAge,
        rawDailySocial,
        rawSleep,
        rawScreenTime,
        rawAcademic,
        rawPhysical,
        rawSocialInteraction,
        rawStress,
        rawAnxiety,
        rawAddiction,
        gender === 'female' ? 1.0 : 0.0,
        gender === 'male' ? 1.0 : 0.0,
        platform === 'Both' ? 1.0 : 0.0,
        platform === 'Instagram' ? 1.0 : 0.0,
        platform === 'TikTok' ? 1.0 : 0.0
    ];

    // 3. Apply Z-Score Scaling
    let scaledFeatures = [];
    for (let i = 0; i < userFeatures.length; i++) {
        let zScore = (userFeatures[i] - trainMean[i]) / trainStd[i];
        scaledFeatures.push(zScore);
    }

    try {
        // 4. Create Tensor and Predict
        const inputTensor = tf.tensor2d([scaledFeatures]);
        const prediction = model.predict(inputTensor);
        const probabilityValue = await prediction.data();

        const percentage = (probabilityValue[0] * 100).toFixed(1);

        document.getElementById('result-container').style.display = 'block';
        document.getElementById('result-text').innerText = `${percentage}%`;

        // Dynamic coloring based on risk
        if (percentage < 30) document.getElementById('result-text').style.color = "#32D74B"; // Green
        else if (percentage < 70) document.getElementById('result-text').style.color = "#FFD60A"; // Yellow
        else document.getElementById('result-text').style.color = "#FF453A"; // Red

        document.getElementById('error-log').innerText = "";

        inputTensor.dispose();
        prediction.dispose();
    } catch (error) {
        console.error("Prediction error:", error);
        document.getElementById('error-log').innerText = "Prediction Error: Check Console";
    }
}

// Start loading the model
loadModel();