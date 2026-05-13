from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Booking, Customer, Worker

# Create tables on startup (simple auto-migration)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jobboard Backend", version="1.0.0")

# Allow Next.js frontend in development (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def serialize_worker(worker: Worker):
    skills = [s.strip() for s in (worker.skill or "").split(",") if s.strip()]
    return {
        "_id": worker.id,
        "email": worker.email,
        "username": worker.username,
        "skill": skills,
        "experience": worker.experience,
    }


def serialize_customer(customer: Customer):
    return {
        "_id": customer.id,
        "email": customer.email,
        "username": customer.username,
    }


def serialize_booking_basic(booking: Booking):
    return {
        "_id": booking.id,
        "customerId": booking.customer_id,
        "workerId": booking.worker_id,
        "serviceDate": booking.service_date.isoformat() if booking.service_date else None,
        "status": booking.status,
    }


@app.get("/workers")
def list_workers(db: Session = Depends(get_db)):
    workers: List[Worker] = db.query(Worker).all()
    return [serialize_worker(w) for w in workers]

from pydantic import BaseModel


class WorkerSignup(BaseModel):
    email: str
    username: str
    password: str
    skill: str
    experience: int
    contactnumber: Optional[str] = None


@app.post("/workers/signup")
def worker_signup(
    payload: WorkerSignup,
    db: Session = Depends(get_db),
):
    # payload is validated by Pydantic, so all required fields are present and correct types
    # normalization: trim and lowercase email, trim username
    email = payload.email.strip().lower()
    username = payload.username.strip()
    password = payload.password
    skill = payload.skill
    experience = payload.experience
    contactnumber = payload.contactnumber

    existing = db.query(Worker).filter(Worker.username == username).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Username already exists"
        )

    worker = Worker(
        email=email,
        username=username,
        password=password,
        skill=skill,
        experience=experience,
        contactnumber=contactnumber,
    )
    db.add(worker)
    db.commit()
    db.refresh(worker)

    return {"message": "Worker created successfully"}


class WorkerSignin(BaseModel):
    email: str
    password: str


@app.post("/workers/signin")
def worker_signin(payload: WorkerSignin, db: Session = Depends(get_db)):
    # normalize email like signup did
    email = payload.email.strip().lower()
    password = payload.password
    worker = db.query(Worker).filter(Worker.email == email).first()
    if not worker or worker.password != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    return {
        "message": "Login successful",
        "worker": serialize_worker(worker),
    }


@app.get("/worker/{worker_id}")
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = db.query(Worker).get(worker_id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Worker not found"
        )
    # Only username and skills are used in the frontend worker detail
    return {
        "username": worker.username,
        "skill": [s.strip() for s in (worker.skill or "").split(",") if s.strip()],
    }


class CustomerSignup(BaseModel):
    email: str
    username: str
    password: str


@app.post("/customers/signup")
def customer_signup(payload: CustomerSignup, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    username = payload.username.strip()
    password = payload.password

    if not email or not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="All fields are required"
        )

    existing = db.query(Customer).filter(Customer.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already exists"
        )

    customer = Customer(email=email, username=username, password=password)
    db.add(customer)
    db.commit()

    return {"message": "Customer created successfully"}


class CustomerSignin(BaseModel):
    email: str
    password: str


@app.post("/customers/signin")
def customer_signin(payload: CustomerSignin, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    password = payload.password
    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required",
        )

    customer = db.query(Customer).filter(Customer.email == email).first()
    if not customer or customer.password != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    return {
        "message": "Login successful",
        "customer": serialize_customer(customer),
    }


@app.get("/customer/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).get(customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found"
        )
    return {
        "username": customer.username,
        "email": customer.email,
    }


class BookingCreate(BaseModel):
    customerId: int
    workerId: int


@app.post("/bookings")
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    booking = Booking(customer_id=payload.customerId, worker_id=payload.workerId)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return serialize_booking_basic(booking)


@app.get("/bookings/customer/{customer_id}")
def bookings_for_customer(customer_id: int, db: Session = Depends(get_db)):
    bookings = (
        db.query(Booking)
        .join(Worker, Booking.worker_id == Worker.id)
        .filter(Booking.customer_id == customer_id)
        .all()
    )

    formatted = []
    for b in bookings:
        formatted.append(
            {
                "_id": b.id,
                "workerName": b.worker.username if b.worker else "Unknown",
                "serviceDate": b.service_date.isoformat() if b.service_date else None,
                "status": b.status,
            }
        )
    return formatted


@app.get("/bookings/worker/{worker_id}")
def bookings_for_worker(worker_id: int, db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.worker_id == worker_id).all()
    return [serialize_booking_basic(b) for b in bookings]


class BookingUpdate(BaseModel):
    status: Optional[str] = None


@app.put("/bookings/{booking_id}")
def update_booking(booking_id: int, payload: BookingUpdate, db: Session = Depends(get_db)):
    booking = db.query(Booking).get(booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    if payload.status is not None:
        booking.status = payload.status
    db.commit()
    db.refresh(booking)
    return serialize_booking_basic(booking)


@app.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).get(booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted"}

