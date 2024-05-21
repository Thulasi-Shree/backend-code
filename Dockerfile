# Start with a base image that includes Node.js
FROM node:18-alpine

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Rebuild bcrypt module
RUN npm rebuild bcrypt --build-from-source

# Expose the port your app runs on
EXPOSE 8000

# Command to run your application
CMD [ "npm", "start" ]
