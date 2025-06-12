# mcp-server-lambda-template 

API Gateway / Lambda / MCP server 

## Dependencies 

[NodeJs22.11.0-LTS](https://nodejs.org/es/blog/release/v22.11.0)
[@codegenie/serverless-express](https://github.com/CodeGenieApp/serverless-express)
[@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)

# Run locally 

Go to the lambda function code `weather-server`
```
npm install
```

Then build your app 

```
npm run buld
```

Finally, go to the dist folder and run
```
cd dist 
node app.js 
```

# Build 

```
sam build --use-container --config-env <your_config_env_sam> --debug
```

# Test locally 

```
sam local start-api --port 8000 --profile <your_aws_profile>
```
