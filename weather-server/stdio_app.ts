import {
  Handler,
  Context,
  APIGatewayProxyWithCognitoAuthorizerEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import {
  APIGatewayProxyEventHandler,
  StdioServerAdapterRequestHandler,
} from "@aws/run-mcp-servers-with-aws-lambda";

const serverParams = {
  command: "node",
  args: [
    "stdio_mcp_server.js"
  ],
}
const requestHandler = new APIGatewayProxyEventHandler(
  new StdioServerAdapterRequestHandler(serverParams)
);

export const handler: Handler = async (
  event: APIGatewayProxyWithCognitoAuthorizerEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  return requestHandler.handle(event, context);
};
