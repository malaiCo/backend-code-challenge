FROM node:latest

RUN mkdir -p /app
WORKDIR /app

# Copy package node configuration file
COPY package.json /app
COPY package-lock.json /app

# Install npm packages
RUN npm install

# Add all code to the app
COPY service/. /app

# Expose port number
EXPOSE 8080

# Run server
CMD ["npm", "start"]