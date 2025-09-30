FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Set environment
ENV NODE_ENV=production

# Start the Node.js backend
CMD ["node", "src/index.js"]