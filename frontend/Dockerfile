# Use Node 22 to match your backend and local environment
FROM node:22.14.0-alpine3.21

WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Set the environment to development to enable detailed logging and dev-specific features
ENV NODE_ENV=development

# Expose the default Angular CLI port
EXPOSE 4200

# Start Angular dev server
# --host 0.0.0.0 is required to access the app from the browser
# --poll=2000 ensures hot-reload works even on Docker-mounted volumes
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll=2000"]
