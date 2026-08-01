
function toggleSidebar(){
    document.getElementById("sidebar").classList.toggle("show");
}




const items = document.querySelectorAll(".sidebar li");

items.forEach(function(item){

    item.addEventListener("click", function(){

        items.forEach(function(i){

            i.classList.remove("active");

        });

        this.classList.add("active");

    });

});

// ********************** card ********************
// let card = document.getElementById("chart");
// new Chart(card, {
//     type: "line",
//     data: {
//         labels: ["السبت", "الاحد", "الاتنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعه"],
//         datasets: [{
//             data: [15, 20, 18, 30, 25, 35, 28]
//         }]
//     }
// });

const ctx = document.getElementById("chart");

new Chart(ctx, {
  type: "line",
  data: {
    labels: [
      "السبت",
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة"
    ],
    datasets: [{
      label: "عدد الحجوزات",
      data: [6, 6, 0, 1, 1, 1, 1],
      borderColor: "#1378CA",
      backgroundColor: "rgba(19,120,202,.15)",
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }
});
