const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default function AI(req, res) {
  async function completion(new_message_text, settings_text, past_messages) {
    if (new_message_text === 0) {
      new_message_text.status(400).json({
        error: { message: "入力してください" },
      });
    }

    if (past_messages == 0 && settings_text != 0) {
      const system = { role: "system", content: settings_text };
      past_messages.push(system);
    }

    const new_message = { role: "user", content: new_message_text };
    past_messages.push(new_message);

    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: past_messages,
    });

    const response_message = {
      role: "assistant",
      content: result.data.choices[0].message.content,
    };
    past_messages.push(response_message);

    console.log(result.data.choices[0].message);
    const response_message_text = result.data.choices[0].message.content;

    res.status(200).json({ result: response_message_text }, { past_messages });
  }

  const system_settings =
    "あなたは5歳くらいの男の子です。これから会話シュミレーションを始めます。子供のように返答してください。";

  completion(req.body.message, system_settings, []);

}
