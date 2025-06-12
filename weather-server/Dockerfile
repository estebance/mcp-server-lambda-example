# Use the official AWS Lambda Node.js runtime as base image
FROM public.ecr.aws/lambda/nodejs:22

# Set the working directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy TypeScript source files
COPY app.ts ./app.ts
COPY mcp_server.ts ./mcp_server.ts
COPY tsconfig.json ./

# Install TypeScript and build dependencies
RUN npm install -g typescript
RUN npm install --save-dev @types/node @types/aws-lambda

# Transpile TypeScript to JavaScript
RUN npm run build

# Copy the compiled JavaScript files to the Lambda task root
RUN cp -r dist/* ./

RUN ls
# Set the CMD to your handler
CMD [ "app.handler" ]