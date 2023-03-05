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
    const regex = /\[.*\]/s; // 正規表現でJSONの配列文字列だけを取得
    const jsonStr = data.result.match(regex);
    const jsonObject = JSON.parse(jsonStr);
    console.log(jsonObject);
    const result = {
      datasets: jsonObject,
    };

    setResult(result);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3>生成できた文言</h3>
        <p>
          ・labelがmomo1のJSONデータを出してください。なお、xとyの値は1~10のいずれかの数値でお願いします
          ・labelがmomo1とmomo2のJSONデータを出してください。なお、xとyの値は1~10のいずれかの数値でお願いします
          ・labelがmomo1とmomo2とmomo3とmomo4とmomo5とmomo6とmomo7とmomo8とmomo9とmomo10とmomo11とmomo12とmomo13とmomo14とmomo15とmomo16とmomo17とmomo18とmomo19とmomo20のJSONデータを出してください。なお、xとyの値は1~10のいずれかの数値でお願いします
        </p>
        <input
          type="text"
          style={{ width: "1000px", height: "24px" }}
          value={messageinput}
          onChange={(e) => setMessageinput(e.target.value)}
        />
        <input type="submit" value="生成" />
      </form>
      {result && (
        <div style={styles.chartContainer}>
          <Scatter data={result} options={options} />
        </div>
      )}
    </div>
  );
}
