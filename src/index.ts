
import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { env } from "cloudflare:workers";
import { z } from "zod";

function createServer() {
  const server = new McpServer({
    name: "ISLOM AI HUB",
    version: "1.1.0"
  });

  server.registerTool(
    "islom_hub_status",
    {
      description: "Проверить состояние ISLOM AI HUB",
      inputSchema: {}
    },
    async () => ({
      content: [
        {
          type: "text",
          text: "ISLOM AI HUB работает!"
        }
      ]
    })
  );

  server.registerTool(
    "gemini_chat",
    {
      description: "Отправить запрос искусственному интеллекту Google Gemini",
      inputSchema: {
        prompt: z.string().min(1).max(10000)
      }
    },
    async ({ prompt }) => {
      const apiKey = env.GEMINI_API_KEY;

      if (!apiKey) {
        return {
          content: [{ type: "text", text: "Ошибка: GEMINI_API_KEY не найден." }],
          isError: true
        };
      }

      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }]
                }
              ]
            })
          }
        );

        const data = await response.json() as {
          candidates?: Array<{
            content?: {
              parts?: Array<{ text?: string }>
            }
          }>;
          error?: { message?: string };
        };

        if (!response.ok) {
          return {
            content: [{
              type: "text",
              text: `Ошибка Gemini: ${data.error?.message ?? response.status}`
            }],
            isError: true
          };
        }

        const answer =
          data.candidates?.[0]?.content?.parts
            ?.map(part => part.text ?? "")
            .join("") || "Gemini не вернул текстовый ответ.";

        return {
          content: [{ type: "text", text: answer }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Ошибка соединения: ${String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  return server;
}

const handler = createMcpHandler(createServer);

export default {
  fetch(request, env, ctx) {
    return handler(request, env, ctx);
  }
};
