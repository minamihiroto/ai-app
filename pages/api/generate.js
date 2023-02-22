import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function myFunction (req, res) {

  //もし取得した値が空の文字列またはスペースだけの場合にはじく
  const animal = req.body.message || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "相談事を入力してください",
      }
    });
    return;
  }

  try {
    //生成されたプロンプトに基づいてテキスト生成を試みます
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.7,
      max_tokens: 200,
    });
    //生成されたテキストの1つの選択肢を含むJSONレスポンスが返される
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    //エラー
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`OpenAI API リクエストエラー: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'リクエスト中にエラーが発生しました.',
        }
      });
    }
  }
}

//APIに渡すプロンプトを作成
function generatePrompt(animal) {
    return `あなたはよくいるお婆さんです。おばあさんの口調で下記の相談に答えてください。タメ口でお願いします。\n${animal}`;
}
