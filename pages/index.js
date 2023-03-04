import Link from "next/link";
import { useState } from "react";

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
      
      setResult(data.result);
  }

  return (
    <div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={messageinput}
            onChange={(e) => setMessageinput(e.target.value)}
          />
          <input type="submit" value="生成" />
        </form>
        <div>{result}</div>
        <Link href="/chart">散布図ページへ</Link>
    </div>
  );
}
