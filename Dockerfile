# Use official Node.js image
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Expose the port your app runs on (Cloud Run defaults to 8080)
EXPOSE 8080

# Command to start your application
CMD [ "npm run dev" ]
