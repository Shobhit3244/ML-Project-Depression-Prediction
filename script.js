async function runPrediction() {
    // 1. Change button text to show it's working
    const btn = document.getElementById('predict-btn');
    btn.innerText = "Calculating...";
    btn.disabled = true;

    // 2. Gather all raw inputs
    const rawAge = parseFloat(document.getElementById('age').value);
    const rawDailySocial = parseFloat(document.getElementById('dailySocial').value);
    const rawSleep = parseFloat(document.getElementById('sleepHours').value);
    const rawScreenTime = parseFloat(document.getElementById('screenTime').value);
    const rawAcademic = parseFloat(document.getElementById('academic').value);
    const rawPhysical = parseFloat(document.getElementById('physical').value);
    const rawSocialInteraction = parseFloat(document.getElementById('socialInteraction').value);
    const rawStress = parseFloat(document.getElementById('stressLevel').value);
    const rawAnxiety = parseFloat(document.getElementById('anxietyLevel').value);
    const rawAddiction = parseFloat(document.getElementById('addictionLevel').value);
    const gender = document.getElementById('gender').value;
    const platform = document.getElementById('platform').value;

    // 3. Map exactly to Python DataFrame columns
    let userFeatures = [
        rawAge, rawDailySocial, rawSleep, rawScreenTime, rawAcademic, rawPhysical,
        rawSocialInteraction, rawStress, rawAnxiety, rawAddiction,
        gender === 'female' ? 1.0 : 0.0,
        gender === 'male' ? 1.0 : 0.0,
        platform === 'Both' ? 1.0 : 0.0,
        platform === 'Instagram' ? 1.0 : 0.0,
        platform === 'TikTok' ? 1.0 : 0.0
    ];

    try {
        // 4. Send the data to your Python backend
        // Note: You will replace this URL with your actual live Python server URL later
        // Replace the 127.0.0.1 link with your real Render URL!
        const response = await fetch('https://ml-project-depression-prediction-api.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ features: userFeatures })
        });

        const data = await response.json();

        if (data.success) {
            // 5. Display the result
            const percentage = data.risk_score.toFixed(1);
            document.getElementById('result-container').style.display = 'block';
            document.getElementById('result-text').innerText = `${percentage}%`;

            if (percentage < 30) document.getElementById('result-text').style.color = "#32D74B";
            else if (percentage < 70) document.getElementById('result-text').style.color = "#FFD60A";
            else document.getElementById('result-text').style.color = "#FF453A";

            document.getElementById('error-log').innerText = "";
        } else {
            throw new Error(data.error);
        }

    } catch (error) {
        console.error("Prediction error:", error);
        document.getElementById('result-container').style.display = 'block';
        document.getElementById('error-log').innerText = "Server Error: " + error.message;
    } finally {
        // Reset button
        btn.innerText = "Calculate Risk Score";
        btn.disabled = false;
    }
}

// Enable the button immediately since we don't have to wait for TF.js to load anymore!
document.getElementById('predict-btn').disabled = false;
document.getElementById('predict-btn').innerText = "Calculate Risk Score";