(function () {
    'use strict';

    var currentStep = 1;
    var totalSteps = 3;
    var prevBtn = document.getElementById('prevStepBtn');
    var nextBtn = document.getElementById('nextStepBtn');
    var submitBtn = document.getElementById('submitAssessment');
    var progressBar = document.getElementById('formProgressBar');
    var progressText = document.getElementById('formProgressText');

    function updateProgress() {
        var percent = Math.round((currentStep / totalSteps) * 100);
        progressBar.style.width = percent + '%';
        progressText.textContent = percent + '%';
    }

    function showStep(step) {
        document.querySelectorAll('.form-step').forEach(function (s) { s.classList.remove('active'); });
        document.querySelector('.form-step[data-step="' + step + '"]').classList.add('active');

        prevBtn.disabled = step === 1;
        if (step === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }
        updateProgress();
    }

    nextBtn.addEventListener('click', function () {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    });

    prevBtn.addEventListener('click', function () {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    document.getElementById('age').addEventListener('input', function () {
        document.getElementById('ageValue').textContent = this.value + ' 岁';
    });

    document.getElementById('sleep').addEventListener('input', function () {
        document.getElementById('sleepValue').textContent = this.value + ' 小时';
    });

    document.getElementById('stress').addEventListener('input', function () {
        document.getElementById('stressValue').textContent = this.value + ' / 10';
    });

    document.getElementById('assessmentForm').addEventListener('submit', function (e) {
        e.preventDefault();
        calculateHealthScore();
    });

    function calculateHealthScore() {
        var age = parseInt(document.getElementById('age').value);
        var height = parseInt(document.getElementById('height').value);
        var weight = parseInt(document.getElementById('weight').value);
        var gender = document.querySelector('input[name="gender"]:checked').value;
        var exercise = document.querySelector('input[name="exercise"]:checked').value;
        var smoking = document.querySelector('input[name="smoking"]:checked').value;
        var drinking = document.querySelector('input[name="drinking"]:checked').value;
        var sleep = parseFloat(document.getElementById('sleep').value);
        var stress = parseInt(document.getElementById('stress').value);

        var familyHistory = [];
        document.querySelectorAll('input[name="familyHistory"]:checked').forEach(function (cb) {
            if (cb.value !== 'none') familyHistory.push(cb.value);
        });

        var symptoms = [];
        document.querySelectorAll('input[name="symptoms"]:checked').forEach(function (cb) {
            if (cb.value !== 'none') symptoms.push(cb.value);
        });

        var bmi = weight / Math.pow(height / 100, 2);

        var bmiScore = 100;
        if (bmi < 18.5) bmiScore = 70;
        else if (bmi < 24) bmiScore = 100;
        else if (bmi < 28) bmiScore = 75;
        else bmiScore = 55;

        var exerciseScore = { never: 40, sometimes: 65, often: 90, daily: 100 }[exercise] || 65;

        var smokingScore = { never: 100, quit: 85, sometimes: 60, often: 30 }[smoking] || 100;

        var drinkingScore = { never: 100, sometimes: 80, often: 50 }[drinking] || 100;

        var sleepScore = 100;
        if (sleep < 5) sleepScore = 50;
        else if (sleep < 6) sleepScore = 70;
        else if (sleep <= 8) sleepScore = 100;
        else if (sleep <= 9) sleepScore = 80;
        else sleepScore = 60;

        var stressScore = 100 - (stress - 1) * 10;

        var familyHistoryScore = Math.max(40, 100 - familyHistory.length * 20);

        var symptomScore = Math.max(40, 100 - symptoms.length * 15);

        var ageScore = 100;
        if (age < 30) ageScore = 100;
        else if (age < 40) ageScore = 95;
        else if (age < 50) ageScore = 85;
        else if (age < 60) ageScore = 75;
        else ageScore = 65;

        var weights = {
            bmi: 0.15,
            exercise: 0.15,
            smoking: 0.12,
            drinking: 0.08,
            sleep: 0.15,
            stress: 0.12,
            familyHistory: 0.10,
            symptom: 0.08,
            age: 0.05
        };

        var totalScore = Math.round(
            bmiScore * weights.bmi +
            exerciseScore * weights.exercise +
            smokingScore * weights.smoking +
            drinkingScore * weights.drinking +
            sleepScore * weights.sleep +
            stressScore * weights.stress +
            familyHistoryScore * weights.familyHistory +
            symptomScore * weights.symptom +
            ageScore * weights.age
        );

        totalScore = Math.max(20, Math.min(100, totalScore));

        var dimensions = [
            { name: '身体指标', score: bmiScore, color: bmiScore >= 80 ? '#00D4AA' : bmiScore >= 60 ? '#ffb020' : '#ff4d6a' },
            { name: '运动习惯', score: exerciseScore, color: exerciseScore >= 80 ? '#00D4AA' : exerciseScore >= 60 ? '#ffb020' : '#ff4d6a' },
            { name: '吸烟饮酒', score: Math.round((smokingScore + drinkingScore) / 2), color: (smokingScore + drinkingScore) / 2 >= 80 ? '#00D4AA' : (smokingScore + drinkingScore) / 2 >= 60 ? '#ffb020' : '#ff4d6a' },
            { name: '睡眠质量', score: sleepScore, color: sleepScore >= 80 ? '#00D4AA' : sleepScore >= 60 ? '#ffb020' : '#ff4d6a' },
            { name: '心理压力', score: stressScore, color: stressScore >= 80 ? '#00D4AA' : stressScore >= 60 ? '#ffb020' : '#ff4d6a' },
            { name: '遗传风险', score: familyHistoryScore, color: familyHistoryScore >= 80 ? '#00D4AA' : familyHistoryScore >= 60 ? '#ffb020' : '#ff4d6a' },
        ];

        var suggestions = [];

        if (bmiScore < 80) {
            suggestions.push({ icon: '⚖️', text: '您的BMI指数为' + bmi.toFixed(1) + '，建议通过合理饮食和运动调整体重至健康范围（18.5-24）。' });
        }
        if (exerciseScore < 80) {
            suggestions.push({ icon: '🏃', text: '建议增加运动频率，每周至少进行150分钟中等强度有氧运动。' });
        }
        if (smokingScore < 80) {
            suggestions.push({ icon: '🚭', text: '吸烟是多种疾病的重要危险因素，强烈建议戒烟。可咨询戒烟门诊获取专业帮助。' });
        }
        if (sleepScore < 80) {
            suggestions.push({ icon: '😴', text: '睡眠质量对健康至关重要，建议保持7-8小时的规律睡眠，睡前避免使用电子设备。' });
        }
        if (stressScore < 70) {
            suggestions.push({ icon: '🧘', text: '您的压力水平偏高，建议尝试冥想、深呼吸或瑜伽等放松方式，必要时寻求心理咨询。' });
        }
        if (familyHistory.length > 0) {
            suggestions.push({ icon: '🏥', text: '您有家族病史，建议定期进行针对性体检，做到早发现、早预防。' });
        }
        if (suggestions.length === 0) {
            suggestions.push({ icon: '✅', text: '您的各项健康指标良好，请继续保持健康的生活方式！' });
        }

        showResult(totalScore, dimensions, suggestions);
    }

    function showResult(score, dimensions, suggestions) {
        var resultCard = document.getElementById('assessmentResult');
        resultCard.style.display = 'block';

        var now = new Date();
        document.getElementById('resultDate').textContent = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

        var scoreCircle = document.getElementById('scoreCircle');
        var circumference = 408.4;
        var offset = circumference * (1 - score / 100);

        setTimeout(function () {
            scoreCircle.style.transition = 'stroke-dashoffset 1.5s ease';
            scoreCircle.setAttribute('stroke-dashoffset', offset);
        }, 100);

        var scoreNum = document.getElementById('healthScore');
        var start = 0;
        var duration = 1500;
        var startTime = null;
        function animateScore(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            scoreNum.textContent = Math.round(eased * score);
            if (progress < 1) requestAnimationFrame(animateScore);
        }
        requestAnimationFrame(animateScore);

        var dimensionsHtml = dimensions.map(function (d) {
            return '<div class="dimension-item">' +
                '<span class="dimension-label">' + d.name + '</span>' +
                '<div class="dimension-bar"><div class="dimension-fill" style="width: 0%; background: ' + d.color + ';" data-width="' + d.score + '%"></div></div>' +
                '<span class="dimension-value" style="color: ' + d.color + '">' + d.score + '</span>' +
                '</div>';
        }).join('');
        document.getElementById('resultDimensions').innerHTML = dimensionsHtml;

        setTimeout(function () {
            document.querySelectorAll('.dimension-fill').forEach(function (fill) {
                fill.style.width = fill.getAttribute('data-width');
            });
        }, 200);

        var suggestionsHtml = suggestions.map(function (s) {
            return '<div class="suggestion-item">' +
                '<span class="suggestion-icon">' + s.icon + '</span>' +
                '<span>' + s.text + '</span>' +
                '</div>';
        }).join('');
        document.getElementById('resultSuggestions').innerHTML = suggestionsHtml;

        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.resetAssessment = function () {
        currentStep = 1;
        showStep(1);
        document.getElementById('assessmentResult').style.display = 'none';
        document.getElementById('assessmentForm').reset();
        document.getElementById('ageValue').textContent = '30 岁';
        document.getElementById('sleepValue').textContent = '7 小时';
        document.getElementById('stressValue').textContent = '5 / 10';

        var scoreCircle = document.getElementById('scoreCircle');
        scoreCircle.style.transition = 'none';
        scoreCircle.setAttribute('stroke-dashoffset', 408.4);
        document.getElementById('healthScore').textContent = '0';
    };

})();