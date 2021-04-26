const stationURL = "https://api.meteostat.net/v2/stations/search";
const dataURL = "https://api.meteostat.net/v2/stations/daily";

window.onload = function () {
  const ctx = document.getElementById("myChart").getContext("2d");
  document.getElementById ("graphButton").addEventListener ("click", getData, false);

  let myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "",
          data: [],
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
      borderWidth: 1,
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [
          {
            ticks: {
              maxTicksLimit: 10,
            },
            scaleLabel: {
              display: true,
              labelString: "Dates",
              padding: 20,
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Temperature in Celsius",
              padding: 20,
            },
          },
        ],
      },
    },
  });

  function updateChart(inputData, cityName) {
    const newData = {
      label: `Average temperature in ${cityName}`,
      data: inputData.yTemps,
      fill: false,
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    };
    console.log(myChart.data);
    myChart.data.datasets[0] = newData;
    myChart.data.labels = inputData.xDates;
    myChart.update();
  }

  async function getData() {
    const city = document.getElementById("city").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    if (!(city && startDate && endDate)) {
      alert("Please input all data.");
      return;
    }
    let url = new URL(stationURL);
    url.search = new URLSearchParams({
      query: city,
    });
    let promise = await fetch(url, {
      headers: {
        "x-api-key": "Y0OpHQRYuQvebjNuLf1WGMMlLkGnYbND",
      },
    });
    let data = await promise.json();
    if (!data.data) {
      alert("No data available for the city.");
      return;
    }
    console.log(data);
    const stationID = data.data[0].id;
    console.log(startDate);
    console.log(endDate);
    const graphData = await retrieveData(stationID, startDate, endDate);
    if (!graphData) return;
    updateChart(graphData, city);
  }

  async function retrieveData(id, start, end) {
    const xDates = [];
    const yTemps = [];

    let url = new URL(dataURL);
    url.search = new URLSearchParams({
      station: id,
      start: start,
      end: end,
    });

    let promise = await fetch(url, {
      headers: {
        "x-api-key": "Y0OpHQRYuQvebjNuLf1WGMMlLkGnYbND",
      },
    });
    let data = await promise.json();

    if (data.data && data.data[0].tavg) {
      for (day of data.data) {
        xDates.push(day.date);
        yTemps.push(day.tavg);
      }
      return { xDates, yTemps };
    } else {
      alert("No data available for this city.");
      return false;
    }
  }
};
