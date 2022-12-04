# Use an official Node.js runtime as a base image
FROM node:12

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the code to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000


# Run the app when the container is started
CMD ["npm","run","dev"]
