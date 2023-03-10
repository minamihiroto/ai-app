import Link from "next/link";
import { databaseId } from "./index.js";
import { getDatabase, getPage } from "../components/notionProvider.js";

export const Text = ({ text }) => {
  return text.map((value, index) => {
    const { text } = value;
    return (
      <span key={index}>
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    );
  });
};

export default function Post({ page }) {
  return (
    <div>
      <h1>
        <Text text={page.properties.Name.title} />
      </h1>
      <section>
        <Link href="/">← Go home</Link>
      </section>
    </div>
  );
}

export const getStaticPaths = async () => {
  const database = await getDatabase(databaseId);
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const page = await getPage(id);

  return {
    props: {
      page,
    },
    revalidate: 1,
  };
};
