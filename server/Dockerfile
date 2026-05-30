# Production Dockerfile
FROM node:18-alpine

# Set environment to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source
COPY . .

# Change ownership to non-root user
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose port
EXPOSE 4000

# Start script
CMD ["sh", "-c", "if [ \"$RUN_SEED\" = \"true\" ]; then node ./db/seed.js || exit 1; fi && node server.js"]