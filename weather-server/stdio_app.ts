import {
  Handler
} from "aws-lambda";
import {
  StdioServerAdapterRequestHandler,
  LambdaFunctionURLEventHandler
} from "@aws/run-mcp-servers-with-aws-lambda";

const serverParams = {
  command: "node",
  args: [
    "stdio_mcp_server.js"
  ],
}
const requestHandler = new LambdaFunctionURLEventHandler(
  new StdioServerAdapterRequestHandler(serverParams)
);

export const handler: Handler = async (event, context) => {
  return requestHandler.handle(event, context);
};
