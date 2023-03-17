import Link from "next/link";
import { Text } from "../pages/[id].js";

function HistoryList({ posts }) {
  return (
    <div>
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

export default HistoryList;
