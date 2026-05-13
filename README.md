# Local Job Board (Full Stack Web App + Docker)

A full-stack Job Board application built using FastAPI (Backend), Next.js (Frontend), and PostgreSQL, fully containerized using Docker Compose for easy setup and deployment.

---

## Features

- Post and view job listings  
- REST API using FastAPI  
- PostgreSQL database integration  
- Modern frontend using Next.js  
- Fully containerized using Docker  
- One-command setup using Docker Compose  

---

## Tech Stack

Frontend:
- Next.js
- React

Backend:
- FastAPI
- SQLAlchemy
- Uvicorn

Database:
- PostgreSQL 15

DevOps:
- Docker
- Docker Compose

## 📁 Project Structure

```text
my-app/
├── backend/
│   ├── main.py
│   ├── database/
│   ├── models/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .env
└── README.md

## Setup & Installation

### 1️ Clone repository

git clone https://github.com/your-username/Local_Job_Board.git
cd Local_Job_Board

---

### 2️ Run with Docker (Recommended)

docker compose up --build

---

## Access Application

Frontend: http://localhost:3000  
Backend API: http://localhost:8000  
API Docs: http://localhost:8000/docs  

---

## Database Config

POSTGRES_USER=admin  
POSTGRES_PASSWORD=password  
POSTGRES_DB=mydb  

Inside Docker network use:

postgres:5432

IMPORTANT:
Do NOT use localhost inside Docker containers.

---

## Common Issues

Backend not starting:
- Check uvicorn main:app
- Check database connection

Database error:
- Use postgres instead of localhost

Frontend cannot connect:
- Use http://backend:8000 inside Docker

---

## Run Without Docker

Backend:
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Frontend:
cd frontend
npm install
npm run dev

---

## Lessons Learned

- Docker service networking
- FastAPI backend deployment
- PostgreSQL container communication
- Debugging container crashes
- Full-stack orchestration using Docker Compose
- Git workflow & repository cleanup

---

## Future Improvements

- JWT Authentication
- Role-based access (Admin/User)
- Job search & filters
- Deployment on AWS / Render / VPS
- CI/CD with GitHub Actions

---

## Author

Bilal Mehmood

---

## If you like this project

Give it a star on GitHub ⭐
