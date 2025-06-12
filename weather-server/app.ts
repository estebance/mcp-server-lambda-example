import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import serverlessExpress from '@codegenie/serverless-express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
const router = Router();
import MCPWeatherServer from './mcp_server.js';
const APP_ENV = process.env.APP_ENV ? process.env.APP_ENV : "local";

const mcpServer = new MCPWeatherServer();

router.post('/mcp', async (req: Request, res: Response) => {
    try {
        const server = mcpServer.server; 
        // sessionIdGenerator: () => randomUUID(),
        // Possible when we can manage session id
        const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
        });
        res.on('close', () => {
          console.log('Request closed');
          transport.close();
          server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal server error',
            },
            id: null,
          });
        }
      }
});
  
router.get('/mcp', async (req: Request, res: Response) => {
    console.log('Received GET MCP request');
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed."
      },
      id: null
    }));
});

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: '*',
}));
app.use('/', router);

if (APP_ENV === 'local') {
    app.listen(3000, () => {
        console.log(`Example app listening on port 3000`)
    })
}

export const handler = serverlessExpress({ app })