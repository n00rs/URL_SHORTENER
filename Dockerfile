# Use the Node.js version 22 image as the base image
FROM node:22

WORKDIR /usr/src/app

# Copy the package.json file to the working directory
COPY package.json ./

# Install dependencies specified in package.json
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 to allow external access to the app
EXPOSE 3000

# Set the command to run the application using the "docker-server" script from package.json
CMD ["npm","run","docker-server"]