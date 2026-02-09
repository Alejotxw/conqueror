const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

router.post('/analyze', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "Eres un analista de inteligencia. Crea un perfil detallado de la persona basado en el texto proporcionado. Devuelve un informe profesional." },
        { role: "user", content: text }
      ],
      model: "deepseek-chat",
    });

    res.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar con DeepSeek" });
  }
});

module.exports = router;