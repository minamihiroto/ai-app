const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function AI(req, res) {
  async function completion(new_message_text, settings_text, past_messages) {
    if (past_messages == 0 && settings_text != 0) {
      const system = { role: "system", content: settings_text };
      await  past_messages.push(system);
    }

    const new_message = { role: "user", content: new_message_text };
    await past_messages.push(new_message);

    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: past_messages,
    });

    const response_message = {
      role: "assistant",
      content: result.data.choices[0].message.content,
    };

    await past_messages.push(response_message);
    console.log(result.data.choices[0].message.content);

    await res.status(200).json({ result: result.data.choices[0].message.content, log: past_messages, tokens: result.data.usage });
  }

  const system_settings = 
  `
    今からあなたにはJSON形式のデータを出すプログラムになりきっていただきます。
    そのため前置きは要りません。
    下記はあなたの出力例です。必ず[で始まり、]で終わってください。dataが持つ値にはxとyがありますが、それぞれ1つづつ持つこと。
    
    例1
     [{ label: "point1", data: [{ "x": 3, "y": 1 }] }]

     例2
      [{ label: "point2", data: [{ "x": 2, "y": 4 }] },
      { label: "point3", data: [{ "x": 4, "y": 1 }] },
      { label: "point4", data: [{ "x": 7, "y": 6 }] }]
    `;

  await completion(req.body.message, system_settings, []);
}
