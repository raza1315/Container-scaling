# Scaling Docker Containers using Docker Compose

## Overview
This project demonstrates how to scale Node.js containers using **Docker Compose** with **NGINX as a load balancer**. The setup includes:
- A **Node.js server** running inside Docker containers.
- **NGINX** acting as a reverse proxy/load-balancer to distribute traffic among multiple container instances.
- **Docker Compose** to manage and scale the services easily.

---

## Setup Guide

### Step 1: Create `Dockerfile` for Node.js API
This **Dockerfile** defines our Node.js service:

```dockerfile
# Use a base Node.js image
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
CMD ["pm2-runtime", "start", "index.js", "-i", "max"]
```

**Note:** We do not expose ports here, as NGINX will handle all incoming traffic.

---

### Step 2: Create `my_conf.conf` for NGINX
This configuration file makes **NGINX** listen on **port 80** and forward requests to the **Node.js containers**.

Create `conf.d/my_conf.conf`:

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://api:3000;  # Forward requests to Node.js service
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

### Step 3: Define `docker-compose.yml`
This **docker-compose** file defines two services:
1. **API (Node.js server)**
2. **NGINX (Load balancer, depends on API)**

```yaml
version: "3.8"

services:
  api:
    build: .

  nginx:
    image: nginx:latest
    volumes:
      - ./conf.d:/etc/nginx/conf.d
    depends_on:
      - api
    ports:
      - "3000:80"  # Expose NGINX on port 3000
```

---

## Running the Application

### Step 1: Build the Docker Image
```sh
docker-compose build
```

### Step 2: Start the Containers
```sh
docker-compose up --scale api=2
```
This command starts **2 instances** of the API container and **1 NGINX container**.

### Step 3: Test the Load Balancer
Open a browser or use `curl`:
```sh
curl http://localhost:3000
```
NGINX will forward the request to one of the available **API containers**.

---

## Conclusion
- **NGINX** acts as a **load balancer**, distributing requests across multiple API containers.
- The **Node.js API does not expose ports**, making it accessible only through **NGINX**.
- **Docker Compose** enables easy **horizontal scaling** using the `--scale` flag.

---

## Cleanup
To stop and remove containers, run:
```sh
docker-compose down
```

---

## Additional Notes
- You can increase the number of API instances by changing `--scale api=2` to a higher number.
- Ensure that `my_conf.conf` correctly points to the service name (`api`) used in `docker-compose.yml`.
- Modify the **NGINX configuration** if you need additional routes or custom load balancing strategies.

