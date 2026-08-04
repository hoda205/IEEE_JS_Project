const draftKey = "consultationDraft";


export function getAppointmentId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("appointmentId");
}


export async function createEmptyDraft() {

  const appointmentId = getAppointmentId();

  let patientId = null;
  let doctorId = null;


  if (appointmentId) {

    const response = await fetch(
      "http://localhost:3000/appointments"
    );


    const appointments = await response.json();


    const appointment = appointments.find(
      (app) => String(app.id) === String(appointmentId)
    );


    if (appointment) {

      patientId = appointment.patientId;

      doctorId = appointment.doctorId;

    }

  }


  return {

    appointmentId,

    patientId,

    doctorId,

    diagnosis: "",

    notes: "",

    medicines: [],

    dietPlan: null,

    requestedLabTests: []

  };

}



export async function getDraft() {

  const data = localStorage.getItem(draftKey);


  if (!data) {

    return await createEmptyDraft();

  }


  const draft = JSON.parse(data);



  if (draft.appointmentId !== getAppointmentId()) {

    localStorage.removeItem(draftKey);

    return await createEmptyDraft();

  }


  return draft;

}



export async function updateDraft(key, value) {

  const draft = await getDraft();


  draft[key] = value;


  localStorage.setItem(
    draftKey,
    JSON.stringify(draft)
  );

}



export function clearDraft() {

  localStorage.removeItem(draftKey);

}