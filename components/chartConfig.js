import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const options = {
  responsive: true,
  scales: {
    y: {
      suggestedMin: -10,
      suggestedMax: 10,
      position: "center",
      title: {
        color: "black",
        align: "center",
        display: true,
        text: "y軸のタイトル",
        minRotation: 90,
        font: {
          size: 16,
        },
      },
    },
    x: {
      suggestedMin: -10,
      suggestedMax: 10,
      position: "center",
      title: {
        color: "black",
        align: "start",
        display: true,
        text: "x軸のタイトル",
        font: {
          size: 16,
        },
      },
    },
  },
  maintainAspectRatio: false,
  elements: {
    point: {
      backgroundColor: "#FF0000",
      radius: 8,
    },
  },
  plugins: {
    legend: false,
  },
};

export default options;
