FROM node:22.14.0-alpine3.21

WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Set the environment to development to enable detailed logging and dev-specific features
ENV NODE_ENV=development

# Expose the default serverless-offline port
EXPOSE 3000

# Start the serverless offline server
CMD ["npm", "run", "offline", "--", "start", "--host", "0.0.0.0", "--httpPort", "3000"]
