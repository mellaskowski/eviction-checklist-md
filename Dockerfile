# Stage 1: Build the Vite application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy the built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy a custom Nginx configuration that listens on the PORT environment variable
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
