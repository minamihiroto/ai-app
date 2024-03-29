import { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { useAuth } from "../components/authProvider.js";
import { useRouter } from "next/router";
import options from "../components/chartConfig.js";
import HistoryList from "../components/historyList";
import NotionCreateForm from "../components/notionCreateForm";

export const databaseId = process.env.NOTION_DB_ID;

export default function Home() {
  const [messageinput, setMessageinput] = useState("");
  const [createinput, createMessageinput] = useState("");
  const [result, setResult] = useState();
  const [res, setRes] = useState();
  const [error, setError] = useState();
  const [all_token, setAlltoken] = useState();
  const [prompt_token, setPrompttoken] = useState();
  const [completion_token, setCompletiontoken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { session, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch("/api/notionFilter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await response.json();
      setPosts(data);
    }
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  const onLogout = async () => {
    await logout().then(() => router.push("/login"));
  };

  async function onSubmit(event) {
    try {
      setIsLoading(true);
      event.preventDefault();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setError("Request timed out. Please try again later.");
      }, 12000);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageinput }),
        signal: controller.signal,
      });

      const data = await response.json();
      setIsLoading(false);
      clearTimeout(timeoutId);

      if (data.error) {
        setError(data.error);
      } else {
        const regex = /\[.*\]/s;
        const res = data.result;
        const jsonStr = data.result.match(regex);
        const jsonObject = JSON.parse(jsonStr);
        const jsonResult = {
          datasets: jsonObject,
        };

        setRes(res);
        setResult(jsonResult);
        setAlltoken(data.tokens.total_tokens);
        setPrompttoken(data.tokens.prompt_tokens);
        setCompletiontoken(data.tokens.completion_tokens);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  }

  async function onCreate(event) {
    setIsLoading(true);
    event.preventDefault();
    await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ json: createinput, email: session.user.email }),
    });
    setIsLoading(false);
  }

  return (
    <div>
      <p>ログイン中メールアドレス：{session.user.email}</p>
      <form onSubmit={onLogout}>
        <button type="submit">logout</button>
      </form>
      <NotionCreateForm
        createMessageinput={createMessageinput}
        createinput={createinput}
        onCreate={onCreate}
      />
      <HistoryList posts={posts} />
      <form onSubmit={onSubmit}>
        <h2>GPT API</h2>
        <input
          type="text"
          style={{ width: "1000px", height: "24px" }}
          value={messageinput}
          onChange={(e) => setMessageinput(e.target.value)}
        />
        <input type="submit" value="生成" />
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <div>
          <p>エラー: {error}</p>
        </div>
      ) : result ? (
        <div style={{ width: "600px", height: "600px" }}>
          <p>レスポンス{res}</p>
          <Scatter data={result} options={options} />
          <h3>今回の利用トークン数</h3>
          <p>入力：{prompt_token}</p>
          <p>出力：{completion_token}</p>
          <p>合計：{all_token}</p>
        </div>
      ) : null}
    </div>
  );
}
