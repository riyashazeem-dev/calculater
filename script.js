document.addEventListener('DOMContentLoaded', () => {
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

        // Hide error if valid
        errorMsg.classList.add('hidden');

        // Calculate Age
        let years = now.getFullYear() - dob.getFullYear();
        let months = now.getMonth() - dob.getMonth();
        let days = now.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            // Get the number of days in the previous month
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

        // Show result section
        resultSection.classList.remove('hidden');
    });

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
        resultSection.classList.add('hidden');
        dayResult.classList.add('hidden');
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            obj.innerHTML = Math.floor(easeOut * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end; // Ensure exact final value
            }
        };
        window.requestAnimationFrame(step);
    }
});
