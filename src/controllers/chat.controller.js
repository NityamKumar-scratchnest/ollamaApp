import Chat from "../modules/chat.module.js";
import Conversation from "../modules/conversation.model.js"
import { generateResponse } from "../services/ollama.service.js";
import { buildContext } from "../services/context.service.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ msg: "Message required" });
    }

    let convoId = conversationId;

    // create conversation
    if (!convoId) {
      const convo = await Conversation.create({
        user: req.user.id,
        title: message.slice(0, 30),
      });
      convoId = convo._id;
    }

    // build limited context (IMPORTANT)
    const context = await buildContext(convoId);

    const finalPrompt = `
You are a helpful AI assistant.

${context}

user: ${message}
assistant:
`;

    const reply = await generateResponse(finalPrompt);

    // save user message
    await Chat.create({
      conversation: convoId,
      role: "user",
      content: message,
    });

    // save AI reply
    await Chat.create({
      conversation: convoId,
      role: "assistant",
      content: reply,
    });

    res.json({
      reply,
      conversationId: convoId,
    });

  } catch (err) {
    console.error("CHAT ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};