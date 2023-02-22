import { useState } from "react";

export default function Home() {
  const [messageinput, setMessageinput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageinput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setMessageinput("");
    } catch(error) {

      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
        <form onSubmit={onSubmit}>
          <h3>AI婆さんの相談室</h3>
          <input
            type="text"
            value={messageinput}
            onChange={(e) => setMessageinput(e.target.value)}
          />
          <input type="submit" value="生成" />
        </form>
        <div>{result}</div>
    </div>
  );
}
