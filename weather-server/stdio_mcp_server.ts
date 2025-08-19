import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import {
  StdioServerTransport
} from "@modelcontextprotocol/sdk/server/stdio.js";

class StdIoMCPWeatherServer {
    public server: Server;

    constructor() {
      this.server = new Server(
        {
          name: 'weather-mcp-server',
          version: '1.0.0',
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );
      this.setupHandlers();
    }

    private setupHandlers() {
      // List available tools
      this.server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
          tools: [
            {
              name: 'echo',
              description: 'Echo back the input text',
              inputSchema: {
                type: 'object',
                properties: {
                  text: {
                    type: 'string',
                    description: 'Text to echo back',
                  },
                },
                required: ['text'],
              },
            },
            {
              name: 'get_current_time',
              description: 'Get the current timestamp',
              inputSchema: {
                type: 'object',
                properties: {},
              },
            },
            {
              name: 'lambda_info',
              description: 'Get information about the Lambda environment',
              inputSchema: {
                type: 'object',
                properties: {},
              },
            },
          ],
        };
      });

      // Handle tool calls
      this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        switch (name) {
          case 'echo':
            return {
              content: [
                {
                  type: 'text',
                  text: `Echo: ${args?.text ?? ''}`,
                },
              ],
            };

          case 'get_current_time':
            return {
              content: [
                {
                  type: 'text',
                  text: `Current time: ${new Date().toISOString()}`,
                },
              ],
            };

          case 'lambda_info':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    runtime: process.version,
                    platform: process.platform,
                    memory: process.memoryUsage(),
                    environment: process.env.AWS_REGION || 'unknown',
                  }, null, 2),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      });
    }

}

const server = new StdIoMCPWeatherServer();
const transport = new StdioServerTransport();
await server.server.connect(transport);
