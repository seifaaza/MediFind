# Use the official Node.js image as a parent image
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Angular app source code
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# Use a lightweight web server to serve the built app (nginx)
FROM nginx:alpine

# Copy the Angular build output from the build stage to the nginx server
COPY --from=build /app/dist/medifind-client /usr/share/nginx/html

# Expose the port the Angular app will run on
EXPOSE 80

# Start nginx to serve the Angular app
CMD ["nginx", "-g", "daemon off;"]
