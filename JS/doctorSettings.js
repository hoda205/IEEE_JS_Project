document.addEventListener('DOMContentLoaded', function() {
    fetch('doctor.json')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('workplace-tbody');
            
            tbody.innerHTML = '';

            data.clinic_locations.forEach(clinic => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${clinic.location_name}</td>
                    <td>${clinic.address}</td>
                    <td><span class="badge-day">مواعيد العيادة</span></td>
                    <td><i class="fa-solid fa-trash delete-row-btn"></i></td>
                `;

                tr.querySelector('.delete-row-btn').addEventListener('click', function() {
                    tr.remove();
                });

                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('خطأ في تحميل ملف الـ JSON:', error));
});

document.getElementById('add-place-btn').addEventListener('click', function() {

    const placeName = document.getElementById('place-name').value;
    const placeAddress = document.getElementById('place-address').value;
    const placeDay = document.getElementById('place-day').value;
    const startTime = document.getElementById('place-start').value;
    const endTime = document.getElementById('place-end').value;

    if (placeName === '' || placeAddress === '' || startTime === '' || endTime === '') {
        alert('برجاء ملء جميع الحقول!');
        return;
    }

    const tbody = document.getElementById('workplace-tbody');
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${placeName}</td>
        <td>${placeAddress}</td>
        <td><span class="badge-day">${placeDay} (${startTime} - ${endTime})</span></td>
        <td><i class="fa-solid fa-trash delete-row-btn"></i></td>
    `;

    tr.querySelector('.delete-row-btn').addEventListener('click', function() {
        tr.remove();
    });

    tbody.appendChild(tr);

    document.getElementById('place-name').value = '';
    document.getElementById('place-address').value = '';
    document.getElementById('place-start').value = '09:00';
    document.getElementById('place-end').value = '21:00';
});

document.getElementById('booking-toggle').addEventListener('change', function(e) {
    if (e.target.checked) {
        alert('تم فتح باب الحجز للمرضى بنجاح!');
    } else {
        alert('تم إغلاق باب الحجز مؤقتاً!');
    }
});