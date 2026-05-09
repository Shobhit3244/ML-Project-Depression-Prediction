// Enable the button immediately since we don't have to wait for TFJS to load anymore!
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById('predict-btn');
    btn.disabled = false;
    btn.innerText = "Calculate Risk Score";
});

async function runPrediction() {
    // 1. Change button text to show it's working (and disable it so they don't spam click)
    const btn = document.getElementById('predict-btn');
    btn.innerText = "Calculating (Waking Server)...";
    btn.disabled = true;

    // 2. Gather all raw inputs from the HTML form
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

    // 3. Map exactly to Python DataFrame columns (Must be 15 items!)
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

    try {
        // 4. Send the data to your live Render Python backend
        // Make sure this matches your exact Render URL ending in /predict
        const response = await fetch('https://Shobhit3244-mindmetrics-api.hf.space/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ features: userFeatures })
        });

        // If the server is still waking up or errors out
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            // 5. Display the result
            const percentage = data.risk_score.toFixed(1);
            document.getElementById('result-container').style.display = 'block';
            document.getElementById('result-text').innerText = `${percentage}%`;

            // Dynamic coloring based on risk severity
            if (percentage < 30) {
                document.getElementById('result-text').style.color = "#32D74B"; // Green
            } else if (percentage < 70) {
                document.getElementById('result-text').style.color = "#FFD60A"; // Yellow
            } else {
                document.getElementById('result-text').style.color = "#FF453A"; // Red
            }

            document.getElementById('error-log').innerText = "";
        } else {
            throw new Error(data.error);
        }

    } catch (error) {
        console.error("Prediction error:", error);
        document.getElementById('result-container').style.display = 'block';
        document.getElementById('error-log').innerText = "Server Error: Could not connect to AI. Please try again in 30 seconds (Server might be waking up).";
    } finally {
        // Reset button state
        btn.innerText = "Calculate Risk Score";
        btn.disabled = false;
    }
}