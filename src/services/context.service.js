import Chat from "../modules/chat.module.js"

export const buildContext = async (conversationId) => {
  const messages = await Chat.find({ conversation: conversationId })
    .sort({ createdAt: 1 })
    .limit(10); // last 10 messages

  return messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");
};