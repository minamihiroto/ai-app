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
  const [all_token, setAlltoken] = useState();
  const [prompt_token, setPrompttoken] = useState();
  const [completion_token, setCompletiontoken] = useState();

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

    const regex = /\[.*\]/s;

    const jsonStr = data.result.match(regex);
    const jsonObject = JSON.parse(jsonStr);
    const jsonResult = {
      datasets: jsonObject,
    };

    setResult(jsonResult);
    setAlltoken(data.tokens.total_tokens);
    setPrompttoken(data.tokens.prompt_tokens);
    setCompletiontoken(data.tokens.completion_tokens);
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
          <h3>今回の利用トークン数</h3>
          <p>入力：{prompt_token}</p>
          <p>出力：{completion_token}</p>
          <p>合計：{all_token}</p>
        </div>
      )}
    </div>
  );
}
