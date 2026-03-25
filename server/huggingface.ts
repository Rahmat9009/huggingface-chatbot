import { invokeLLM } from "./_core/llm";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Generate a chat response using HuggingFace Transformers via the LLM API
 * Maintains conversation context by including message history
 */
export async function generateChatResponse(
  messages: ChatMessage[]
): Promise<string> {
  try {
    // Prepare messages for the LLM API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add system prompt to guide the assistant
    const systemMessage = {
      role: "system" as const,
      content:
        "You are a helpful, friendly, and knowledgeable AI assistant. Provide clear, concise, and accurate responses. Use markdown formatting when appropriate to make your responses more readable.",
    };

    // Call the LLM API
    const response = await invokeLLM({
      messages: [systemMessage, ...formattedMessages],
    });

    // Extract the response text
    const content = response.choices?.[0]?.message?.content;
    const assistantMessage =
      typeof content === "string" ? content : "I couldn't generate a response.";

    return assistantMessage;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error("Failed to generate response from AI model");
  }
}
