(function () {
    'use strict';

    var chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(26, 32, 53, 0.95)',
                titleColor: '#f0f4f8',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(0, 212, 170, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
                ticks: { color: '#64748b', font: { size: 11 } }
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
                ticks: { color: '#64748b', font: { size: 11 } }
            }
        },
        elements: {
            point: { radius: 3, hoverRadius: 6 },
            line: { tension: 0.4, borderWidth: 2 }
        }
    };

    function generateHeartRateData(points) {
        var data = [];
        var base = 72;
        for (var i = 0; i < points; i++) {
            var variation = Math.sin(i * 0.3) * 8 + (Math.random() - 0.5) * 12;
            data.push(Math.round(base + variation));
        }
        return data;
    }

    function generateTimeLabels(count, type) {
        var labels = [];
        if (type === 'day') {
            for (var i = 0; i < count; i++) {
                var h = Math.floor(i * 24 / count);
                labels.push(h + ':00');
            }
        } else if (type === 'week') {
            var days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            for (var i = 0; i < Math.min(count, 7); i++) labels.push(days[i]);
        } else {
            for (var i = 1; i <= count; i++) labels.push(i + '日');
        }
        return labels;
    }

    var heartRateChart;
    var currentPeriod = 'day';

    function createHeartRateChart(period) {
        var ctx = document.getElementById('heartRateChart').getContext('2d');
        var points = period === 'day' ? 24 : period === 'week' ? 7 : 30;
        var data = generateHeartRateData(points);
        var labels = generateTimeLabels(points, period);

        if (heartRateChart) heartRateChart.destroy();

        var gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(0, 212, 170, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 212, 170, 0)');

        heartRateChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    borderColor: '#00D4AA',
                    backgroundColor: gradient,
                    fill: true,
                    pointBackgroundColor: '#00D4AA',
                }]
            },
            options: Object.assign({}, chartOptions, {
                height: 180,
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 8 } },
                    y: { grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } }, min: 50, max: 110 }
                }
            })
        });
    }

    createHeartRateChart('day');

    document.querySelectorAll('.dash-card-header .dash-tab[data-period]').forEach(function (tab) {
        tab.addEventListener('click', function () {
            tab.parentElement.querySelectorAll('.dash-tab').forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            currentPeriod = tab.getAttribute('data-period');
            createHeartRateChart(currentPeriod);
        });
    });

    var bpCtx = document.getElementById('bpChart').getContext('2d');
    var bpData = [];
    var bpLabels = [];
    for (var i = 0; i < 7; i++) {
        bpData.push({ systolic: 115 + Math.round(Math.random() * 15), diastolic: 75 + Math.round(Math.random() * 10) });
        bpLabels.push(['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i]);
    }

    new Chart(bpCtx, {
        type: 'bar',
        data: {
            labels: bpLabels,
            datasets: [
                {
                    label: '收缩压',
                    data: bpData.map(function (d) { return d.systolic; }),
                    backgroundColor: 'rgba(0, 212, 170, 0.6)',
                    borderRadius: 4,
                    barPercentage: 0.6,
                },
                {
                    label: '舒张压',
                    data: bpData.map(function (d) { return d.diastolic; }),
                    backgroundColor: 'rgba(0, 163, 255, 0.6)',
                    borderRadius: 4,
                    barPercentage: 0.6,
                }
            ]
        },
        options: Object.assign({}, chartOptions, {
            plugins: {
                legend: { display: true, position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 }, padding: 16, usePointStyle: true, pointStyle: 'circle' } },
                tooltip: { backgroundColor: 'rgba(26, 32, 53, 0.95)', titleColor: '#f0f4f8', bodyColor: '#94a3b8', borderColor: 'rgba(0, 212, 170, 0.2)', borderWidth: 1, cornerRadius: 8, padding: 12 }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } },
                y: { grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } }, min: 60, max: 150 }
            }
        })
    });

    var sleepCtx = document.getElementById('sleepChart').getContext('2d');
    new Chart(sleepCtx, {
        type: 'doughnut',
        data: {
            labels: ['深睡', '浅睡', 'REM', '清醒'],
            datasets: [{
                data: [2.5, 3.8, 1.2, 0.5],
                backgroundColor: [
                    'rgba(0, 212, 170, 0.8)',
                    'rgba(0, 163, 255, 0.8)',
                    'rgba(138, 92, 246, 0.8)',
                    'rgba(255, 176, 32, 0.5)',
                ],
                borderWidth: 0,
                cutout: '65%',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: 'rgba(26, 32, 53, 0.95)', titleColor: '#f0f4f8', bodyColor: '#94a3b8', borderColor: 'rgba(0, 212, 170, 0.2)', borderWidth: 1, cornerRadius: 8, padding: 12 }
            }
        }
    });

    var exerciseCtx = document.getElementById('exerciseChart').getContext('2d');
    var exerciseData = [6200, 8400, 7800, 9200, 8642, 7300, 8100];
    var exerciseLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    var exerciseGradient = exerciseCtx.createLinearGradient(0, 0, 0, 200);
    exerciseGradient.addColorStop(0, 'rgba(0, 163, 255, 0.3)');
    exerciseGradient.addColorStop(1, 'rgba(0, 163, 255, 0)');

    new Chart(exerciseCtx, {
        type: 'line',
        data: {
            labels: exerciseLabels,
            datasets: [{
                data: exerciseData,
                borderColor: '#00A3FF',
                backgroundColor: exerciseGradient,
                fill: true,
                pointBackgroundColor: '#00A3FF',
            }]
        },
        options: Object.assign({}, chartOptions, {
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } } },
                y: { grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } }, min: 4000 }
            }
        })
    });

    var heartRateValue = document.getElementById('heartRateValue');
    setInterval(function () {
        var current = parseInt(heartRateValue.textContent);
        var next = current + Math.round((Math.random() - 0.5) * 4);
        next = Math.max(60, Math.min(100, next));
        heartRateValue.textContent = next;
    }, 2000);

    var spo2Circle = document.getElementById('spo2Circle');
    var spo2Num = document.querySelector('.spo2-num');
    setInterval(function () {
        var spo2 = 96 + Math.floor(Math.random() * 4);
        spo2Num.textContent = spo2;
        var circumference = 314;
        var offset = circumference * (1 - spo2 / 100);
        spo2Circle.setAttribute('stroke-dashoffset', offset);
    }, 3000);

})();