import { useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useAuth } from "../components/authProvider.js";
import { getDatabase } from "../components/notionProvider.js";
import { useRouter } from "next/router";
import Link from "next/link";
import { Text } from "./[id].js";

Chart.register(...registerables);

export const databaseId = process.env.NOTION_DB_ID;

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

export default function Home({ posts }) {
  const [messageinput, setMessageinput] = useState("");
  const [createinput, createMessageinput] = useState("");
  const [result, setResult] = useState();
  const [all_token, setAlltoken] = useState();
  const [prompt_token, setPrompttoken] = useState();
  const [completion_token, setCompletiontoken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { session, logout } = useAuth();
  const router = useRouter();

  posts = posts.filter(post => post.properties.Email.email === session.user.email);

  const onLogout = () => {
    logout().then(() => router.push("/login"));
  };

  async function onSubmit(event) {
    setIsLoading(true);
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: messageinput }),
    });

    const data = await response.json();
    setIsLoading(false);

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

  async function onCreate(event) {
    setIsLoading(true);
    event.preventDefault();
    await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ json: createinput,email: session.user.email }),
    });
    setIsLoading(false);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <p>ログイン中メールアドレス：{session.user.email}</p>
        <h2>生成できた文言</h2>
        <p>
          ・labelがmomo1のJSONデータを出してください。なお、xとyの値は1~10のいずれかの数値でお願いします
        </p>
        <p>
          ・labelがmomo1とmomo2のJSONデータを出してください。なお、xとyの値は1~10のいずれかの数値でお願いします
        </p>
        <p>
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
      <form onSubmit={onCreate}>
        <input
          type="text"
          style={{ width: "1000px", height: "24px" }}
          value={createinput}
          onChange={(e) => createMessageinput(e.target.value)}
        />
        <input type="submit" value="生成" />
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : result ? (
        <div style={styles.chartContainer}>
          <Scatter data={result} options={options} />
          <h3>今回の利用トークン数</h3>
          <p>入力：{prompt_token}</p>
          <p>出力：{completion_token}</p>
          <p>合計：{all_token}</p>
        </div>
      ) : null}
      <form onSubmit={onLogout}>
        <button type="submit">logout</button>
      </form>
      <h2>履歴</h2>
      <ol>
        {posts.map((post) => {
          const date = new Date(post.last_edited_time).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });
          return (
            <li key={post.id}>
              <h4>
                <Link href={`/${post.id}`}>
                  <Text text={post.properties.Name.title} />
                </Link>
              </h4>
              <p>作成日時：{date}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);

  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  };
};
