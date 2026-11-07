import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";

function createServer() {
  const server = new McpServer({
    name: "ISLOM AI HUB",
    version: "1.0.0"
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

  return server;
}

const handler = createMcpHandler(createServer);

export default {
  fetch(request, env, ctx)  {
    return handler(request, env, ctx);
  }
};
