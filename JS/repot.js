const barCtx = document.getElementById('myBarChart').getContext('2d');
new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: ['الجمعة', 'السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        datasets: [{
            data: [35, 48, 55, 50, 52, 42, 68],
            backgroundColor: '#6366f1',
            borderRadius: 4,
            barThickness: 18
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { display: false },
            x: { grid: { display: false } }
        }
    }
});

const doughnutCtx = document.getElementById('myDoughnutChart').getContext('2d');
new Chart(doughnutCtx, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [76, 17, 7],
            backgroundColor: ['#4f46e5', '#16a34a', '#dc2626'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        cutout: '70%'
    }
});