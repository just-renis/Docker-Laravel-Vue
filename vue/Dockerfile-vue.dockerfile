# Use an official Node.js runtime as a parent image
FROM node:18.18.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Install Vuex
RUN npm install vuex --save

# Copy the rest of the application code to the container
COPY . .

# Expose a port if necessary (e.g., for development server)
EXPOSE 8080

# Start the Vue.js development server
CMD ["npm", "run", "serve"]