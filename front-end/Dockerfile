# Use Node.js for building the Angular SSR app
FROM node:18 as builder

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build the Angular SSR app
COPY . .
RUN npm run build:ssr

# Use a minimal Node.js image to run the SSR server
FROM node:18-alpine as server

# Set the working directory
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app/dist /app/dist
COPY package*.json ./
# # Install serve to serve the SSR app
# RUN npm install -g serve

# Expose the SSR server port
EXPOSE 4000

# Command to run the SSR server
CMD ["npm", "run", "serve:ssr"]