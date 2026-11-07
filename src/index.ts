import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "ISLOM AI HUB",
    version: "1.0.0",
  });

  async init() {
    this.server.tool(
      "islom_hub_status",
      "Проверить состояние ISLOM AI HUB",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: "ISLOM AI HUB работает!",
          },
        ],
      })
    );
  }
}

export default {
  fetch: MyMCP.serve("/mcp"),
};
