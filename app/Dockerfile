FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install missing dependencies for puppeteer in linux
RUN apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

# Bundle app source
COPY . .

# Expose port
EXPOSE 8080

# Run the app
CMD [ "node", "index.js" ]
