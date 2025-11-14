# 📚 Virtual Study Group Tool

An online collaborative platform for students to study together efficiently. This web app provides user authentication, task management, real-time chat, and assignment submission functionalities to make virtual learning productive and organized.

## 🚀 Features

- ✅ **User Authentication**
  - Sign up and log in securely.
- 📝 **To-Do List**
  - Add, view, and manage personal study tasks.
- 💬 **Group Chat**
  - Communicate with peers in real-time chat channels
- 📤 **Assignment Upload**
  - Upload and access study materials or assignments.

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Express.js (Node.js)
- **Database**: MongoDB
- **Authentication**: Custom login/signup with session handling
- **Chat**: Firebase (optional) or custom WebSocket
- **Version Control**: Git & GitHub


Project folder ke andar ek file banaye:

Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]


Agar aapka main file app.js hai toh:

CMD ["node", "app.js"]

STEP 2 — Create .dockerignore

Isse unnecessary files Docker image me copy nahi hoti.

.dockerignore
node_modules
npm-debug.log
.env
Dockerfile
docker-compose.yml

STEP 3 — Build the Docker Image

Terminal me project folder me jao:

docker build -t mynodeapp .

✅ STEP 4 — Run the Docker Container
docker run -p 3000:3000 mynodeapp


Now open browser:

👉 http://localhost:3000

Your Node.js app is running inside Docker!

💠 BONUS: Docker + MongoDB (docker-compose)

Agar Node app MongoDB bhi use karta hai, toh best way hai docker-compose use karna.

docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/mydb
    depends_on:
      - mongo

  mongo:
    image: mongo
    ports:
      - "27017:27017"


Run:

docker-compose up --build
