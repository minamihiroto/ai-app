import { Client } from "@notionhq/client";

const notion = new Client({ auth: `${process.env.NOTION_API_KEY}` });

export default async function handler(req, res) {
  async function completion(json, email) {
      const entry = {
        parent: {
          database_id: `${process.env.NOTION_DB_ID}`,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: json,
                },
              },
            ],
          },
          Email: {
            email: email,
          },
          IdeaJson: {
            rich_text: [
              {
                text: {
                  content: "testtest1",
                  link: null,
                },
                plain_text: json,
              },
            ],
          },
          ScatterJson: {
            rich_text: [
              {
                text: {
                  content: "testtest2",
                  link: null,
                },
                plain_text: json,
              },
            ],
          },
        },
      };
      const response = await notion.pages.create(entry);
      res.status(200).json(response);
  }
  await completion(req.body.json, req.body.email);
}
