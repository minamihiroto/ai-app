import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// グラフのオプションを設定する
const options = {
  maintainAspectRatio: false,
    plugins: {
      legend: {
        position:"bottom",
      },
    },
  scales: {
    xAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "X-axis Label",
        },
      },
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Y-axis Label",
        },
      },
    ],
  },
};


// x軸とy軸のデータを定義する
const data = {
  datasets: [
    { label: "point1", data: [{ x: 3, y: 1 }] },
    { label: "point2", data: [{ x: 2, y: 4 }] },
    { label: "point3", data: [{ x: 5, y: 2 }] },
    { label: "point4", data: [{ x: 1, y: 6 }] },
    { label: "point5", data: [{ x: 7, y: 8 }] },
    { label: "point6", data: [{ x: 9, y: 3 }] },
    { label: "point7", data: [{ x: 6, y: 5 }] },
    { label: "point8", data: [{ x: 8, y: 7 }] },
    { label: "point9", data: [{ x: 4, y: 9 }] },
    { label: "point10", data: [{ x: 10, y: 2 }], backgroundColor: "red" },
    { label: "point11", data: [{ x: 12, y: 9 }] },
    { label: "point12", data: [{ x: 15, y: 5 }] },
    { label: "point13", data: [{ x: 17, y: 4 }] },
    { label: "point14", data: [{ x: 18, y: 8 }] },
    { label: "point15", data: [{ x: 21, y: 3 }] },
    { label: "point16", data: [{ x: 22, y: 6 }] },
    { label: "point17", data: [{ x: 24, y: 7 }] },
    { label: "point18", data: [{ x: 27, y: 2 }] },
    { label: "point19", data: [{ x: 29, y: 6 }] },
    { label: "point20", data: [{ x: 30, y: 8 }] },
  ],
};

const styles = {
  chartContainer: {
    width: "80%",
    
  },
};

export default function Home() {
  return (
    <div style={styles.chartContainer}>
      <Scatter data={data} options={options} />
    </div>
  );
}
