let currentTab = 0;
showTab(currentTab);

function showTab(n) {
    let x = document.getElementsByClassName("step");
    // Hide all steps
    for (let i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
    // Show current step
    x[n].classList.add("active");

    // Progress Bar logic
    let progress = ((n + 1) / 4) * 100; // 4 input steps
    if (n >= 4) progress = 100;
    document.getElementById("progress-bar").style.width = progress + "%";

    // Button Logic
    if (n == 0) {
        document.getElementById("prev-btn").style.display = "none";
    } else {
        document.getElementById("prev-btn").style.display = "block";
    }

    if (n == 3) {
        document.getElementById("next-btn").innerHTML = "Calculate Risk";
    } else {
        document.getElementById("next-btn").innerHTML = "Next";
    }
}

function nextPrev(n) {
    let x = document.getElementsByClassName("step");

    // If we are on the last step and hit Next, trigger the API
    if (currentTab == 3 && n == 1) {
        startLoadingAndPredict();
        return;
    }

    currentTab = currentTab + n;
    showTab(currentTab);
}

// Positive Quotes for the Loading Screen
const quotes = [
    "Healing takes time, and asking for help is a courageous step.",
    "Your mental health is a priority. Your happiness is an essential.",
    "It's okay to not be okay. Just don't give up.",
    "Deep breaths. You are stronger than your anxiety.",
    "Taking care of your mind is the most productive thing you can do."
];

async function startLoadingAndPredict() {
    // Hide UI controls and show loading screen
    document.getElementById("nav-buttons").style.display = "none";
    document.getElementById("progress-container").style.display = "none";

    let x = document.getElementsByClassName("step");
    for (let i = 0; i < x.length; i++) x[i].classList.remove("active");

    document.getElementById("loading-step").classList.add("active");

    // Cycle through quotes every 1.5 seconds
    let quoteIndex = 0;
    const quoteInterval = setInterval(() => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        document.getElementById("quote-text").innerText = quotes[quoteIndex];
    }, 1500);

    // Fetch the prediction in the background
    await makePrediction();

    // Enforce a minimum 5-second loading time for visual effect
    setTimeout(() => {
        clearInterval(quoteInterval);
        document.getElementById("loading-step").classList.remove("active");
        document.getElementById("result-step").classList.add("active");
    }, 5000);
}

async function makePrediction() {
    // Gather Inputs
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
        const response = await fetch('https://Shobhit3244-mindmetrics-api.hf.space/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ features: userFeatures })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.success) {
            const percentage = data.risk_score.toFixed(1);
            const resultText = document.getElementById('result-text');
            const diagnosis = document.getElementById('result-diagnosis');
            const advice = document.getElementById('result-advice');
            const circle = document.querySelector('.score-circle');

            resultText.innerText = `${percentage}%`;

            if (percentage < 30) {
                resultText.style.color = "#34d399";
                circle.style.borderColor = "#34d399";
                diagnosis.innerText = "Low Risk";
                advice.innerText = "Your lifestyle habits look great! Maintain your healthy balance of screen time, sleep, and social interaction.";
            } else if (percentage < 70) {
                resultText.style.color = "#fbbf24";
                circle.style.borderColor = "#fbbf24";
                diagnosis.innerText = "Moderate Risk";
                advice.innerText = "You might be experiencing some burnout. Consider reducing screen time before bed and practicing mindfulness techniques.";
            } else {
                resultText.style.color = "#f87171";
                circle.style.borderColor = "#f87171";
                diagnosis.innerText = "High Risk Indicator";
                advice.innerText = "Your metrics suggest high levels of stress and digital fatigue. It is highly recommended to talk to a counselor or trusted adult about how you are feeling.";
            }
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('result-diagnosis').innerText = "Connection Error";
        document.getElementById('result-advice').innerText = "";
        document.getElementById('error-log').innerText = "Could not reach the AI Server. Please try again later.";
    }
}