import React, { useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const options = {
  scales: {
    y: {
      suggestedMin: 0,
      suggestedMax: 10,
    },
    x: {
      suggestedMin: 0,
      suggestedMax: 10,
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

const styles = {
  chartContainer: {
    width: "600px",
    height: "600px",
  },
};

export default function Chartpage() {
  const [messageInput, setMessageInput] = useState("");
  const [scatterData, setScatterData] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    const regex = /\[.*\]/s;

    const jsonStr = messageInput.match(regex);
    const jsonObject = JSON.parse(jsonStr);
    const jsonResult = {
      datasets: jsonObject,
    };

    setScatterData(jsonResult);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <p></p>
        <textarea
          type="text"
          style={{ width: "1000px", height: "300px" }}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <input type="submit" value="生成" />
      </form>
      {scatterData && (
        <div style={{ width: "1000px", height: "500px" }}>
          <Scatter data={scatterData} options={options} />
        </div>
      )}
    </div>
  );
}
