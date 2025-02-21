FROM node:alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for better caching)
COPY package.*json . 

#Install pm2 and other dependencies:
RUN npm i -g pm2 && npm i

COPY . .

# Expose the port your app runs on (Not exposing here because autoscaling )


# Start the app with PM2 Runtime (keeps the container alive)
CMD ["pm2-runtime","index.js"] 
