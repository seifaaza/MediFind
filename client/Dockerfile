# Stage 1: Build the Angular app
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Angular app
RUN npm run build

# Stage 2: Use nginx to serve the app
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy the built app to the nginx server
COPY --from=build /app/dist/medifind-client .

# Expose the port the app will run on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
