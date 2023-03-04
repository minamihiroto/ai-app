import { useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// グラフのオプションを設定する
const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

const styles = {
  chartContainer: {
    width: "500px",
    height: "500px",
  },
};

export default function Home() {
  const [messageinput, setMessageinput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: messageinput }),
    });

    //一応data.logにログが返ってきてる
    const data = await response.json();

    //ここでJSONに直す
    const jsonObject = JSON.parse(data.result);
    const dataset = [jsonObject];
    const result = {
      datasets: dataset,
    };

    setResult(result);
  }

  if (result == null) {
    return (
      <form onSubmit={onSubmit}>
        <h3>生成できた文言</h3>
        <p>
          ・labelがmomo1のJSONデータを出してください。なお、xとyの値は1~10のいずれかの数値でお願いします
        </p>
        <input
          type="text"
          style={{ width: "1000px", height: "24px" }}
          value={messageinput}
          onChange={(e) => setMessageinput(e.target.value)}
        />
        <input type="submit" value="生成" />
      </form>
    );
  } else {
    return (
      <div>
        <form onSubmit={onSubmit}>
          <h3>生成できた文言</h3>
          <p>
            ・labelがmomo1のJSONデータを出してください。なお、xとyの値は1~10のいずれかの数値でお願いします
          </p>
          <input
            type="text"
            style={{ width: "1000px", height: "24px" }}
            value={messageinput}
            onChange={(e) => setMessageinput(e.target.value)}
          />
          <input type="submit" value="生成" />
        </form>
        <div style={styles.chartContainer}>
          <Scatter data={result} options={options} />
        </div>
      </div>
    );
  }
}
