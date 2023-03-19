import { getDatabase } from "../../components/notionProvider";

const databaseId = process.env.NOTION_DB_ID;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const userEmail = req.body.email;
  const database = await getDatabase(databaseId);
  const filteredPosts = database.filter(
    (posts) => posts.properties.Email.email === userEmail
  );

  res.status(200).json(filteredPosts);
}
