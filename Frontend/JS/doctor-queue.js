async function getAppointments() {
    const response = await fetch("http://localhost:3000/appointments");
    const appointments = await response.json();
    const queueBody = document.getElementById("queueBody");
    queueBody.innerHTML = "";
    const statusMap = {

    waiting: {
        text: "في الانتظار",
        className: "waiting",
    },

    "in-consultation": {
        text: "داخل الكشف",
        className: "consultation",
    },

    completed: {
        text: "تم الكشف",
        className: "completed",
    },

    cancelled: {
        text: "ملغي",
        className: "cancelled",
    },
    };

    appointments.forEach((appointment) => {
    const status = statusMap[appointment.status];
    queueBody.innerHTML +=

        `<tr>
                <td>${appointment.queueNumber}</td>
                <td>${appointment.patientName}</td>
                <td>${appointment.patientPhone}</td>
                <td>${appointment.createdAt}</td>
                <td>
                    <span class="status ${status.className}">
                        ${status.text}
                    </span>
                </td>

                <td>
                    <button class="icon-btn">
                        <a href="https://www.google.com/" target="_blank">
                            <i class="fa-solid fa-eye"></i>
                        </a>
                    </button>

                    <button class="icon-btn">
                        <a href="tel:${appointment.patientPhone}">
                            <i class="fa-solid fa-phone"></i>
                        </a>
                    </button>

                    <button class="icon-btn" onclick="completeAppointment('${appointment.id}')">
                            <i class="fa-solid fa-check"></i>
                    </button>
                </td>
            </tr>`;
    });
}

getAppointments();


async function completeAppointment(id) {
    await fetch(`http://localhost:3000/appointments/${id}`, {

    method: "PATCH",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        status: "completed"
    })

});

getAppointments();
}

const refreshBtn = document.getElementById("refreshBtn");
refreshBtn.addEventListener("click", () => {
    getAppointments();
});




/*/////////////////////////////////////////////////////////////////////*/ 


const modal = document.getElementById("addPatientModal");
const pageContent = document.getElementById("pageContent");
const addPatientBtn = document.getElementById("addPatientBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const patientForm = document.getElementById("patientForm");


addPatientBtn.addEventListener("click", () => {    modal.style.display = "flex";
    pageContent.classList.add("blur");
});


function closePatientModal() {
    modal.style.display = "none";
    pageContent.classList.remove("blur");
}


closeModal.addEventListener("click", closePatientModal);
cancelBtn.addEventListener("click", closePatientModal);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closePatientModal();
    }
});

patientForm.addEventListener("submit", addPatient);

async function addPatient(e) {
    e.preventDefault();
    const patientName = document.getElementById("patientName").value;
    const patientPhone = document.getElementById("patientPhone").value;
    const appointmentDate = document.getElementById("appointmentDate").value;
    const appointmentTime = document.getElementById("appointmentTime").value;
    const usersResponse = await fetch("http://localhost:3000/users");
    const users = await usersResponse.json();
    const appointmentsResponse = await fetch("http://localhost:3000/appointments");
    const appointments = await appointmentsResponse.json();
    const newUserId = "u" + (users.length + 1);
    const newAppointmentId = "app" + (101 + appointments.length);

    await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            id: newUserId,
            name: patientName,
            phone: patientPhone,
            role: "patient",
            createdAt: new Date().toISOString()
        })
    });


    await fetch("http://localhost:3000/appointments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: newAppointmentId,
            patientId: newUserId,
            patientName: patientName,
            patientPhone: patientPhone,
            date: appointmentDate,
            queueNumber: appointments.length + 1,
            status: "waiting",
            bookingType: "walk-in",
            amountPaid: 300,
            createdAt: `${appointmentDate} ${appointmentTime}`
        })

    });

    patientForm.reset();
    closePatientModal();
    getAppointments();
}


