document.addEventListener('DOMContentLoaded', () => {
    // --- Tabs Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.calculator-view');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            views.forEach(v => v.classList.add('hidden'));

            // Add active to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // --- Age Calculator Logic ---
    const dobInput = document.getElementById('dob');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultSection = document.getElementById('result-section');
    const errorMsg = document.getElementById('error-msg');
    
    const resYears = document.getElementById('res-years');
    const resMonths = document.getElementById('res-months');
    const resDays = document.getElementById('res-days');
    const dayResult = document.getElementById('day-result');
    const resDayName = document.getElementById('res-day-name');

    // Set max date to today
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    dobInput.setAttribute('max', formattedToday);

    calculateBtn.addEventListener('click', () => {
        const dobValue = dobInput.value;
        
        if (!dobValue) {
            showError('Please enter your date of birth.');
            return;
        }

        const dob = new Date(dobValue);
        const now = new Date();

        if (dob > now) {
            showError('Date of birth cannot be in the future.');
            return;
        }

        errorMsg.classList.add('hidden');

        // Calculate Age
        let years = now.getFullYear() - dob.getFullYear();
        let months = now.getMonth() - dob.getMonth();
        let days = now.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += previousMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Animate numbers
        animateValue(resYears, 0, years, 1000);
        animateValue(resMonths, 0, months, 1000);
        animateValue(resDays, 0, days, 1000);

        // Calculate and show day of week
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        resDayName.textContent = daysOfWeek[dob.getDay()];
        dayResult.classList.remove('hidden');

        resultSection.classList.remove('hidden');
    });

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
        resultSection.classList.add('hidden');
        dayResult.classList.add('hidden');
    }

    // --- BMI Calculator Logic ---
    const bmiAgeInput = document.getElementById('bmi-age');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const calculateBmiBtn = document.getElementById('calculate-bmi-btn');
    const bmiResultSection = document.getElementById('bmi-result-section');
    const bmiCategoryResult = document.getElementById('bmi-category-result');
    const bmiErrorMsg = document.getElementById('bmi-error-msg');
    
    const resBmi = document.getElementById('res-bmi');
    const resBmiCategory = document.getElementById('res-bmi-category');

    calculateBmiBtn.addEventListener('click', () => {
        const age = parseInt(bmiAgeInput.value);
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if (isNaN(height) || isNaN(weight) || isNaN(age) || height <= 0 || weight <= 0 || age <= 0) {
            bmiErrorMsg.textContent = 'Please enter valid age, height, and weight.';
            bmiErrorMsg.classList.remove('hidden');
            bmiResultSection.classList.add('hidden');
            bmiCategoryResult.classList.add('hidden');
            return;
        }

        bmiErrorMsg.classList.add('hidden');

        // BMI Formula: weight (kg) / (height (m))^2
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        let category = '';
        let color = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3b82f6'; // blue
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = 'Normal weight';
            color = '#22c55e'; // green
        } else if (bmi >= 25 && bmi < 29.9) {
            category = 'Overweight';
            color = '#f59e0b'; // orange
        } else {
            category = 'Obese';
            color = '#ef4444'; // red
        }

        // Animate BMI value
        animateBmiValue(resBmi, 0, bmi, 1000);
        
        resBmiCategory.textContent = category;
        resBmiCategory.style.color = color;

        bmiResultSection.classList.remove('hidden');
        bmiCategoryResult.classList.remove('hidden');
    });

    function animateBmiValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            obj.innerHTML = (easeOut * (end - start) + start).toFixed(1);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toFixed(1);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Reuse age animate logic
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            obj.innerHTML = Math.floor(easeOut * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end;
            }
        };
        window.requestAnimationFrame(step);
    }
});
